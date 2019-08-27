import { INode } from '../../node';
import { TConfigItem } from '../config/config';

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
import { douglasPeucker } from './douglas-peucker';
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
import { shapeToPath } from './shape-to-path';
import { shortenClass } from './shorten-class';
import { shortenColor } from './shorten-color';
import { shortenDecimalDigits } from './shorten-decimal-digits';
import { shortenDefs } from './shorten-defs';
import { shortenID } from './shorten-id';
import { shortenStyleAttr } from './shorten-style-attr';
import { shortenStyleTag } from './shorten-style-tag';

export type RuleItem = [1, (dom: INode) => Promise<null>] | [0, (rule: TConfigItem[], dom: INode) => Promise<null>, string];
// [isDefaultRule: boolean, ruleHandler: Function, configKey?: string]

export const rules: RuleItem[] = [
	[1, rmUseless],
	[1, combineStyle],
	[1, combineScript],
	[0, rmXMLDecl, 'rm-xml-decl'],
	[0, rmVersion, 'rm-version'],
	[0, rmDocType, 'rm-doctype'],
	[0, rmComments, 'rm-comments'],
	[0, rmIrregularTag, 'rm-irregular-tag'],
	[0, rmIrregularNesting, 'rm-irregular-nesting'],
	[0, rmUnnecessary, 'rm-unnecessary'],
	[0, rmViewBox, 'rm-viewbox'],
	[0, shortenID, 'shorten-id'],
	[0, shortenClass, 'shorten-class'],
	[0, shortenDefs, 'shorten-defs'],
	[0, rmAttribute, 'rm-attribute'],
	[0, rmPx, 'rm-px'],
	[0, combineTransform, 'combine-transform'],
	[0, shortenStyleAttr, 'shorten-style-attr'],
	[0, shortenStyleTag, 'shorten-style-tag'],
	[0, douglasPeucker, 'douglas-peucker'],
	[0, shapeToPath, 'shape-to-path'],
	[0, combinePath, 'combine-path'],
	[0, collapseG, 'collapse-g'],
	[0, computePath, 'compute-path'],
	[0, shortenDecimalDigits, 'shorten-decimal-digits'],
	[0, shortenColor, 'shorten-color'],
	[0, collapseTextwrap, 'collapse-textwrap'],
	[1, combineTextNode],
	[0, rmXMLNS, 'rm-xmlns'],
	[0, rmHidden, 'rm-hidden'],
];
