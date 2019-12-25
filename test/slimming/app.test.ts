import chai = require('chai');
const should = chai.should();
import slimming = require('../../src/slimming/app');

describe('svg-slimming 入口', () => {
	it('传入配置', async () => {
		const xml = `<?xml           version   =   "1.0"         encoding  =  "UTF-8"      ?>
		<svg width="100" height="100" viewBox="0 0 100 100">
			<!ENTITY nbsp "&#xA0;">
			<![ENTITY[test 1234]]>
			<style >#id{fill:red}</style>
			<script >console.log(1)</script>
			<style>.class{fill:blue}</style>
			<script>console.log(2)</script>
			<title>123</title>
			<text   >
			1
			<![CDATA[abc]]>
			2
			<notext>    </notext>
			</text   >
		</svg>`;
		const dom = await slimming(xml, {
			'rm-unnecessary': [true, ['title', 123]],
			'no-this-key': true,
			'shorten-decimal-digits': [true, 'haha', 1.5],
			'rm-irregular-tag': [true, null],
			'shorten-class': false,
			'shorten-id': null,
			'shorten-color': [true, false, -1],
			'collapse-g': [true],
			'rm-irregular-nesting': [true, {
				ignore: [1, false, () => 3],
				keyOrder: [],
			}],
			'shorten-style-tag': [true, {
				haha: null,
				deepShorten: true,
			}],
		});
		dom.should.equal('<svg width="1e2" height="1e2"><text> 1 abc 2 </text><script>console.log(1);console.log(2)</script></svg>');
	});

	it('完全默认配置', async () => {
		const xml = '<svg></svg>';
		const dom = await slimming(xml);
		dom.should.equal('<svg/>');
	});

	it('破坏性操作', async () => {
		const xml = '<svg></svg>';
		const dom = await slimming(xml, 'test');
		dom.should.equal('<svg/>');
	});
});
