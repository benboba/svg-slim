import { IDom } from '../../typings/node';
import { parseStyleTree } from '../xml/parse-style-tree';


export const rmImportant = async (dom: IDom): Promise<void> => new Promise(resolve => {
	parseStyleTree(dom);
	resolve();
});
