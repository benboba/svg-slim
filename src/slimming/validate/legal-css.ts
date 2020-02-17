
// 验证是否是合法的 css
export const legalCss = async (cssString: string) => {
	return new Promise<TCSSValidateResult>((resolve, reject) => {
		const cssValidator = require('css-validator') as CSSValidator; // tslint:disable-line no-require-imports no-var-requires
		cssValidator({
			text: cssString,
			profile: 'css3svg',
		}, (err, data) => {
			resolve(data);
		});
	});
};
