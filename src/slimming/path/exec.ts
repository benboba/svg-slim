import { APOS_LARGE, APOS_LEN, APOS_SWEEP } from '../const';
import { numberSequence } from '../const/syntax';
import { execNumberList } from '../utils/exec-numberlist';
import { execArc } from './exec-arc';

const pathReg = new RegExp(`([mzlhvcsqta])\\s*((?:${numberSequence})?)(.*?)(?=[mzlhvcsqta]|$)`, 'gim');

export const execPath = (str: string): IPathItem[][] => {
	const result: IPathItem[][] = [];
	let temp: IPathItem[] = [];

	// 重置正则匹配位置
	pathReg.lastIndex = 0;

	let match = pathReg.exec(str);
	outer: while (match !== null) {
		// 所有路径必须从 mM 开始
		const type = match[1].toLowerCase();
		if (!temp.length && type !== 'm') {
			return result;
		}
		let val: number[] = [];
		if (match[2]) {
			val = type === 'a' ? execArc(match[2]) : execNumberList(match[2]);
		}
		switch (type) {
			// 平移的参数必须为偶数
			case 'm':
				result.push(temp);
				temp = [];
				if (val.length % 2 !== 0) {
					if (val.length > 2) {
						temp.push({
							type: match[1],
							val: val.slice(0, val.length - 1),
						});
					}
					break outer;
				}
				break;
			case 'l':
			case 't':
				// l 和 t 的参数必须为偶数
				if (val.length % 2 !== 0) {
					if (val.length > 2) {
						temp.push({
							type: match[1],
							val: val.slice(0, val.length - 1),
						});
					}
					break outer;
				}
				break;
			case 'z':
				// z 不允许有参数
				if (val.length) {
					temp.push({
						type: match[1],
						val: [],
					});
					break outer;
				}
				break;
			case 's':
			case 'q':
				// s 和 q 的参数必须是 4 的整倍数
				if (val.length % 4 !== 0) {
					if (val.length > 4) {
						temp.push({
							type: match[1],
							val: val.slice(0, val.length - val.length % 4),
						});
					}
					break outer;
				}
				break;
			case 'c':
				// c 的参数必须是 6 的整倍数
				if (val.length % 6 !== 0) {
					if (val.length > 6) {
						temp.push({
							type: match[1],
							val: val.slice(0, val.length - val.length % 6),
						});
					}
					break outer;
				}
				break;
			case 'a':
				// a 的参数第 3、4 位必须是 0 或 1
				const _val: number[] = [];
				val.every((v, i) => {
					if ((i % APOS_LEN === APOS_LARGE || i % APOS_LEN === APOS_SWEEP) && v !== 0 && v !== 1) {
						return false;
					}
					_val.push(v);
					return true;
				});
				// a 的参数必须是 7 的整倍数
				if (_val.length % APOS_LEN !== 0) {
					if (_val.length > APOS_LEN) {
						temp.push({
							type: match[1],
							val: _val.slice(0, _val.length - _val.length % APOS_LEN),
						});
					}
					break outer;
				}
				break;
			default:
				break;
		}
		// 只有 z 指令不能没有参数
		if (type !== 'z' && !val.length) {
			break outer;
		}
		temp.push({
			type: match[1],
			val,
		});
		if (match[3] && !/^\s*,?\s*$/.test(match[3])) {
			break;
		}
		match = pathReg.exec(str);
	}
	result.push(temp);
	return result;
};
