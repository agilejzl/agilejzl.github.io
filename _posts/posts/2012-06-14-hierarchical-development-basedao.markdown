---
layout: post
title: Java分层开发BaseDao
date: 2012-06-14 20:36:00
categories: java
---

本文介绍的是在不使用持久层框架的情况下，用Java反射写的BaseDao，简化Dao层的操作，让Dao的实现层每个方法体只有一行。所有的Dao的实现类继承BaseDao。下面具体讲如何使用BaseDao 。

1.BaseDao代码如下：

```java
package dao;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import utils.DbHelper;

public class BaseDao {
	private Connection conn = null;
	private PreparedStatement ps = null;
	private ResultSet rs = null;

	/**
	 * 查询符合条件的记录数
	 * 
	 * @param sql
	 *            要执行的sql语句
	 * @param args
	 *            给sql语句中的？赋值的参数列表
	 * @return 符合条件的记录数
	 */
	public long getCount(String sql, Object... args) {
		conn = DbHelper.getConn();
		try {
			ps = conn.prepareStatement(sql);
			for (int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			if (rs.next()) {
				return rs.getLong(1);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			DbHelper.closeConn(conn, ps, rs);
		}
		return 0L;
	}

	/**
	 * 查询实体对象的，并封装到一个集合
	 * 
	 * @param <T>
	 *            要查询的对象的集合
	 * @param sql
	 *            要执行的sql语句
	 * @param clazz
	 *            要查询的对象的类型
	 * @param args
	 *            给sql语句中的？赋值的参数列表
	 * @return 要查询的类的集合，无结果时返回null
	 */
	public <T> List<T> executeQuery(String sql, Class<T> clazz, Object... args) {
		conn = DbHelper.getConn();
		List list = new ArrayList();
		try {
			ps = conn.prepareStatement(sql);
			for (int i = 0; i < args.length; i++) {
				ps.setObject(i + 1, args[i]);
			}
			rs = ps.executeQuery();
			Field[] fs = clazz.getDeclaredFields();
			String[] colNames = new String[fs.length];
			String[] rTypes = new String[fs.length];
			Method[] methods = clazz.getMethods();
			while (rs.next()) {
				for (int i = 0; i < fs.length; i++) {
					Field f = fs[i];
					String colName = f.getName().substring(0, 1).toUpperCase()
							+ f.getName().substring(1);
					colNames[i] = colName;
					String rType = f.getType().getSimpleName();
					rTypes[i] = rType;
				}

				Object object = (T) clazz.newInstance();
				for (int i = 0; i < colNames.length; i++) {
					String colName = colNames[i];
					String methodName = "set" + colName;
					// 查找并调用对应的setter方法赋
					for (Method m : methods) {
						if (methodName.equals((m.getName()))) {
							// 如果抛了参数不匹配异常，检查JavaBean中该属性类型，并添加else分支进行处理
							if ("int".equals(rTypes[i])
									|| "Integer".equals(rTypes[i])) {
								m.invoke(object, rs.getInt(colName));
							} else if ("Date".equals(rTypes[i])) {
								m.invoke(object, rs.getDate(colName));
							} else if ("Timestamp".equals(rTypes[i])) {
								m.invoke(object, rs.getTimestamp(colName));
							} else {
								m.invoke(object, rs.getObject(colName));
							}
							break;
						}
					}
				}
				list.add(object);
			}
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DbHelper.closeConn(conn, ps, rs);
		}
		return null;
	}

	/**
	 * 以对象的形式保存或更新一个实体
	 * 
	 * @param sql
	 *            要执行的sql语句
	 * @param object
	 *            要保存或更新的实体对象
	 * @param args
	 *            不需要赋值的列标组成的数组，例如sql语句
	 *            "insert into tbl_user values(seq_user.nextval,?,?,?)"应为1
	 * @return 操作结果，1 成功，0 失败
	 */
	public int saveEntity(String sql, Object object, int... args) {
		conn = DbHelper.getConn();
		try {
			ps = conn.prepareStatement(sql);
			Class c = object.getClass();
			Field[] fields = object.getClass().getDeclaredFields();
			int temp = 1;// 正赋值的？的下标，最大下标为args的长度
			int colIndex = 1;// SQL语句中的当前字段下标
			int t = 0;// args数组的下标
			for (int j = 0; j < fields.length; j++) {
				Field field = fields[j];// 得到某个声明属性
				String methodName = "get"
						+ field.getName().substring(0, 1).toUpperCase()
						+ field.getName().substring(1);
				Method method = c.getMethod(methodName);// 得到了当前类中的一个method
				String rType = field.getType().getSimpleName().toString();
				if (t < args.length && colIndex == args[t]) {
					t++;
				} else if ("int".equals(rType) || "INTEGER".equals(rType)) {
					ps.setInt(temp++, (Integer) method.invoke(object));
				} else {
					ps.setObject(temp++, method.invoke(object));
				}
				colIndex++;// 更新索引下标
			}
			return ps.executeUpdate();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DbHelper.closeConn(conn, ps, null);
		}
		return 0;
	}

	/**
	 * 执行可变参数的SQL语句，进行保存、删除或更新操作
	 * 
	 * @param sql
	 *            要执行的sql语句，?的赋值顺序必须与args数组的顺序相同
	 * @param args
	 *            要赋值的参数列表
	 * @return 操作结果，正数 成功，0 失败
	 */
	public int saveOrUpdate(String sql, Object... args) {
		conn = DbHelper.getConn();
		try {
			ps = conn.prepareStatement(sql);
			for (int j = 0; j < args.length; j++) {
				ps.setObject(j + 1, args[j]);
			}
			return ps.executeUpdate();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			DbHelper.closeConn(conn, ps, null);
		}
		return 0;
	}
}
```

2.连接数据库的DbHelper工具类

```java
package utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

/**
 * 数据库工具类
 * 
 * @author Jzl
 * 
 */
public class DbHelper {

	/**
	 * 获得一个数据库连接
	 * 
	 * @return
	 */
	public static Connection getConn() {
		Connection conn = null;
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
			String url = "jdbc:oracle:thin:@localhost:1521:orcl";
			conn = DriverManager.getConnection(url, "scott", "tiger");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return conn;
	}

	/**
	 * 关闭数据库连接资源
	 * 
	 * @param conn
	 * @param ps
	 * @param rs
	 */
	public static void closeConn(Connection conn, Statement ps, ResultSet rs) {
		try {
			if (rs != null) {
				rs.close();
				rs = null;
			}
			if (ps != null) {
				ps.close();
				ps = null;
			}
			if (conn != null) {
				conn.close();
				conn = null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
```

3.接下来就可以测试BaseDao了。用于测试的User实体类：

```java
package entity;

import java.sql.Date;

/**
 * 用于测试的JavaBean，符合JavaBea命名规范
 * @author Jzl
 *
 */
public class User {
	private int userId;
	private String userName;
	private String userPass;
	private Date lastDate;

	/**
	 * 无参构造函数，用于反射new一个实例（必须有）
	 */
	public User() {
	}

	public User(String userName, String userPass, Date lastDate) {
		super();
		this.userName = userName;
		this.userPass = userPass;
		this.lastDate = lastDate;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserPass() {
		return userPass;
	}

	public void setUserPass(String userPass) {
		this.userPass = userPass;
	}

	public Date getLastDate() {
		return lastDate;
	}

	public void setLastDate(Date lastDate) {
		this.lastDate = lastDate;
	}

}
```

4.用于测试的UserDao：

```java
package dao;

import java.util.List;

import entity.User;

/**
 * 用于测试的UserDao
 * @author Jzl
 *
 */
public class UserDao extends BaseDao {
	public int addUser1(User user) {
		return super.saveEntity(
				"insert into tbl_user values(seq_user.nextval,?,?,?)", user, 1);
	}

	public int addUser2(User user) {
		return super.saveOrUpdate(
				"insert into tbl_user values(seq_user.nextval,?,?,?)",
				user.getUserName(), user.getUserPass(), user.getLastDate());
	}

	public int deleteUserById(int userId) {
		return super
				.saveOrUpdate("delete from tbl_user where userId=?", userId);
	}

	public int modUserById(int userId, User user) {
		return super
				.saveOrUpdate(
						"update tbl_user set userName=?,userPass=?,lastDate=? where userId=?",
						user.getUserName(), user.getUserPass(),
						user.getLastDate(), userId);
	}

	public User getUser(int userId) {
		return super.executeQuery("select * from tbl_user where userId=?",
				User.class, userId).get(0);
	}

	public List<User> getUserList() {
		return super.executeQuery("select * from tbl_user", User.class);
	}
	
	public long getUserCount(){
		return super.getCount("select count(*) from tbl_user");
	}
}
```

5.用于测试UserDao的测试类：

```java
package test;

import java.sql.Date;
import java.util.List;

import org.junit.Test;

import dao.UserDao;
import entity.User;

public class UserDaoTest {
	private UserDao userDao = new UserDao();

	@Test
	public void testUserDao() {
		testAdd1();
		testAdd2();
		testDeleteById();
		testModById();
		System.out.println(testGetById().getUserName());
		List<User> users = testGetList();
		for (User user : users) {
			System.out.println(user.getUserId() + "==" + user.getUserName());
		}
		System.out.println(testGetCount());
	}

	public int testAdd1() {
		User user = new User("zs", "zs", new Date(System.currentTimeMillis()));
		return userDao.addUser1(user);
	}

	public int testAdd2() {
		User user = new User("zs", "zs", new Date(System.currentTimeMillis()));
		return userDao.addUser2(user);
	}

	public int testDeleteById() {
		return userDao.deleteUserById(104);
	}

	public User testGetById() {
		return userDao.getUser(104);
	}

	public int testModById() {
		User user = new User("ls", "ls", new Date(System.currentTimeMillis()));
		return userDao.modUserById(104, user);
	}

	public List<User> testGetList() {
		return userDao.getUserList();
	}

	public long testGetCount() {
		return userDao.getUserCount();
	}
}
```

6.创建用于测试的数据库表：

```sql
--创建测试表
create table tbl_user
(
  userId   number(8) primary key not null,
  userName varchar2(20),
  userPass varchar2(20),
  lastDate Date
);

create sequence seq_user;
```