import { attrChar, classChar, idChar, pseudoChar } from '../const/regs';
import { attrModifier, selectorUnitCombinator } from './define';

export const execSelector = (selector: string): ISelector[] => {
	const selectors: ISelector[] = [];
	const selectorUnitReg = new RegExp(`^([^\\s>+~#\\.\\[:]+|\\*)?((?:${idChar}|${classChar}|${attrChar}|${pseudoChar})*)([\\s>+~]+|$)`);
	let selectorStr = selector;
	let selectorExec = selectorUnitReg.exec(selectorStr);
	while (selectorExec && selectorExec[0].length) {
		const selectorUnit: ISelector = { id: [], class: [], attr: [], pseudo: [] };
		if (selectorExec[1]) {
			if (selectorExec[1] === '*') {
				selectorUnit.universal = true;
			} else {
				selectorUnit.type = selectorExec[1];
			}
		}
		if (selectorExec[2]) {
			let specialStr = selectorExec[2];
			const specialReg = new RegExp(`^(?:${idChar}|${classChar}|${attrChar}|${pseudoChar})`);
			let specialExec = specialReg.exec(specialStr);
			while (specialExec) {
				switch (specialExec[0][0]) {
					case '.': // class 选择器
						selectorUnit.class.push(specialExec[0].slice(1));
						break;
					case '[': // 属性选择器
						const attrStr: string = specialExec[0].slice(1, -1);
						const eqIndex: number = attrStr.indexOf('=');
						if (eqIndex === -1) {
							// 没有等号的情况
							selectorUnit.attr.push({
								key: attrStr,
							});
						} else {
							// 取出等号修饰符
							// tslint:disable-next-line strict-type-predicates
							if (typeof attrModifier[attrStr[eqIndex - 1] as keyof typeof attrModifier] === 'number') {
								selectorUnit.attr.push({
									key: attrStr.slice(0, eqIndex - 1),
									modifier: attrModifier[attrStr[eqIndex - 1] as keyof typeof attrModifier] as number,
									value: attrStr.slice(eqIndex + 1),
								});
							} else {
								selectorUnit.attr.push({
									key: attrStr.slice(0, eqIndex),
									value: attrStr.slice(eqIndex + 1),
								});
							}
						}
						break;
					case ':': // 伪类，伪元素
						const isClass = specialExec[0][1] !== ':';
						const pseudoStr = specialExec[0].replace(/^:+/, '');
						const parenIndex: number = pseudoStr.indexOf('(');
						if (parenIndex === -1) {
							// 不是函数型伪类
							selectorUnit.pseudo.push({
								func: pseudoStr,
								isClass,
							});
						} else {
							selectorUnit.pseudo.push({
								func: pseudoStr.slice(0, parenIndex),
								value: pseudoStr.slice(parenIndex + 1, -1),
								isClass,
							});
						}
						break;
					default: // id 选择器
						selectorUnit.id.push(specialExec[0].slice(1));
						break;
				}
				specialStr = specialStr.slice(specialExec[0].length);
				specialExec = specialReg.exec(specialStr);
			}
		}
		if (selectorExec[3]) {
			const combinator = selectorExec[3].trim();
			// tslint:disable-next-line strict-type-predicates
			if (typeof selectorUnitCombinator[combinator as keyof typeof selectorUnitCombinator] === 'number') {
				selectorUnit.combinator = selectorUnitCombinator[combinator as keyof typeof selectorUnitCombinator] as number;
			}
		}
		selectors.push(selectorUnit);
		selectorStr = selectorStr.slice(selectorExec[0].length);
		selectorExec = selectorUnitReg.exec(selectorStr);
	}

	return selectors;
};
