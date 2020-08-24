import { numberPattern } from './syntax';

export const cssAll = 'initial|inherit|unset|revert';

export const cssTimeFullMatch = new RegExp(`^${numberPattern}m?s$`);

export const cssEasingFunction = 'linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end';
export const cubicBezierFunc: IFnDef = {
	name: 'cubic-bezier',
	valueLen: [0, 4],
	values: [
		{
			type: 'number',
			area: [0, 1],
		},
		{
			type: 'number',
		},
	],
	valueRepeat: [2, 0],
};
export const stepsFunc: IFnDef = {
	name: 'steps',
	valueLenArea: [1, 2],
	values: [
		{
			type: 'int',
			area: [1, Infinity],
		},
		{
			type: 'enum',
			enum: 'jump-start|jump-end|jump-none|jump-both|start|end',
		},
	],
	valueRepeat: [2, 0],
};
