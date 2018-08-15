/*
 * 深度遍历所有的 Object 属性
 * @param { function } 条件
 * @param { function } 回调
 * @param { obj } 目标对象
 * @param { visited } 避免对象调用自身造成死循环
 */

const traversal = (condition, cb, obj, path, visited) => {
	if (obj in visited) {
		return;
	}
	visited.push(obj);
	if (condition(obj)) {
		cb(obj, path);
		return;
	}
	path.push(obj);
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; ) {
			const item = obj[i];
			traversal(condition, cb, item, path, visited);
			if (item === obj[i]) {
				i++;
			}
		}
	} else {
		Object.keys(obj).forEach(key => {
			if (typeof obj[key] === 'object') {
				traversal(condition, cb, obj[key], path, visited);
			}
		});
	}
	path.pop();
};

export const traversalObj = (condition, cb, obj) => {
	traversal(condition, cb, obj, [], []);
};