---
layout: post
title: MD5验证和DES加密算法
date: 2012-06-16 23:39:00
categories: algorithm
---

MD5加密生成的密钥是固定的32位，而Base64加密和DES加密，生成的密钥不是固定。

现在假如要将用户登录的密码进行加密并存入数据库，MD5加密与DES加密相结合的方式是不错的选择。因为DES加密可逆，但是较之MD5难破解些，一般银行卡账户使用的就是这种算法；另外MD5生成固定的32位密钥，便于在数据库中存储，字段长度不变，不会浪费空间。

下面就看看怎样进行加密吧。

1.MD5加密工具类

<pre><code>
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * MD5加密工具类
 * 
 */
public class Md5Util {

	/**
	 * 根据输入的字符串生成固定的32位MD5码
	 * 
	 * @param str
	 *            输入的字符串
	 * @return MD5码
	 */
	public final static String getMd5(String str) {
		MessageDigest mdInst = null;
		try {
			mdInst = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		mdInst.update(str.getBytes());// 使用指定的字节更新摘要
		byte[] md = mdInst.digest();// 获得密文
		return StrConvertUtil.byteArrToHexStr(md);
	}
}
</pre></code>

2.DES加密工具类

<pre><code>
import java.security.Key;
import java.security.Security;

import javax.crypto.Cipher;

/**
 * DES加密工具类
 */
public class DesUtil {

	private static final String ENCRYPT_TYPE = "DES";
	private static String defaultKey = "";// 字符串默认键值
	private Cipher encryptCipher = null;// 加密工具
	private Cipher decryptCipher = null;// 解密工具

	public DesUtil() throws Exception {
		this(defaultKey);
	}

	/**
	 * 指定密钥构造方法
	 * 
	 * @param strKey
	 *            指定的密钥
	 * @throws Exception
	 */
	public DesUtil(String strKey) throws Exception {
		Security.addProvider(new com.sun.crypto.provider.SunJCE());
		Key key = getKey(strKey.getBytes());
		encryptCipher = Cipher.getInstance(ENCRYPT_TYPE);
		encryptCipher.init(Cipher.ENCRYPT_MODE, key);
		decryptCipher = Cipher.getInstance(ENCRYPT_TYPE);
		decryptCipher.init(Cipher.DECRYPT_MODE, key);
	}

	/**
	 * 加密字节数组
	 * 
	 * @param arr
	 *            需加密的字节数组
	 * @return 加密后的字节数组
	 * @throws Exception
	 */
	private byte[] encryptStr(byte[] arr) throws Exception {
		return encryptCipher.doFinal(arr);
	}

	/**
	 * 加密字符串
	 * 
	 * @param strIn
	 *            需加密的字符串
	 * @return 加密后的字符串
	 * @throws Exception
	 */
	public String encrypt(String strIn) throws Exception {
		return StrConvertUtil.byteArrToHexStr(encryptStr(strIn.getBytes()));
	}

	/**
	 * 解密字节数组
	 * 
	 * @param arr
	 *            需解密的字节数组
	 * @return 解密后的字节数组
	 * @throws Exception
	 */
	private byte[] decryptStr(byte[] arr) throws Exception {
		return decryptCipher.doFinal(arr);
	}

	/**
	 * 解密字符串
	 * 
	 * @param strIn
	 *            需解密的字符串
	 * @return 解密后的字符串
	 * @throws Exception
	 */
	public String decrypt(String strIn) throws Exception {
		return new String(decryptStr(StrConvertUtil.hexStrToByteArr(strIn)));
	}

	/**
	 * 从指定字符串生成密钥，密钥所需的字节数组长度为8位。不足8位时后面补0，超出8位只取前8位
	 * 
	 * @param arrBTmp
	 *            构成该字符串的字节数组
	 * @return 生成的密钥
	 */
	private Key getKey(byte[] arrBTmp) {
		byte[] arrB = new byte[8];// 创建一个空的8位字节数组（默认值为0）
		// 将原始字节数组转换为8位
		for (int i = 0; i < arrBTmp.length && i < arrB.length; i++) {
			arrB[i] = arrBTmp[i];
		}
		Key key = new javax.crypto.spec.SecretKeySpec(arrB, ENCRYPT_TYPE);// 生成密钥
		return key;
	}

}
</pre></code>

3.字符串转换工具类

<pre><code>
/**
 * 字符串转换工具类
 * 
 */
public class StrConvertUtil {

	/**
	 * 将byte数组转换为表示16进制值的字符串，如：byte[]{8,18}转换为：0813， 和public static byte[]
	 * hexStrToByteArr(String strIn) 互为可逆的转换过程
	 * 
	 * @param arrB
	 *            需要转换的byte数组
	 * @return 转换后的字符串
	 */
	public static String byteArrToHexStr(byte[] arrB) {
		int iLen = arrB.length;
		// 每个byte(8位)用两个(16进制)字符才能表示，所以字符串的长度是数组长度的两倍
		StringBuffer sb = new StringBuffer(iLen * 2);
		for (int i = 0; i < iLen; i++) {
			int intTmp = arrB[i];
			while (intTmp < 0) {// 把负数转换为正数
				intTmp = intTmp + 256;
			}
			if (intTmp < 16) {// 小于0F的数需要在前面补0
				sb.append("0");
			}
			sb.append(Integer.toString(intTmp, 16));
		}
		return sb.toString();
	}

	/**
	 * 将表示16进制值的字符串转换为byte数组，和public static String byteArrToHexStr(byte[] arrB)
	 * 互为可逆的转换过程
	 * 
	 * @param strIn
	 *            需要转换的字符串
	 * @return 转换后的byte数组
	 */
	public static byte[] hexStrToByteArr(String strIn) {
		byte[] arrB = strIn.getBytes();
		int iLen = arrB.length;
		// 两个(16进制)字符表示一个字节(8位)，所以字节数组长度是字符串长度除以2
		byte[] arrOut = new byte[iLen / 2];
		for (int i = 0; i < iLen; i = i + 2) {
			String strTmp = new String(arrB, i, 2);
			arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);
		}
		return arrOut;
	}

}
</pre></code>

4.最后当然是测试类咯

<pre><code>
public class Test {
	public static void main(String[] args) {
		try {
			DesUtil des = new DesUtil("Java");// 自定义密钥
			String src = "需要进行加密的字符串";
			String src1 = des.encrypt(src);
			String src2 = des.decrypt(src1);
			String src3 = Md5Util.getMd5(src1);
			System.out.println("DES加密前的字符：" + src + "，长度：" + src.length());
			System.out.println("DES加密后的字符：" + src1 + "，长度：" + src1.length());
			System.out.println("DES解密后的字符：" + src2 + "，长度：" + src2.length());
			System.out.println("MD5加密后的字符：" + src3 + "，长度：" + src3.length());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
</pre></code>

5.测试结果输出

<pre><code>
DES加密前的字符：需要进行加密的字符串，长度：10
DES加密后的字符：d50ef6bf3e3e51585297c0120f76a65f9d52d38e4cf5f47946124a1b8488e3b9，长度：64
DES解密后的字符：需要进行加密的字符串，长度：10
MD5加密后的字符：842913073af5f2555c1042832eba999f，长度：32
</pre></code>
