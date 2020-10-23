// eslint-disable-next-line @typescript-eslint/no-var-requires
import { parse as cssParse, stringify } from 'css';
import { NodeType, TagNode, TextNode } from 'svg-vdom';
import { IStyleObj } from 'typings/style';
import { TDynamicObj } from '../../typings';
import { IDom, ITag } from '../../typings/node';
import { needUnitInStyleTag } from '../const/definitions';
import { numberFullMatch } from '../const/syntax';
import { parseStyle } from '../style/parse';
import { stringifyStyle } from '../style/stringify';
import { parseStyleTree } from '../xml/parse-style-tree';

const STYLE_THRESHOLD = 3;
const TRANSLATE_THRESHOLD = 10;

const createKey = (name: string, value: string, important?: boolean) => {
	let val = value;
	if (needUnitInStyleTag.includes(name) && numberFullMatch.test(val)) {
		val += 'px';
	}
	return `${name}:${val}${important ? '!important' : ''}`;
};

// TODO：目前采用的是全字匹配的方案，是否可以考虑判断公共子序列（算法太复杂！）
export const styleToClass = async (dom: IDom): Promise<void> => new Promise(resolve => {
	parseStyleTree(dom);
	let index = 0;
	const tags = dom.querySelectorAll(NodeType.Tag) as ITag[];
	const keyCache: TDynamicObj<{
		className: string;
		tags: ITag[];
		keys: string[];
	}> = {};
	for (const tag of tags) {
		const keys: string[] = [];
		const tagStyle = tag.styles as IStyleObj;
		Object.keys(tagStyle).sort().forEach(k => {
			if (tagStyle[k].from === 'inline' && !tagStyle[k].override) {
				keys.push(createKey(k, tagStyle[k].value, tagStyle[k].important));
			}
		});
		// 过短的样式没有必要抽取
		if (keys.length >= STYLE_THRESHOLD) {
			const key = keys.join(';');
			if (!keyCache[key]) {
				keyCache[key] = {
					className: `c${(+new Date + index).toString(36)}`,
					tags: [tag],
					keys,
				};
				index++;
			} else {
				keyCache[key].tags.push(tag);
			}
		}
	}

	// 条件是 tags 和 keys 的乘积要大于 10
	const caches = Object.entries(keyCache).filter(([key, cache]) => cache.tags.length * cache.keys.length >= TRANSLATE_THRESHOLD);
	if (caches.length) {
		// 如果没有 style 标签，需要创建一个
		let styleContent = '';
		if (dom.stylesheet) {
			styleContent = stringify(dom.stylesheet);
		} else {
			const styleTag = new TagNode({
				nodeName: 'style',
				nodeType: NodeType.Tag,
			});
			const styleText = new TextNode({
				nodeName: '#text',
				nodeType: NodeType.CDATA,
				textContent: '',
			});
			styleTag.appendChild(styleText);
			const rootSVG = dom.querySelector('svg') as ITag;
			rootSVG.insertBefore(styleTag, rootSVG.childNodes[0]);
			dom.styletag = styleTag;
		}

		for (const [key, val] of caches) {
			// 创建样式
			styleContent += `.${val.className}{${key}}`;
			// 移除 style 属性中的对应样式
			val.tags.forEach(tag => {
				const styleAttr = tag.getAttribute('style') as string;
				const styleObj = parseStyle(styleAttr);
				for (let i = styleObj.length; i--;) {
					if (val.keys.includes(createKey(styleObj[i].fullname, styleObj[i].value, styleObj[i].important))) {
						styleObj.splice(i, 1);
					}
				}
				if (styleObj.length) {
					tag.setAttribute('style', stringifyStyle(styleObj));
				} else {
					tag.removeAttribute('style');
				}

				// 设置 className
				if (tag.hasAttribute('class')) {
					tag.setAttribute('class', `${tag.getAttribute('class') as string} ${val.className}`);
				} else {
					tag.setAttribute('class', val.className);
				}
			});
		}

		try {
			dom.stylesheet = cssParse(styleContent);
		} catch {
			console.log(`${styleContent} convert failed!`);
		}
	}

	resolve();
});
