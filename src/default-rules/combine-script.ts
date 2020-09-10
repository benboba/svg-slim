import { IDocument, ITagNode, ITextNode, NodeType } from 'svg-vdom';
import { combineText } from '../xml/combine-text';

// 合并多个 script 标签，并将内容合并为一个子节点
export const combineScript = async (dom: IDocument): Promise<void> => new Promise(resolve => {
	let firstScript: ITagNode | undefined;

	const scripts = dom.querySelectorAll('script') as ITagNode[];
	scripts.forEach(node => {
		const type = node.getAttribute('type');
		if (type && !/^(?:application|text)\/(?:javascript|ecmascript)$/.test(type)) {
			node.remove();
			return;
		}

		if (firstScript) {
			firstScript.appendChild(node.childNodes);
			node.remove();
		} else {
			firstScript = node;
		}
	});

	if (firstScript) {
		combineText(firstScript, true);
		const childNodes = firstScript.childNodes as ITextNode[];
		if (childNodes.length !== 1 || !childNodes[0].textContent) {
			// 如果内容为空，则移除 script 节点
			firstScript.remove();
		} else {
			const textContent = childNodes[0].textContent;
			if (!textContent.includes('<')) {
				// 如果没有危险代码，则由 CDATA 转为普通文本类型
				childNodes[0].nodeType = NodeType.Text;
			}
			if (textContent.slice(-1) === ';') {
				// 移除尾分号
				childNodes[0].textContent = childNodes[0].textContent.slice(0, -1);
			}

			// 把 script 标签插入到最后
			(dom.querySelector('svg') as ITagNode).appendChild(firstScript);
		}
	}

	resolve();
});
