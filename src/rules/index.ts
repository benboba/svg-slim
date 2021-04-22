import { TRulesItem } from '../../typings';
// default rules
import { clearTextNode } from '../default-rules/clear-textnode';
import { combineScript } from '../default-rules/combine-script';
import { combineStyle } from '../default-rules/combine-style';
import { combineTextNode } from '../default-rules/combine-textnode';
// rules
import { applyStyle } from './apply-style';
import { collapseG } from './collapse-g';
import { collapseTextwrap } from './collapse-textwrap';
import { combinePath } from './combine-path';
import { combineTransform } from './combine-transform';
import { computePath } from './compute-path';
import { rmAttribute } from './rm-attribute';
import { rmComments } from './rm-comments';
import { rmDocType } from './rm-doctype';
import { rmHidden } from './rm-hidden';
import { rmImportant } from './rm-important';
import { rmIllegalStyle } from './rm-illegal-style';
import { rmIrregularNesting } from './rm-irregular-nesting';
import { rmIrregularTag } from './rm-irregular-tag';
import { rmPx } from './rm-px';
import { rmUnnecessary } from './rm-unnecessary';
import { rmVersion } from './rm-version';
import { rmViewBox } from './rm-viewbox';
import { rmXMLDecl } from './rm-xml-decl';
import { rmXMLNS } from './rm-xmlns';
import { shortenAnimate } from './shorten-animate';
import { shortenClass } from './shorten-class';
import { shortenColor } from './shorten-color';
import { shortenDecimalDigits } from './shorten-decimal-digits';
import { shortenDefs } from './shorten-defs';
import { shortenFilter } from './shorten-filter';
import { shortenID } from './shorten-id';
import { shortenShape } from './shorten-shape';
import { shortenStyleAttr } from './shorten-style-attr';
import { shortenStyleTag } from './shorten-style-tag';
import { styleToClass } from './style-to-class';

export const rules: TRulesItem[] = [
	[true, combineStyle],
	[true, combineScript],
	[true, clearTextNode],
	[false, rmXMLDecl, 'rm-xml-decl'],
	[false, rmVersion, 'rm-version'],
	[false, rmDocType, 'rm-doctype'],
	[false, rmComments, 'rm-comments'],
	[false, rmIrregularTag, 'rm-irregular-tag'],
	[false, rmIrregularNesting, 'rm-irregular-nesting'],
	[false, rmUnnecessary, 'rm-unnecessary'],
	[false, rmViewBox, 'rm-viewbox'],
	[false, shortenAnimate, 'shorten-animate'], // 必须在所有依赖 getAnimateAttr 的规则之前
	[false, shortenFilter, 'shorten-filter'],
	[false, applyStyle, 'apply-style'], // 在所有修改 dom 树的样式之前执行一次
	[false, collapseTextwrap, 'collapse-textwrap'], // 可能需要在 rmHidden 之前，需要在 rm-illegal-style 之前
	[false, rmIllegalStyle, 'rm-illegal-style'], // 必须在 collpase-g、shorten-shape 和 compute-path 之前，必须在 rm-attribute 之前
	[false, rmPx, 'rm-px'], // 必须在 shorten-style-attr 之后
	[false, rmAttribute, 'rm-attribute'], // 必须在 collpase-g、shorten-shape 和 compute-path 之前
	[false, shortenDefs, 'shorten-defs'], // 依赖 rm-attribute
	[false, shortenID, 'shorten-id'], // 必须在 shorten-defs 之后，collapse-g、combine-path 之前
	[false, shortenShape, 'shorten-shape'], // 必须在 rm-hidden 和 compute-path 之前
	[false, combinePath, 'combine-path'], // 必须在 rm-hidden 和 compute-path 之前
	[false, computePath, 'compute-path'], // 必须在 collapse-g 之前
	[false, rmHidden, 'rm-hidden'], // 必须在 shorten-style-attr 之前，必须在 shorten-id 之后
	[false, collapseG, 'collapse-g'], // 最好在 combine-path、shorten-shape、compute-path、rm-hidden 之后
	[false, shortenStyleTag, 'shorten-style-tag'], // 最好在 combine-path、shorten-shape、collapse-g 等规则之后
	[false, applyStyle, 'apply-style'], // 在所有修改 dom 树的样式之后，优化样式的规则之前执行一次
	[false, rmImportant, 'rm-important'],
	[false, combineTransform, 'combine-transform'], // 必须在 collpase-g 之后
	[false, shortenDecimalDigits, 'shorten-decimal-digits'], // 最后再优化数值
	[false, shortenColor, 'shorten-color'], // 最后再优化颜色
	[false, styleToClass, 'style-to-class'], // 必须在 shorten-class 之前，最好在 shorten-style-tag 和 shorten-style-attr 之后
	[false, shortenClass, 'shorten-class'], // 必须在 apply-style 和 style-to-class 之后
	[true, combineTextNode],
	[false, rmXMLNS, 'rm-xmlns'],
	[false, shortenStyleAttr, 'shorten-style-attr'], // 必须在 apply-style 之后
	// 部分规则执行两次，以获得更好的优化效果
	[false, rmIllegalStyle, 'rm-illegal-style'], // 二次执行
	[false, rmAttribute, 'rm-attribute'], // 二次执行
	[false, computePath, 'compute-path'], // 二次执行
];
