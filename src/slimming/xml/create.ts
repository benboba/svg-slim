import { INode, NodeType } from '../../node/index';
import { mixWhiteSpace } from '../utils/mix-white-space';

export function createNode(node: INode): string {
	let xml = '';
	switch (node.nodeType) {
		case NodeType.Tag:
			xml += createTag(node);
			break;
		case NodeType.Text:
			xml += node.textContent;
			break;
		case NodeType.XMLDecl:
			xml += `<?xml${mixWhiteSpace(` ${node.textContent}`).replace(/\s(?="|=|$)/g, '')}?>`;
			break;
		case NodeType.Comments:
			const comments = mixWhiteSpace(node.textContent).trim();
			if (comments) {
				xml += `<!--${comments}-->`;
			}
			break;
		case NodeType.CDATA:
			const cdata = node.textContent;
			if (cdata.indexOf('<') === -1) {
				xml += cdata;
			} else {
				xml += `<![CDATA[${cdata}]]>`;
			}
			break;
		case NodeType.DocType:
			xml += `<!DOCTYPE${mixWhiteSpace(` ${node.textContent.trim()}`)}>`;
			break;
		default:
			break;
	}
	return xml;
}

export function createTag(node: INode): string {
	let xml = '';
	xml += `<${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}`;
	if (node.attributes.length) {
		for (const { name, value, namespace } of node.attributes) {
			if (value.trim()) {
				xml += ` ${namespace ? `${namespace}:` : ''}${name}="${mixWhiteSpace(value.trim()).replace(/"/g, '&quot;')}"`;
			}
		}
	}

	if (node.childNodes.length) {
		xml += '>';
		node.childNodes.forEach(childNode => {
			xml += createNode(childNode);
		});
		xml += `</${node.namespace ? `${node.namespace}:` : ''}${node.nodeName}>`;
	} else {
		xml += '/>';
	}
	return xml;
}

export const createXML = (dom: INode): string => {
	if (!dom) {
		return '';
	}

	let result = '';
	dom.childNodes.forEach(node => {
		result += createNode(node);
	});

	return result;
};
