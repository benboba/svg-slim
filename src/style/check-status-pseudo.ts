import { ISelector, parseSelector } from 'svg-vdom';
import { statusPseudoClass, statusPseudoElement } from '../const/definitions';

// 检查
export const checkStatusPseudo = (selectors: ISelector[]) => selectors.some(selector => selector.pseudo.some(p => {
	if (statusPseudoElement.includes(p.func)) {
		return true;
	}
	if (p.isClass && statusPseudoClass.includes(p.func)) {
		return true;
	}
	if (p.func === 'not' && p.value) {
		const notSelectorGroups = parseSelector(p.value);
		if (notSelectorGroups.some(notSelectors => notSelectors.some(notSelector => notSelector.pseudo.some(notP => statusPseudoElement.includes(notP.func) || (notP.isClass && statusPseudoClass.includes(notP.func)))))) {
			return true;
		}
	}
	return false;
}));
