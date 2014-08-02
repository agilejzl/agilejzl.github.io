---
layout: post
title: 使用mybatis实现CRUD
date: 2012-06-14 20:55:00
categories: java
---

本文介绍的是mybatis3的使用，针对使用mybatis3作为持久层框架的入门学习。下面具体讲解：

1.mybatis需要程序员手动建表，用于测试的建表语句如下：

```sql
-- oracle10g
CREATE TABLE user_tbl (
  id int PRIMARY KEY ,
  name varchar2(20),
  age int,
  sex varchar2(5),
  password varchar2(20)
)

create sequence user_seq;
INSERT INTO user_tbl VALUES (1, 'zs',18, '张三', 'zs');
```

2.连接数据库的工具类：

```java
package util;

import java.io.IOException;
import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/**
 * 连接数据库的工具类
 * @author Jzl
 *
 */
public class MybatisUtil {
  private static SqlSessionFactory sessionFactory;
  private SqlSession session;

  static {
    String resource = "mybatis3-config.xml";
    InputStream inputStream = null;
    try {
      inputStream = Resources.getResourceAsStream(resource);
    } catch (IOException e) {
      e.printStackTrace();
    }
    sessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
  }

  public static SqlSessionFactory getSqlsessionfactory() {
    return sessionFactory;
  }

  public static SqlSession getSession() {
    return sessionFactory.openSession(false);
  }

  public void closeSession(SqlSession session) {
    if (session != null) {
      session.close();
      session = null;
    }
  }
}
```

3.UserDao，用于实现对User表的CRUD操作：

```java
package dao;

import java.util.List;

import entity.User;

public interface UserDao {
  public List<User> getUserByName(String name);
  
  public List<User> getAllUser();

  public User getUser(String name);
  
  public void insertUser(User user);
  
  public void updateUser(User user);
  
  public void deleteUser(int id);
}
```

4.不同于hibernate，mybatis映射文件（这里是UserDao.xml）映射的是Dao层的方法，用于将Dao层的方法与具体的sql语句绑定。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="dao.UserDao">
  <select id="getAllUser" resultType="entity.User">
    select * from user_tbl
  </select>
  <select id="getUserByName" parameterType="String" resultType="entity.User">
    select * from user_tbl
    where name like #{name}
  </select>
  <select id="getUser" parameterType="String" resultType="entity.User">
    select * from user_tbl where
    name=#{name}
  </select>
  <insert id="insertUser" parameterType="entity.User">
    <selectKey resultType="int" order="BEFORE" keyProperty="id">
      select user_seq.nextval from dual
    </selectKey>
    insert into user_tbl (id,name,age,sex,password)
    values
    (#{id},#{name},#{age},#{sex},#{password})
  </insert>
  <update id="updateUser" parameterType="entity.User">
    update user_tbl set name = #{name},age =
    #{age},
    sex = #{sex},password = #{password} where id = #{id}
  </update>
  <delete id="deleteUser" parameterType="int">
    delete from user_tbl where id = #{id}
  </delete>
</mapper>
```

5.实体类User如下：

```java
package entity;

public class User {
  private int id;
  private String name;
  private int age;
  private String sex;
  private String password;

  public User() {
    System.out.println("--调用无参数构造方法--");
  }
  
  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getAge() {
    return age;
  }

  public void setAge(int age) {
    this.age = age;
  }

  public String getSex() {
    return sex;
  }

  public void setSex(String sex) {
    this.sex = sex;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }
}
```

6.最后就可以测试了，测试类TestUser如下：

```java
package test;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import util.MybatisUtil;
import dao.UserDao;
import entity.User;

public class TestUser {

  public void testGetByName() {
    SqlSession session = MybatisUtil.getSession();
    List<User> users = session.selectList("getUserByName", "%s%");
    for (User user : users) {
      System.out.println(user.getId() + "==" + user.getName());
    }
    session.commit();
    session.close();
  }

  public void testGetAll() {
    SqlSession session = MybatisUtil.getSession();
    List<User> users = session.selectList("getAllUser");
    for (User user : users) {
      System.out.println(user.getId() + "==" + user.getName());
    }
    session.commit();
    session.close();
  }

  public void testGet() {
    SqlSession session = MybatisUtil.getSession();
    UserDao userDao = session.getMapper(UserDao.class);
    User user = userDao.getUser("zs");
    System.out.println(user.getId() + "==" + user.getName());
    session.commit();
    session.close();
  }

  @Test
  public void testAdd() {
    SqlSession session = MybatisUtil.getSession();
    UserDao userDao = session.getMapper(UserDao.class);
    User user = new User();
    // user.setId(10);
    user.setName("zs");
    user.setPassword("zs");
    user.setAge(20);
    user.setSex("女");
    try {
      userDao.insertUser(user);
      System.out.println("id:" + user.getId());
      // session.commit();
    } catch (Exception e) {
      e.printStackTrace();
    }
    // session.close();
  }

  public void testUpdate() {
    SqlSession session = MybatisUtil.getSession();
    UserDao userDao = session.getMapper(UserDao.class);
    User user = userDao.getUser("sb");
    user.setName("sa");
    user.setAge(19);
    userDao.updateUser(user);
    session.commit();
    session.close();
  }

  public void testDelete() {
    SqlSession session = MybatisUtil.getSession();
    UserDao userDao = session.getMapper(UserDao.class);
    userDao.deleteUser(1001);
    session.commit();
    session.close();
  }
}
```
