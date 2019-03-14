import { ISelector, ISeletorPriority } from './define';

export function getSelectorPriority(seletors: ISelector[]): ISeletorPriority {
	const priority: ISeletorPriority = {
		id: 0,
		class: 0,
		tag: 0
	};
	seletors.forEach(seletor => {
		priority.id += seletor.id.length;
		priority.class += seletor.class.length + seletor.pseudo.length + seletor.attr.length;
		priority.tag += seletor.type ? 1 : 0;
	});
	return priority;
}

export function overrideAble(priority1: ISeletorPriority, priority2: ISeletorPriority): boolean {
	if (priority1.id !== priority2.id) {
		return priority1.id > priority2.id;
	} else if (priority1.class !== priority2.class) {
		return priority1.class > priority2.class;
	} else if (priority1.tag !== priority2.tag) {
		return priority1.tag > priority2.tag;
	}
	return true;
}
