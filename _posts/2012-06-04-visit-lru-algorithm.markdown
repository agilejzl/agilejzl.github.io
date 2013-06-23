---
layout: post
title: 主存访问LRU模拟算法
date: 2012-06-4 14:50:00
categories: java
---

主存访问LRU模拟算法，练手。

{% highlight ruby %}
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * LRU算法问题：
 * 某虚拟存储器采用页式管理，主存容量为4个页面，使用LRU替换算法，若程序访存的虚页地址流为：
 * 0, 7, 0, 6, 7, 1, 6, 3, 0, 7, 2, 7, 1, 4, 0, 2，计算该程序使用主存实页位置的过程。
 * 
 * @author Jzl
 * 
 */
public class LRU {
	private static final int NUM = 4;// 主存容量
	private static final int DEFAULT = -1;//主存页面的默认值

	public static void main(String[] args) {
		int[] src = { 0, 7, 0, 6, 7, 1, 6, 3, 0, 7, 2, 7, 1, 4, 0, 2 };
		int[] defValue = { DEFAULT, 0 };// 主存实页{当前值,未被使用的次数}
		// 程序使用主存实页位置的过程信息，数据结构为：主存实页Map<第几个实页,{当前值,未被使用的次数}>
		Map<Integer, int[]> desMap = new HashMap<Integer, int[]>(NUM);
		for (int i = 0; i < NUM; i++) {
			desMap.put(i, defValue);// 初始化主存的NUM个实页为默认值
		}

		for (int i = 0; i < src.length; i++) {
			Map<Integer, int[]> tempMap = new HashMap<Integer, int[]>(NUM);
			for (int j = 0; j < NUM; j++) {
				// 主存实页{当前值,未被使用的次数}，先把所有未被使用的次数加1
				int[] value = { desMap.get(j)[0], desMap.get(j)[1] + 1 };
				tempMap.put(j, value);
			}
			boolean flag = false;// 是否访存成功
			for (int j = 0; j < NUM; j++) {
				int[] temp = { desMap.get(j)[0], desMap.get(j)[1] };
				if (temp[0] == src[i]) {
					// 命中，该页已经使用，并且值等于src[i]，未被使用的次数清0
					System.out.println("命中：src[" + i + "]，值为：" + src[i]);
					int[] value = { tempMap.get(j)[0], 0 };
					tempMap.put(j, value);
					flag = true;
					break;
				} else if (temp[0] == DEFAULT && temp[1] == i) {
					// 该页没有使用，放置src[i]，接着进行判断src[i+1]
					int[] value = temp;
					value[0] = src[i];
					value[1] = 0;// 将未被使用的次数清零
					tempMap.put(j, value);// 覆盖tempMap中之前的值
					flag = true;
					break;
				} else if (temp[0] != DEFAULT) {
					// 该页已经使用，并且值不等于src[i]，进行判断des[j+1]
					flag = false;
					continue;
				}
			}
			// 所有主存页面已经被使用，且未命中，则遍历tempMap，进行LRU式替换
			if (!flag) {
				int key = 0;// 假设为当前访问次数的最大的实页号
				int value2 = 0;// 最大的未被使用的次数
				for (int j = 0; j < NUM; j++) {
					if (tempMap.get(j)[1] > value2) {
						value2 = tempMap.get(j)[1];
						key = j;
						continue;
					}
				}
				int[] value = { src[i], 0 };
				tempMap.put(key, value);
				flag = true;
			}
			desMap = tempMap;
			System.out.print("第" + i + "次遍历desMap：");
			listMap(desMap);
		}
	}

	public static void listMap(Map<Integer, int[]> map) {
		Set<Integer> keySet = map.keySet();
		for (int key : keySet) {
			System.out.print(key + "：[" + map.get(key)[0] + ","
					+ map.get(key)[1] + "]\t");
		}
		System.out.println();
	}
}
{% endhighlight %}