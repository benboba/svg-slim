const chai = require('chai');
const should = chai.should();
import { createRuleConfig } from '../../../src/slimming/config/create-rule-config';
import { mergeConfig } from '../../../src/slimming/config/merge';
import { shortenAnimate } from '../../../src/slimming/rules/shorten-animate';
import { createXML } from '../../../src/slimming/xml/create';
import { parse } from '../../../src/xml-parser';
import { IDomNode } from '../../../typings/node';

describe('rules/shorten-animate', () => {
	it('优化动画元素', async () => {
		const xml = `<svg>
			<feFuncA>
				<animate to="x" attributeName="amplitude"/>
				<animate to="x" from="0" attributeName="amplitude"/>
			</feFuncA>
			<text>
				<animate to="1"/>
				<animate to="1" attributeName="title"/>
				<animate values="a;b;c" attributeName="x"/>
				<animate values="a;b;c" to="100" attributeName="x"/>
				<animateTransform attributeName="x"/>
				<animate from="1" to="0" dur="5s" repeatCount="indefinite" />
				<set attributeName="fill" />
				<animateMotion />
				<animate attributeName="fill" by="blue" />
				<animateTransform attributeName="fill" by="blue" />
			</text>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		const config = createRuleConfig(mergeConfig(null), 'shorten-animate');
		await shortenAnimate(dom, config);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><feFuncA><animate from="0" attributeName="amplitude"/></feFuncA><text><animate to="100" attributeName="x"/><animate attributeName="fill" by="blue"/></text></svg>');
	});

	it('animateMotion', async () => {
		const xml = `<svg>
			<path id="a" d="M0,0H100V100z"/>
			<text id="c"/>
			<text>
			<animateMotion path="M0,0H100V100z"/>
			<animateMotion><title/><mpath/><mpath href="#b"/><mpath href="#c"/></animateMotion>
			<animateMotion><mpath xlink:href="#a"/></animateMotion>
			</text>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		const config = createRuleConfig(mergeConfig(null), 'shorten-animate');
		await shortenAnimate(dom, config);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><path id="a" d="M0,0H100V100z"/><text id="c"/><text><animateMotion path="M0,0H100V100z"/><animateMotion><mpath xlink:href="#a"/></animateMotion></text></svg>');
	});

	it('move 2 child', async () => {
		const xml = `<svg>
			<path id="a" d="M0,0H100V100z"/>
			<animate xlink:href="#a" to="M0,0H50V50z" attributeName="d"/>
			<animate href="#a" to="M0,0H50V50z" attributeName="d"/>
			<animate href="#b" to="M0,0H50V50z" attributeName="d"/>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		const config = createRuleConfig(mergeConfig(null), 'shorten-animate');
		await shortenAnimate(dom, config);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg><path id="a" d="M0,0H100V100z"><animate to="M0,0H50V50z" attributeName="d"/><animate to="M0,0H50V50z" attributeName="d"/></path></svg>');
	});

	it('移除动画元素', async () => {
		const xml = `<svg>
		<animate to="1"/>
		<animate to="1" attributeName="title"/>
		<animate to="x" attributeName="amplitude"/>
		<animate to="x" from="0" attributeName="amplitude"/>
		<animate values="a;b;c" attributeName="x"/>
		<animate values="a;b;c" to="100" attributeName="x"/>
		<set attributeName="fill" />
		<animateMotion />
		<animateTransform attributeName="x"/>
		</svg>`;
		const dom = await parse(xml) as IDomNode;
		const config = createRuleConfig(mergeConfig({
			rules: {
				'shorten-animate': [true, {
					remove: true,
				}],
			},
		}), 'shorten-animate');
		await shortenAnimate(dom, config);
		createXML(dom).replace(/>\s+</g, '><').should.equal('<svg></svg>');
	});
});
