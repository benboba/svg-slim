import cssValidator = require('css-validator'); // tslint:disable-line no-require-imports

// 验证是否是合法的 css
export const legalCss = async (cssString: string) => {
	return new Promise<TCSSValidateResult>((resolve, reject) => {
		cssValidator({
			text: cssString,
			profile: 'css3svg',
		}, (err, data) => {
			resolve(data);
		});
	});
};
