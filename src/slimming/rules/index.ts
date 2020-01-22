// default rules
import { combineScript } from '../default-rules/combine-script';
import { combineStyle } from '../default-rules/combine-style';
import { combineTextNode } from '../default-rules/combine-textnode';
import { rmUseless } from '../default-rules/rm-useless';
// rules
import { collapseG } from './collapse-g';
import { collapseTextwrap } from './collapse-textwrap';
import { combinePath } from './combine-path';
import { combineTransform } from './combine-transform';
import { computePath } from './compute-path';
import { rmAttribute } from './rm-attribute';
import { rmComments } from './rm-comments';
import { rmDocType } from './rm-doctype';
import { rmHidden } from './rm-hidden';
import { rmIrregularNesting } from './rm-irregular-nesting';
import { rmIrregularTag } from './rm-irregular-tag';
import { rmPx } from './rm-px';
import { rmUnnecessary } from './rm-unnecessary';
import { rmVersion } from './rm-version';
import { rmViewBox } from './rm-viewbox';
import { rmXMLDecl } from './rm-xml-decl';
import { rmXMLNS } from './rm-xmlns';
import { shortenClass } from './shorten-class';
import { shortenColor } from './shorten-color';
import { shortenDecimalDigits } from './shorten-decimal-digits';
import { shortenDefs } from './shorten-defs';
import { shortenID } from './shorten-id';
import { shortenShape } from './shorten-shape';
import { shortenStyleAttr } from './shorten-style-attr';
import { shortenStyleTag } from './shorten-style-tag';

// [isDefaultRule: boolean, ruleHandler: Function, configKey?: string]
type RuleItem = [true, (dom: IDomNode) => Promise<null>] | [false, (rule: TFinalConfigItem, dom: IDomNode) => Promise<null>, string];

export const rules: RuleItem[] = [
	[true, rmUseless],
	[true, combineStyle],
	[true, combineScript],
	[false, rmXMLDecl, 'rm-xml-decl'],
	[false, rmVersion, 'rm-version'],
	[false, rmDocType, 'rm-doctype'],
	[false, rmComments, 'rm-comments'],
	[false, rmIrregularTag, 'rm-irregular-tag'],
	[false, rmIrregularNesting, 'rm-irregular-nesting'],
	[false, rmUnnecessary, 'rm-unnecessary'],
	[false, rmViewBox, 'rm-viewbox'],
	[false, shortenID, 'shorten-id'], // 必须在 shorten-defs 之前
	[false, shortenClass, 'shorten-class'],
	[false, shortenDefs, 'shorten-defs'],
	[false, shortenStyleAttr, 'shorten-style-attr'], // 必须在 collpase-g、shorten-shape 和 compute-path 之前，必须在 rm-attribute 之前
	[false, rmPx, 'rm-px'], // 必须在 shorten-style-attr 之后
	[false, rmAttribute, 'rm-attribute'], // 必须在 collpase-g、shorten-shape 和 compute-path 之前
	[false, shortenShape, 'shorten-shape'], // 必须在 rm-hidden 和 compute-path 之前
	[false, combinePath, 'combine-path'], // 必须在 rm-hidden 和 compute-path 之前
	[false, computePath, 'compute-path'],
	[false, collapseG, 'collapse-g'], // 最好在 combine-path、shorten-shape、compute-path 之后
	[false, combineTransform, 'combine-transform'], // 必须在 collpase-g 之后
	[false, shortenDecimalDigits, 'shorten-decimal-digits'],
	[false, shortenColor, 'shorten-color'],
	[false, shortenStyleTag, 'shorten-style-tag'], // 最好在 combine-path、shorten-shape、collapse-g 等规则之后
	[false, collapseTextwrap, 'collapse-textwrap'],
	[true, combineTextNode],
	[false, rmXMLNS, 'rm-xmlns'],
	[false, rmHidden, 'rm-hidden'], // 最好在 rm-attribute 之后
];
