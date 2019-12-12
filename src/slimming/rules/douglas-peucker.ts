import { anyPass, propEq } from 'ramda';
import { douglasPeucker as DP } from '../algorithm/douglas-peucker';
import { traversalNode } from '../xml/traversal-node';

export const douglasPeucker = async (rule: TConfigItem[], dom: INode): Promise<null> => new Promise((resolve, reject) => {
	if (rule[0] && rule[1]) {
		traversalNode(anyPass([propEq('nodeName', 'polygon'), propEq('nodeName', 'polyline')]), (node: INode) => {
			const pointsVal = node.getAttribute('points');
			if (pointsVal) {
				const paths: number[] = pointsVal.trim().split(/[,\s]+/).map(parseFloat);
				node.setAttribute('points', DP(rule[1] as number, paths).join(','));
			}
		}, dom);
	}
	resolve();
});
