---
layout: post
title: 五子棋问题求解算法
date: 2012-07-15 00:16:00
categories: algorithm
---

M*M宫格棋盘求解是否存在N个棋子连在一条线上，比如N=5就是常见的五子棋问题。

<pre><code>
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * M*M宫格棋盘求解是否存在N个棋子连在一条线上， 比如N=5就是常见的五子棋问题
 */
public class Chess {
	private static final int M = 6;// 棋盘的宫格数
	private static final int N = 5;// N子棋问题

	public static void main(String[] args) {
		Chess chess = new Chess();
		chess.solve();
	}

	public void solve() {
		int[][] data = new int[M][M];
		Random random = new Random();
		for (int i = 0; i < M; i++) {
			for (int j = 0; j < M; j++) {
				// 每随机放一个棋子就判断一次
				if (random.nextBoolean()) {
					data[i][j] = 1;
					if (judge(data)) {
						System.out.println("==棋盘中存在" + N + "个棋在一条线。==");
						print(data);
						return;
					} else {
						System.out.println("棋盘中不存在" + N + "个棋在一条线。");
						print(data);
					}
				}
			}
		}
	}

	// 判断是否存在N个棋子连在一条线上
	public boolean judge(int[][] data) {
		boolean flag = false;
		// 需要判断M-(N-2)宫格是否存在N个棋子连在一条线上
		for (int i = 0; i < data.length - (N - 1); i++) {
			for (int j = 0; j < data[i].length - (N - 1); j++) {
				int[][] temp = new int[N][N];
				for (int x = 0; x < N; x++) {
					for (int y = 0; y < N; y++) {
						temp[x][y] = data[x + i][y + j];
					}
				}
				if (judgeArr(temp)) {
					return true;
				}
			}
		}
		return flag;
	}

	// 判断一个N维矩阵是否存在N个棋子连在一条线上
	private boolean judgeArr(int[][] data) {
		boolean flag = false;
		Map<Integer, Integer> rowMap = new HashMap<Integer, Integer>(N);// 记录某行的棋子数
		Map<Integer, Integer> colMap = new HashMap<Integer, Integer>(N);// 记录某列的棋子数
		// 统计所有棋子的位置特性
		for (int i = 0; i < N; i++) {
			for (int j = 0; j < N; j++) {
				if (data[i][j] == 1) {
					// 统计某行的棋子数
					if (rowMap.containsKey(i)) {
						rowMap.put(i, rowMap.get(i) + 1);
					} else {
						rowMap.put(i, 1);
					}
					// 统计某列的棋子数
					if (colMap.containsKey(j)) {
						colMap.put(j, colMap.get(j) + 1);
					} else {
						colMap.put(j, 1);
					}
				}
			}
		}
		
		int lcount = 0;// “\”对角线方向上的棋子数
		int rcount = 0;// “/”对角线方向上的棋子数
		for (int i = 0; i < N; i++) {
			if (rowMap.get(i) != null && rowMap.get(i) == N) {
				return true;
			}
			if (colMap.get(i) != null && colMap.get(i) == N) {
				return true;
			}
			if (data[i][i] == 1) {
				lcount++;
				if (lcount == N) {
					return true;
				}
			}
			if (data[i][N - i - 1] == 1) {
				rcount++;
				if (rcount == N) {
					return true;
				}
			}
		}
		return flag;
	}

	// 打印矩阵中的数据
	private void print(int[][] data) {
		System.out.println("矩阵中的数据：");
		for (int i = 0; i < data.length; i++) {
			for (int j = 0; j < data[i].length; j++) {
				System.out.print(" " + data[i][j]);
			}
			System.out.println();
		}
	}
}
</pre></code>
