/*
 * 深度遍历所有的 Object 属性
 * @param { function } 条件
 * @param { function } 回调
 * @param { object } 目标对象
 * @param { object[] } 避免对象调用自身造成死循环
 * @param { boolean } 是否深度优先，是的话会先遍历子元素
 */

const traversal = async <T>(
	condition: (o: T | T[]) => boolean,
	cb: (o: T, p: Array<T | T[]>) => Promise<void>,
	obj: T | T[],
	path: Array<T | T[]>,
	visited: Array<T | T[]>,
	deep: boolean,
) => new Promise<void>(async resolve => {
	if (visited.includes(obj)) {
		resolve();
		return;
	}
	visited.push(obj);
	if (!deep) {
		if (condition(obj)) {
			await cb(obj as T, path);
			resolve();
			return;
		}
	}
	path.push(obj);
	if (Array.isArray(obj)) {
		// 创建副本以解决样式问题
		const arr = obj.slice();
		for (const item of arr) {
			await traversal(condition, cb, item, path, visited, deep);
		}
	} else {
		for (const item of Object.values(obj)) {
			if (typeof item === 'object') {
				await traversal(condition, cb, item as unknown as T | T[], path, visited, deep);
			}
		}
	}
	path.pop();
	if (condition(obj)) {
		await cb(obj as T, path);
	}
	resolve();
});

export const traversalObjAsync = async <T>(condition: (o: T | T[]) => boolean, cb: (o: T, p: Array<T | T[]>) => Promise<void>, obj: T | T[], deep = false) => traversal<T>(condition, cb, obj, [], [], deep);
