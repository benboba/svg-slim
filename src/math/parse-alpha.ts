import { createFullMatch } from '../const/regs';
import { numberPattern } from '../const/syntax';
import { validOpacity } from './valid';

const alphaReg = createFullMatch(`(${numberPattern})(%?)`);

// 解析 opacity 类型的值，成功解析返回 0~1 之间的数值，无法解析则返回原始字符串
export const parseAlpha = (s: string) => {
	const alpha = alphaReg.exec(s);
	if (alpha) {
		return validOpacity(alpha[2], alpha[1]);
	}
	return s;
};
