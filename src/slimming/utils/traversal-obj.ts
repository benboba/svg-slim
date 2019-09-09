/*
 * 深度遍历所有的 Object 属性
 * @param { function } 条件
 * @param { function } 回调
 * @param { object } 目标对象
 * @param { object[] } 避免对象调用自身造成死循环
 * @param { boolean } 是否深度优先，是的话会先遍历子元素
 */

const traversal = <T>(condition: (o: T | T[]) => boolean, cb: (o: T, p: Array<T | T[]>) => void, obj: T | T[], path: Array<T | T[]>, visited: Array<T | T[]>, deep: boolean) => {
	if (visited.indexOf(obj) !== -1) {
		return;
	}
	visited.push(obj);
	if (!deep) {
		if (condition(obj)) {
			cb(obj as T, path);
			return;
		}
	}
	path.push(obj);
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length;) {
			const item = obj[i];
			traversal(condition, cb, item, path, visited, deep);
			if (item === obj[i]) {
				i++;
			}
		}
	} else {
		for (const key in obj) {
			if (typeof obj[key] === 'object') { // tslint:disable-line strict-type-predicates
				traversal(condition, cb, obj[key] as unknown as T | T[], path, visited, deep);
			}
		}
	}
	path.pop();
	if (deep) {
		if (condition(obj)) {
			cb(obj as T, path);
		}
	}
};

export const traversalObj = <T>(condition: (o: T | T[]) => boolean, cb: (o: T, p: Array<T | T[]>) => void, obj: T | T[], deep = false) => {
	traversal<T>(condition, cb, obj, [], [], deep);
};
