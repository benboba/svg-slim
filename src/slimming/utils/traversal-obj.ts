import { IUnknownObj } from '../interface/unknown-obj';

/*
 * 深度遍历所有的 Object 属性
 * @param { function } 条件
 * @param { function } 回调
 * @param { obj } 目标对象
 * @param { visited } 避免对象调用自身造成死循环
 */

const traversal = (condition: (o: Object) => boolean, cb: (o: Object, p: Object[]) => void, obj: Object, path: Object[], visited: Object[]) => {
	if (visited.indexOf(obj) !== -1) {
		return;
	}
	visited.push(obj);
	if (condition(obj)) {
		cb(obj, path);
		return;
	}
	path.push(obj);
	if (Array.isArray(obj)) {
		for (let i = 0; i < (obj as Object[]).length;) {
			const item: Object = (obj as Object[])[i];
			traversal(condition, cb, item, path, visited);
			if (item === (obj as Object[])[i]) {
				i++;
			}
		}
	} else {
		Object.keys(obj).forEach(key => {
			// tslint:disable-next-line
			if (typeof (obj as IUnknownObj)[key] === 'object') {
				traversal(condition, cb, (obj as IUnknownObj)[key] as Object, path, visited);
			}
		});
	}
	path.pop();
};

export const traversalObj = (condition: (o: Object) => boolean, cb: (o: Object, p: Object[]) => void, obj: Object) => {
	traversal(condition, cb, obj, [], []);
};
