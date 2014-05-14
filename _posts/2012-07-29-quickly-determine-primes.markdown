---
layout: post
title: Java版快速判定素数算法
date: 2012-07-29 22:22:00
categories: java
---

快速判定素数，用素数判定素数。

{% highlight ruby %}
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * 快速判定素数，用素数判定素数。比如求1-100之间的素数，
 * 先求1-10之间的素数为[2,3,5,7]，
 * 再用11-100的数%[2,3,5,7]，不能被整除的就是素数
 */
public class Prime {

	public static void main(String[] args) {
		Scanner sc = new Scanner(System.in);
		System.out.println("请输入两个数并按回车键(格式为a b)：");
		while (true) {
			long n1 = sc.nextLong();
			long n2 = sc.nextLong();
			List<Long> primeList = getPrime(n1, n2);
			for (Long prime : primeList) {
				System.out.print(prime + " ");
			}
			System.out.println();
		}
	}

	public static List<Long> getPrime(long begin, long end) {
		List<Long> result = new ArrayList<Long>();// result用于保存begin-end之间的所有素数
		List<Long> tempPrime = new ArrayList<Long>();// 保存2-Math.sqrt(end)之间的所有素数
		for (long i = 2; i <= Math.sqrt(end); i++) {
			if (isPrime(i)) {
				tempPrime.add(i);
				// System.out.print(i + " ");
			}
		}
		// System.out.println();
		for (long prime : tempPrime) {
			if (prime >= begin) {
				result.add(prime);
			}
		}

		long start = (long) Math.sqrt(end);
		if (start > begin) {
			begin = start;
		}
		for (long i = begin; i <= end; i++) {
			boolean flag = true;
			for (long prime : tempPrime) {
				if (i % prime == 0) {
					flag = false;
					break;
				}
			}
			if (flag) {
				result.add(i);
			}
		}
		return result;
	}

	/**
	 * 直接判定一个数是否为素数
	 */
	public static boolean isPrime(long n) {
		for (long i = 2; i <= Math.sqrt(n); i++) {
			if (n % i == 0) {
				return false;
			}
		}
		if (n <= 1L) {
			return false;
		}
		return true;
	}
}
{% endhighlight %}
