const chai = require('chai');
const should = chai.should();
import slimming from '../../src/slimming/app';

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

	it('check badcase 1', async () => {
		const xml = '<?xml version="1.0" encoding="UTF-8"?> <svg width="426px" height="264px" viewBox="0 0 426 264" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 52.5 (67469) - http://www.bohemiancoding.com/sketch --> <title>Group 9 Copy</title> <desc>Created with Sketch.</desc> <defs> <path d="M12,0 L382,0 C388.627417,-1.21743675e-15 394,5.372583 394,12 L394,220 C394,226.627417 388.627417,232 382,232 L12,232 C5.372583,232 8.11624501e-16,226.627417 0,220 L0,12 C-8.11624501e-16,5.372583 5.372583,1.21743675e-15 12,0 Z" id="path-1"></path> <filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" filterUnits="objectBoundingBox" id="filter-3"> <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology> <feOffset dx="2" dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset> <feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur> <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix> </filter> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Group-9-Copy" transform="translate(14.000000, 15.000000)"> <g id="Oval"> <mask id="mask-2" fill="white"> <use xlink:href="#path-1"></use> </mask> <g id="Mask"> <use fill="black" fill-opacity="1" filter="url(#filter-3)" xlink:href="#path-1"></use> <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use> </g> <ellipse fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="365.5" cy="240" rx="69.5" ry="60"></ellipse> <ellipse id="Oval-Copy-2" fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="333.5" cy="-18" rx="180.5" ry="60"></ellipse> <ellipse id="Oval-Copy" fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="295.5" cy="268" rx="69.5" ry="60"></ellipse> <ellipse id="Oval-Copy-3" fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="-38.5" cy="220" rx="69.5" ry="60"></ellipse> </g> </g> </g> </svg>';
		const dom = await slimming(xml, 'test');
		dom.should.equal('<svg width="426" height="264" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="m12,0h370c6.63,0,12,5.37,12,12v208c0,6.63-5.37,12-12,12H12c-6.63,0-12-5.37-12-12V12C0,5.37,5.37,0,12,0z" id="a"/><filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" id="b"><feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/><feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.1,0" in="shadowBlurOuter1"/></filter></defs><g transform="translate(14,15)" fill-rule="evenodd"><mask id="c" fill="#fff"><use xlink:href="#a"/></mask><use filter="url(#b)" xlink:href="#a"/><use fill="#fff" fill-rule="evenodd" xlink:href="#a"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:365.5;cy:240;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:333.5;cy:-18;rx:180.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:295.5;cy:268;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:-38.5;cy:220;rx:69.5;ry:60"/></g></svg>');
	});

	it('check badcase 2', async () => {
		const xml = '<?xml version="1.0" encoding="UTF-8"?> <svg width="61px" height="51px" viewBox="0 0 61 51" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 47.1 (45422) - http://www.bohemiancoding.com/sketch --> <title>分享</title> <desc>Created with Sketch.</desc> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="分享" transform="translate(2.000000, -1.000000)"> <path d="M29.9942595,3 L1,3 C0.45441393,3 0,3.45208409 0,4 L0,49 C0,49.5428943 0.45846425,50 1,50 L54,50 C54.5441868,50 55,49.5467078 55,49 L55,36.6615737 L55,36.6615737" id="Rectangle" stroke="#666666" stroke-width="4"></path> <circle id="Oval" fill="#666666" fill-rule="nonzero" cx="30" cy="3" r="2"></circle> <circle id="Oval-Copy" fill="#666666" fill-rule="nonzero" cx="55" cy="36" r="2"></circle> <path d="M24.3284695,32.5 C24.3284695,32.5 20.81188,11.7486572 51.6187744,11.7486572" id="Path-2" stroke="#666666" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path> <g id="Group-2" transform="translate(48.603553, 12.250000) rotate(-45.000000) translate(-48.603553, -12.250000) translate(40.103553, 3.750000)" fill-rule="nonzero" fill="#666666"> <rect id="Rectangle-29" x="11.55" y="-5.68434188e-13" width="4.95" height="16.5" rx="2.475"></rect> <rect id="Rectangle-29-Copy" transform="translate(8.250000, 14.025000) rotate(-90.000000) translate(-8.250000, -14.025000) " x="5.775" y="5.775" width="4.95" height="16.5" rx="2.475"></rect> </g> </g> </g> </svg>';
		const dom = await slimming(xml, 'test');
		dom.should.equal('<svg width="61" height="51" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2-1)" fill="none" fill-rule="evenodd"><path d="m29.99,3H1c-.55,0-1,.45-1,1v45c0,.54.46,1,1,1h53c.54,0,1-.45,1-1V36.66" stroke="#666" stroke-width="4"/><circle style="fill:#666;fill-rule:nonzero;cx:30;cy:3;r:2"/><circle style="fill:#666;fill-rule:nonzero;cx:55;cy:36;r:2"/><path d="m24.33,32.5S20.81,11.75,51.62,11.75" stroke="#666" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><g transform="rotate(315,33.08-38.03)" fill-rule="nonzero" fill="#666"><rect style="x:11.55;y:0;width:4.95;height:16.5;rx:2.48"/><rect style="x:.01;y:11.55;width:16.5;height:4.95;rx:2.48"/></g></g></svg>');
	});

	it('check badcase 3', async () => {
		const xml = '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-444 317 135 135" style="enable-background:new -444 317 135 135;" xml:space="preserve"> <style type="text/css"> .st0{fill:none;stroke:#08CC54;} .st1{fill:#08CC54;} </style> <title>分享-微信</title> <desc>Created with Sketch.</desc> <circle id="Oval-Copy-5" class="st0" cx="-376.5" cy="384.5" r="67"/> <g id="Group-2-Copy" transform="translate(799.000000, 730.000000)"> <path id="Fill-1" class="st1" d="M-1201.3-359.4c-2.5,0-4.6-1.9-4.6-4.3c0-2.4,2-4.3,4.6-4.3c2.5,0,4.6,1.9,4.6,4.3 C-1196.7-361.3-1198.8-359.4-1201.3-359.4 M-1178.7-368c2.5,0,4.6,1.9,4.6,4.3c0,2.4-2,4.3-4.6,4.3c-2.5,0-4.6-1.9-4.6-4.3 C-1183.3-366-1181.2-368-1178.7-368 M-1159.3-358.6c0.5,0,0.9,0,1.4,0c-2.4-12.7-15.9-22.4-32.1-22.4c-17.9,0-32.5,11.8-32.5,26.5 c0,8.6,5,16.2,12.8,21c0.1,0.1,0.3,0.2,0.3,0.2l-3.1,9.6l11.7-5.8c0,0,0.4,0.1,0.6,0.2c3.2,0.9,6.7,1.3,10.3,1.3 c0.7,0,1.5,0,2.2-0.1c-0.7-2-1-4.1-1-6.3C-1188.9-347.8-1175.6-358.6-1159.3-358.6"/> <path id="Fill-4" class="st1" d="M-1173.3-342.5c0-2,1.7-3.6,3.9-3.6c2.2,0,3.9,1.6,3.9,3.6c0,2-1.7,3.6-3.9,3.6 C-1171.5-338.8-1173.3-340.5-1173.3-342.5 M-1154-342.5c0-2,1.7-3.6,3.9-3.6c2.2,0,3.9,1.6,3.9,3.6c0,2-1.7,3.6-3.9,3.6 C-1152.2-338.8-1154-340.5-1154-342.5 M-1187.4-334.8c0,12.3,12.4,22.2,27.7,22.2c3.1,0,6-0.4,8.8-1.1c0.2,0,0.5-0.1,0.5-0.1 l10,4.9l-2.7-8c0,0,0.2-0.1,0.3-0.2c6.6-4.1,10.9-10.4,10.9-17.6c0-12.3-12.4-22.2-27.7-22.2C-1175-357-1187.4-347.1-1187.4-334.8" /> </g> </svg>';
		const dom = await slimming(xml, 'test');
		dom.should.equal('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-444,317,135,135"><style>.a{fill:none;stroke:#08cc54}.b{fill:#08cc54}</style><circle class="a" cx="-376.5" cy="384.5" r="67"/><g transform="translate(799,730)"><path class="b" d="m-1201.3-359.4c-2.5,0-4.6-1.9-4.6-4.3s2-4.3,4.6-4.3c2.5,0,4.6,1.9,4.6,4.3s-2.1,4.3-4.6,4.3m22.6-8.6c2.5,0,4.6,1.9,4.6,4.3s-2,4.3-4.6,4.3c-2.5,0-4.6-1.9-4.6-4.3,0-2.3,2.1-4.3,4.6-4.3m19.4,9.4h1.4c-2.4-12.7-15.9-22.4-32.1-22.4-17.9,0-32.5,11.8-32.5,26.5,0,8.6,5,16.2,12.8,21,.1.1.3.2.3.2l-3.1,9.6,11.7-5.8s.4.1.6.2c3.2.9,6.7,1.3,10.3,1.3.7,0,1.5,0,2.2-.1-.7-2-1-4.1-1-6.3-.2-13.4,13.1-24.2,29.4-24.2"/><path class="b" d="m-1173.3-342.5c0-2,1.7-3.6,3.9-3.6s3.9,1.6,3.9,3.6-1.7,3.6-3.9,3.6c-2.1.1-3.9-1.6-3.9-3.6m19.3,0c0-2,1.7-3.6,3.9-3.6s3.9,1.6,3.9,3.6-1.7,3.6-3.9,3.6c-2.1.1-3.9-1.6-3.9-3.6m-33.4,7.7c0,12.3,12.4,22.2,27.7,22.2,3.1,0,6-.4,8.8-1.1.2,0,.5-.1.5-.1l10,4.9-2.7-8s.2-.1.3-.2c6.6-4.1,10.9-10.4,10.9-17.6,0-12.3-12.4-22.2-27.7-22.2-15.4-.1-27.8,9.8-27.8,22.1"/></g></svg>');
	});

	it('check badcase 4', async () => {
		const xml = '<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M0,0H36V36H0z"/><g transform="translate(4,4)" fill="#999" fill-rule="nonzero"><path d="M3,3V26.5C3,27.3,2.3,28,1.5,28C.7,28,0,27.3,0,26.5V1.5C0,.7.7,0,1.5,0H26.5C27.3,0,28,.7,28,1.5c0,.8-.7,1.5-1.5,1.5H3z"/><path d="M.8,2.8c-.6-.6-.6-1.5,0-2.1c.6-.6,1.5-.6,2.1,0L27.9,25.7c.6.6,.6,1.5,0,2.1c-.6.6-1.5.6-2.1,0L.8,2.8z"/></g></g></svg>';
		const dom = await slimming(xml, 'test');
		dom.should.equal('<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><g transform="translate(4,4)" fill="#999"><path d="m3,3v23.5c0,.8-.7,1.5-1.5,1.5S0,27.3,0,26.5v-25C0,.7.7,0,1.5,0h25c.8,0,1.5.7,1.5,1.5S27.3,3,26.5,3H3z"/><path d="m.8,2.8C.2,2.2.2,1.3.8.7S2.3.1,2.9.7l25,25c.6.6.6,1.5,0,2.1s-1.5.6-2.1,0l-25-25z"/></g></svg>');
	});

	it('check badcase 5', async () => {
		const xml = '<svg width="426" height="264" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="m12,0h370c6.63,0,12,5.37,12,12v208c0,6.63-5.37,12-12,12H12c-6.63,0-12-5.37-12-12V12C0,5.37,5.37,0,12,0z" id="a"/><filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" id="b"><feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/><feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.1,0" in="shadowBlurOuter1"/></filter></defs><g transform="translate(14,15)" fill-rule="evenodd"><mask id="c" fill="#fff"><use xlink:href="#a"/></mask><use filter="url(#b)" xlink:href="#a"/><use fill="#fff" fill-rule="evenodd" xlink:href="#a"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:365.5;cy:240;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:333.5;cy:-18;rx:180.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:295.5;cy:268;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:-38.5;cy:220;rx:69.5;ry:60"/></g></svg>';
		const dom = await slimming(xml, 'test');
		dom.should.equal('<svg width="426" height="264" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="m12,0h370c6.63,0,12,5.37,12,12v208c0,6.63-5.37,12-12,12H12c-6.63,0-12-5.37-12-12V12C0,5.37,5.37,0,12,0z" id="a"/><filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" id="b"><feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/><feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.1,0" in="shadowBlurOuter1"/></filter></defs><g transform="translate(14,15)" fill-rule="evenodd"><mask id="c" fill="#fff"><use xlink:href="#a"/></mask><use filter="url(#b)" xlink:href="#a"/><use fill="#fff" fill-rule="evenodd" xlink:href="#a"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:365.5;cy:240;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:333.5;cy:-18;rx:180.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:295.5;cy:268;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:-38.5;cy:220;rx:69.5;ry:60"/></g></svg>');
	});
});
