import { INode } from '../../node/index';
import { shapeElements } from '../const/definitions';
import { regularTag } from '../const/regular-tag';
import { execStyle } from '../style/exec';
import { isTag } from '../xml/is-tag';
import { rmNode } from '../xml/rm-node';
import { traversalNode } from '../xml/traversal-node';

export const rmHidden = (rule, dom) => new Promise((resolve, reject) => {
    if (rule[0]) {
        traversalNode(isTag, (node: INode) => {

            // 未包含子节点的文本容器视为隐藏节点
            if (!node.childNodes.length && regularTag[node.nodeName].containTextNode) {
                rmNode(node);
                return;
            }

            const attrObj: any = {};
            let styleObj = null;

            node.attributes.forEach(attr => {
                if (attr.fullname === 'style') {
                    styleObj = execStyle(attr.value);
                } else {
                    attrObj[attr.fullname] = attr.value;
                }
            });

            // style 覆盖 attr
            if (styleObj) {
                // 考虑到可能未排重
                styleObj.forEach(s => {
                    attrObj[s.name] = s.value;
                });
            }

            if (attrObj.display === 'none') {
                rmNode(node);
                return;
            }

            const noFill: boolean = attrObj.fill === 'none';
            const noStroke: boolean = attrObj.stroke === 'none';

            if (noFill && noStroke) {
                if (shapeElements.indexOf(node.nodeName) !== -1) {
                    rmNode(node);
                    return;
                }
            }

            switch (node.nodeName) {

        		// 路径必须有 d 属性
                case 'path':
                    if (!attrObj.d) {
                        rmNode(node);
                    }
                    break;

                // 矩形的宽高必须均大于 0
                case 'rect':
                    if (isNaN(parseFloat(attrObj.width)) || isNaN(parseFloat(attrObj.height)) || parseFloat(attrObj.width) <= 0 || parseFloat(attrObj.height) <= 0) {
                        rmNode(node);
                    }
                    break;

                // 圆和椭圆的半径必须大于 0
                case 'circle':
                    if (isNaN(parseFloat(attrObj.r)) || parseFloat(attrObj.r) <= 0) {
                        rmNode(node);
                    }
                    break;
                case 'ellipse':
                    if (isNaN(parseFloat(attrObj.rx)) || isNaN(parseFloat(attrObj.ry)) || parseFloat(attrObj.rx) <= 0 || parseFloat(attrObj.ry) <= 0) {
                        rmNode(node);
                    }
                    break;

                // 线段长度不能为 0
                case 'line':
                	const xyObj = {
                		x1: '0',
                		y1: '0',
                		x2: '0',
                		y2: '0',
                	};
                	Object.assign(xyObj, attrObj);
                    if (xyObj.x1 === xyObj.x2 && xyObj.y1 === xyObj.y2) {
                        rmNode(node);
                    }
                    break;

        		// polyline 和 polygon 必须有 points 属性
                case 'polyline':
                    if (!attrObj.points) {
                        rmNode(node);
                    }
                    break;
                case 'polygon':
                    if (!attrObj.points) {
                        rmNode(node);
                    }
                    break;

                default:
                	break;
            }
        }, dom);
    }
    resolve();
});