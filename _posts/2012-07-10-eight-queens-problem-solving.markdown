---
layout: post
title: 八皇后问题求解算法
date: 2012-07-10 19:41:00
categories: algorithm
---

求解N皇后问题，用一个N位的N进制数表示棋盘上皇后的位置。

<pre><code>
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

/**
 * 求解N皇后问题，用一个N位的N进制数表示棋盘上皇后的位置。 比如N=8时：45615353 表示：第0列皇后在第4个位置， 第1列皇后在第5个位置，
 * 第2列皇后在第6个位置 ，...，第7列皇后在第3个位置。循环变量从 00000000 加到 77777777
 * （8进制数）的过程，就遍历了皇后所有的情况。程序中用八进制数用一个一维数组 data[]表示，横列冲突：data ==
 * data[j]，斜列冲突：(data+i) == (data[j]+j) 或者 (data-i) == (data[j]-j)。
 * 
 */
public class Queen {
	private static final int N = 8;
	private int[][] arr = new int[N][N];

	public static void main(String[] args) {
		long startTime = System.currentTimeMillis();
		Queen queen = new Queen();
		int count = queen.solve();
		System.out.println("共有" + count + "个解。");
		long endTime = System.currentTimeMillis();
		System.out.println("运行时间为：" + (endTime - startTime) + "ms");
	}

	// 求出所有解法
	public int solve() {
		int count = 0;
		Scanner sc = new Scanner(System.in);
		for (int t = 0; t < Math.pow(N, N); t++) {
			initArr();
			int[] data = intToArr(t);// 一维数组 data[]表示所有皇后的位置
			if (judgeArr(data)) {
				for (int i = 0; i < N; i++) {
					arr[i][data[i]] = 1;
				}
				count++;
				System.out.println("第" + count + "个解：");
				print();
				System.out.println("键入enter求下一个解。");
				if (sc.nextLine() != null) {
					continue;
				}
			}
		}
		return count;
	}

	// 判断矩阵是否符合条件
	private boolean judgeArr(int[] data) {
		boolean flag = true;
		Map<Integer, Integer> map = new HashMap<Integer, Integer>(N);
		Map<Integer, Integer> subMap = new HashMap<Integer, Integer>(N);
		Map<Integer, Integer> sumMap = new HashMap<Integer, Integer>(N);
		map.clear();
		subMap.clear();
		sumMap.clear();
		for (int i = 0; i < data.length; i++) {
			// 检测冲突，排除列冲突，使每一列只放一个皇后
			if (!map.containsValue(data[i])) {
				map.put(i, data[i]);
				int sub = map.get(i) - i;
				int sum = map.get(i) + i;
				// 排除"\"方向斜列冲突
				if (!subMap.containsValue(sub)) {
					subMap.put(i, sub);
				} else {
					flag = false;
					break;
				}
				// 排除"/"方向斜列冲突
				if (!sumMap.containsValue(sum)) {
					sumMap.put(i, sum);
				} else {
					flag = false;
					break;
				}
			} else {
				flag = false;
				break;
			}
		}
		return flag;
	}

	// 初始化矩阵
	private void initArr() {
		for (int i = 0; i < arr.length; i++) {
			for (int j = 0; j < arr[i].length; j++) {
				arr[i][j] = 0;
			}
		}
	}

	// 将0~Math.pow(W, W)的数转换为W位W进制的数
	private int[] intToArr(int n) {
		String str = Integer.toString(n, N);
		while (str.length() < N) {
			str = "0" + str;
		}
		char[] c = str.toCharArray();
		int[] data = new int[N];
		for (int i = 0; i < c.length; i++) {
			data[i] = Integer.parseInt(c[i] + "");
		}
		return data;
	}

	// 打印矩阵中的数据
	private void print() {
		// System.out.println("矩阵中的数据：");
		for (int i = 0; i < arr.length; i++) {
			for (int j = 0; j < arr[i].length; j++) {
				System.out.print(" " + arr[i][j]);
			}
			System.out.println();
		}
	}
}
</pre></code>
