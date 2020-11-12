const slim = require('../dist');

describe('dist', () => {
	test('传入配置', async () => {
		const xml = `<?xml           version   =   "1.0"         encoding  =  "UTF-8"      ?>
		<svg width="100" height="100" viewBox="0 0 100 100">
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
		const dom = await slim(xml, {
			'rm-unnecessary': [true, {
				tags: ['title', 123],
			}],
			'no-this-key': true,
			'shorten-decimal-digits': [true, 'haha', 1.5],
			'rm-irregular-tag': [true, null],
			'shorten-class': false,
			'shorten-id': null,
			'shorten-color': [true, false, -1],
			'collapse-g': [true],
			'rm-irregular-nesting': [true, {
				ignore: [1, false, () => 3],
			}],
			'shorten-style-tag': [true, {
				haha: null,
			}],
		});
		expect(dom).toBe('<svg width="1e2" height="1e2"><text> 1 abc 2 </text><script>console.log(1);console.log(2)</script></svg>');
	});

	test('完全默认配置', async () => {
		const xml = '<svg></svg>';
		const dom = await slim(xml);
		expect(dom).toBe('<svg/>');
	});

	test('config 不是对象', async () => {
		const xml = '<svg></svg>';
		const dom = await slim(xml, 'test');
		expect(dom).toBe('<svg/>');
	});

	test('check badcase 1', async () => {
		const xml = '<?xml version="1.0" encoding="UTF-8"?> <svg width="426px" height="264px" viewBox="0 0 426 264" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 52.5 (67469) - http://www.bohemiancoding.com/sketch --> <title>Group 9 Copy</title> <desc>Created with Sketch.</desc> <defs> <path d="M12,0 L382,0 C388.627417,-1.21743675e-15 394,5.372583 394,12 L394,220 C394,226.627417 388.627417,232 382,232 L12,232 C5.372583,232 8.11624501e-16,226.627417 0,220 L0,12 C-8.11624501e-16,5.372583 5.372583,1.21743675e-15 12,0 Z" id="path-1"></path> <filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" filterUnits="objectBoundingBox" id="filter-3"> <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology> <feOffset dx="2" dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset> <feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur> <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix> </filter> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Group-9-Copy" transform="translate(14.000000, 15.000000)"> <g id="Oval"> <mask id="mask-2" fill="white"> <use xlink:href="#path-1"></use> </mask> <g id="Mask"> <use fill="black" fill-opacity="1" filter="url(#filter-3)" xlink:href="#path-1"></use> <use fill="#FFFFFF" fill-rule="evenodd" xlink:href="#path-1"></use> </g> <ellipse fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="365.5" cy="240" rx="69.5" ry="60"></ellipse> <ellipse id="Oval-Copy-2" fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="333.5" cy="-18" rx="180.5" ry="60"></ellipse> <ellipse id="Oval-Copy" fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="295.5" cy="268" rx="69.5" ry="60"></ellipse> <ellipse id="Oval-Copy-3" fill="#19B955" opacity="0.200000003" mask="url(#mask-2)" cx="-38.5" cy="220" rx="69.5" ry="60"></ellipse> </g> </g> </g> </svg>';
		const dom = await slim(xml);
		expect(dom).toBe('<svg width="426" height="264" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="m12,0h370c6.63,0,12,5.37,12,12v208c0,6.63-5.37,12-12,12H12c-6.63,0-12-5.37-12-12V12C0,5.37,5.37,0,12,0z" id="a"/><filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" id="b"><feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/><feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.1,0" in="shadowBlurOuter1"/></filter></defs><g transform="translate(14,15)" fill-rule="evenodd"><mask id="c" fill="#fff"><use xlink:href="#a"/></mask><use filter="url(#b)" xlink:href="#a"/><use fill="#fff" fill-rule="evenodd" xlink:href="#a"/><ellipse fill="#19b955" opacity=".2" mask="url(#c)" cx="365.5" cy="240" rx="69.5" ry="60"/><ellipse fill="#19b955" opacity=".2" mask="url(#c)" cx="333.5" cy="-18" rx="180.5" ry="60"/><ellipse fill="#19b955" opacity=".2" mask="url(#c)" cx="295.5" cy="268" rx="69.5" ry="60"/><ellipse fill="#19b955" opacity=".2" mask="url(#c)" cx="-38.5" cy="220" rx="69.5" ry="60"/></g></svg>');
	});

	test('check badcase 2', async () => {
		const xml = '<?xml version="1.0" encoding="UTF-8"?> <svg width="61px" height="51px" viewBox="0 0 61 51" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <!-- Generator: Sketch 47.1 (45422) - http://www.bohemiancoding.com/sketch --> <title>分享</title> <desc>Created with Sketch.</desc> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="分享" transform="translate(2.000000, -1.000000)"> <path d="M29.9942595,3 L1,3 C0.45441393,3 0,3.45208409 0,4 L0,49 C0,49.5428943 0.45846425,50 1,50 L54,50 C54.5441868,50 55,49.5467078 55,49 L55,36.6615737 L55,36.6615737" id="Rectangle" stroke="#666666" stroke-width="4"></path> <circle id="Oval" fill="#666666" fill-rule="nonzero" cx="30" cy="3" r="2"></circle> <circle id="Oval-Copy" fill="#666666" fill-rule="nonzero" cx="55" cy="36" r="2"></circle> <path d="M24.3284695,32.5 C24.3284695,32.5 20.81188,11.7486572 51.6187744,11.7486572" id="Path-2" stroke="#666666" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"></path> <g id="Group-2" transform="translate(48.603553, 12.250000) rotate(-45.000000) translate(-48.603553, -12.250000) translate(40.103553, 3.750000)" fill-rule="nonzero" fill="#666666"> <rect id="Rectangle-29" x="11.55" y="-5.68434188e-13" width="4.95" height="16.5" rx="2.475"></rect> <rect id="Rectangle-29-Copy" transform="translate(8.250000, 14.025000) rotate(-90.000000) translate(-8.250000, -14.025000) " x="5.775" y="5.775" width="4.95" height="16.5" rx="2.475"></rect> </g> </g> </g> </svg>';
		const dom = await slim(xml);
		expect(dom).toBe('<svg width="61" height="51" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2-1)" fill="none" fill-rule="evenodd"><path d="m29.99,3H1c-.55,0-1,.45-1,1v45c0,.54.46,1,1,1h53c.54,0,1-.45,1-1V36.66" stroke="#666" stroke-width="4"/><circle fill="#666" fill-rule="nonzero" cx="30" cy="3" r="2"/><circle fill="#666" fill-rule="nonzero" cx="55" cy="36" r="2"/><path d="m24.33,32.5s-3.52-20.75,27.29-20.75" stroke="#666" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><g transform="rotate(315,33.08-38.03)" fill-rule="nonzero" fill="#666"><rect x="11.55" width="4.95" height="16.5" rx="2.48"/><rect x=".01" y="11.55" width="16.5" height="4.95" rx="2.48"/></g></g></svg>');
	});

	test('check badcase 3', async () => {
		const xml = '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <svg version="1.1" id="图层_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-444 317 135 135" style="enable-background:new -444 317 135 135;" xml:space="preserve"> <style type="text/css"> .st0{fill:none;stroke:#08CC54;} .st1{fill:#08CC54;} </style> <title>分享-微信</title> <desc>Created with Sketch.</desc> <circle id="Oval-Copy-5" class="st0" cx="-376.5" cy="384.5" r="67"/> <g id="Group-2-Copy" transform="translate(799.000000, 730.000000)"> <path id="Fill-1" class="st1" d="M-1201.3-359.4c-2.5,0-4.6-1.9-4.6-4.3c0-2.4,2-4.3,4.6-4.3c2.5,0,4.6,1.9,4.6,4.3 C-1196.7-361.3-1198.8-359.4-1201.3-359.4 M-1178.7-368c2.5,0,4.6,1.9,4.6,4.3c0,2.4-2,4.3-4.6,4.3c-2.5,0-4.6-1.9-4.6-4.3 C-1183.3-366-1181.2-368-1178.7-368 M-1159.3-358.6c0.5,0,0.9,0,1.4,0c-2.4-12.7-15.9-22.4-32.1-22.4c-17.9,0-32.5,11.8-32.5,26.5 c0,8.6,5,16.2,12.8,21c0.1,0.1,0.3,0.2,0.3,0.2l-3.1,9.6l11.7-5.8c0,0,0.4,0.1,0.6,0.2c3.2,0.9,6.7,1.3,10.3,1.3 c0.7,0,1.5,0,2.2-0.1c-0.7-2-1-4.1-1-6.3C-1188.9-347.8-1175.6-358.6-1159.3-358.6"/> <path id="Fill-4" class="st1" d="M-1173.3-342.5c0-2,1.7-3.6,3.9-3.6c2.2,0,3.9,1.6,3.9,3.6c0,2-1.7,3.6-3.9,3.6 C-1171.5-338.8-1173.3-340.5-1173.3-342.5 M-1154-342.5c0-2,1.7-3.6,3.9-3.6c2.2,0,3.9,1.6,3.9,3.6c0,2-1.7,3.6-3.9,3.6 C-1152.2-338.8-1154-340.5-1154-342.5 M-1187.4-334.8c0,12.3,12.4,22.2,27.7,22.2c3.1,0,6-0.4,8.8-1.1c0.2,0,0.5-0.1,0.5-0.1 l10,4.9l-2.7-8c0,0,0.2-0.1,0.3-0.2c6.6-4.1,10.9-10.4,10.9-17.6c0-12.3-12.4-22.2-27.7-22.2C-1175-357-1187.4-347.1-1187.4-334.8" /> </g> </svg>';
		const dom = await slim(xml);
		expect(dom).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-444,317,135,135" style="enable-background:new -444 317 135 135" xml:space="preserve"><circle cx="-376.5" cy="384.5" r="67" fill="none" stroke="#08cc54"/><path d="m-402.3,370.6c-2.5,0-4.6-1.9-4.6-4.3s2-4.3,4.6-4.3c2.5,0,4.6,1.9,4.6,4.3s-2.1,4.3-4.6,4.3m22.6-8.6c2.5,0,4.6,1.9,4.6,4.3s-2,4.3-4.6,4.3c-2.5,0-4.6-1.9-4.6-4.3,0-2.3,2.1-4.3,4.6-4.3m19.4,9.4h1.4c-2.4-12.7-15.9-22.4-32.1-22.4-17.9,0-32.5,11.8-32.5,26.5,0,8.6,5,16.2,12.8,21,.1.1.3.2.3.2l-3.1,9.6,11.7-5.8s.4.1.6.2c3.2.9,6.7,1.3,10.3,1.3.7,0,1.5,0,2.2-.1-.7-2-1-4.1-1-6.3-.2-13.4,13.1-24.2,29.4-24.2m-14,16.1c0-2,1.7-3.6,3.9-3.6s3.9,1.6,3.9,3.6-1.7,3.6-3.9,3.6c-2.1.1-3.9-1.6-3.9-3.6m19.3,0c0-2,1.7-3.6,3.9-3.6s3.9,1.6,3.9,3.6-1.7,3.6-3.9,3.6c-2.1.1-3.9-1.6-3.9-3.6m-33.4,7.7c0,12.3,12.4,22.2,27.7,22.2,3.1,0,6-.4,8.8-1.1.2,0,.5-.1.5-.1l10,4.9-2.7-8s.2-.1.3-.2c6.6-4.1,10.9-10.4,10.9-17.6,0-12.3-12.4-22.2-27.7-22.2-15.4-.1-27.8,9.8-27.8,22.1" fill="#08cc54"/></svg>');
	});

	test('check badcase 4', async () => {
		const xml = '<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M0,0H36V36H0z"/><g transform="translate(4,4)" fill="#999" fill-rule="nonzero"><path d="M3,3V26.5C3,27.3,2.3,28,1.5,28C.7,28,0,27.3,0,26.5V1.5C0,.7.7,0,1.5,0H26.5C27.3,0,28,.7,28,1.5c0,.8-.7,1.5-1.5,1.5H3z"/><path d="M.8,2.8c-.6-.6-.6-1.5,0-2.1c.6-.6,1.5-.6,2.1,0L27.9,25.7c.6.6,.6,1.5,0,2.1c-.6.6-1.5.6-2.1,0L.8,2.8z"/></g></g></svg>';
		const dom = await slim(xml);
		expect(dom).toBe('<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg"><path d="m7,7v23.5c0,.8-.7,1.5-1.5,1.5S4,31.3,4,30.5v-25C4,4.7,4.7,4,5.5,4h25c.8,0,1.5.7,1.5,1.5S31.3,7,30.5,7H7zm-2.2-.2c-.6-.6-.6-1.5,0-2.1s1.5-.6,2.1,0l25,25c.6.6.6,1.5,0,2.1s-1.5.6-2.1,0l-25-25z" fill="#999"/></svg>');
	});

	test('check badcase 5', async () => {
		const xml = '<svg width="426" height="264" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="m12,0h370c6.63,0,12,5.37,12,12v208c0,6.63-5.37,12-12,12H12c-6.63,0-12-5.37-12-12V12C0,5.37,5.37,0,12,0z" id="a"/><filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" id="b"><feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/><feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.1,0" in="shadowBlurOuter1"/></filter></defs><g transform="translate(14,15)" fill-rule="evenodd"><mask id="c" fill="#fff"><use xlink:href="#a"/></mask><use filter="url(#b)" xlink:href="#a"/><use fill="#fff" fill-rule="evenodd" xlink:href="#a"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:365.5;cy:240;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:333.5;cy:-18;rx:180.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:295.5;cy:268;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:-38.5;cy:220;rx:69.5;ry:60"/></g></svg>';
		const dom = await slim(xml);
		expect(dom).toBe('<svg width="426" height="264" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="m12,0h370c6.63,0,12,5.37,12,12v208c0,6.63-5.37,12-12,12H12c-6.63,0-12-5.37-12-12V12C0,5.37,5.37,0,12,0z" id="a"/><filter x="-5.8%" y="-10.3%" width="112.7%" height="121.6%" id="b"><feMorphology radius="1" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"/><feOffset dy="1" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/><feGaussianBlur stdDeviation="7" in="shadowOffsetOuter1" result="shadowBlurOuter1"/><feColorMatrix values="0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,.1,0" in="shadowBlurOuter1"/></filter></defs><g transform="translate(14,15)" fill-rule="evenodd"><mask id="c" fill="#fff"><use xlink:href="#a"/></mask><use filter="url(#b)" xlink:href="#a"/><use fill="#fff" fill-rule="evenodd" xlink:href="#a"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:365.5;cy:240;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:333.5;cy:-18;rx:180.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:295.5;cy:268;rx:69.5;ry:60"/><ellipse style="fill:#19b955;opacity:.2;mask:url(#c);cx:-38.5;cy:220;rx:69.5;ry:60"/></g></svg>');
	});

	test('check badcase 6', async () => {
		const xml = '<svg width="588" height="132" xmlns="http://www.w3.org/2000/svg"><path d="M364,92c0,8.5-2.5,12-14,12c-11.6,0-1.6,0-11.9,0S324,100.4,324,92c0-8.4,0-30,0-40s2-14,14-14c8,0,12,0,11.9,0C362,38,364,41.3,364,52s0,31.5,0,40zM336,28c-15.4,0-22,6-22,24s0,28,0,42s8,20,22,20s1.9,0,16,0s22-6,22-20s0-24,0-42S367.7,28,352,28s-.6,0-16,0z" fill="#333"/><path d="M292,96c0,8-2.9,8-12,8l-12,0c-8,0-14,0-14-8V78c0-1,.6-2,2-2h26c7.5,0,10,2,10,8L292,96zM254,66C254,62,254,56.7,254,50C254,40,256,38,264.1,38c8.1,0,16.7,0,23.9,0C295.2,38,298,34.9,298,32s0-1,0-2s-1.4-2-2.1-2s-17.8,0-31.9,0C250,28,244,34,244,50s0,36,0,46S248,114,264.1,114C280.1,114,268,114,282,114s20-5.1,20-16c0-10.9,0-4,0-14S298,66,282,66c-10.7,0-20,0-28,0z" fill="#333"/><path d="M176,28c-1.1,0-2,.8-2,2s0-.8,0,2C174,34.8,176.9,38,184,38c7.1,0,14.6,0,24,0S222,40,222,48s0,16.9,0,17.2s-.7.8-1,.8s-39.9,0-41,0C179,66,178,66.9,178,68S178,72.7,178,74s.7,2,2,2s40.2,0,41,0s1,.4,1,1.1c0,.6,0,7,0,15C222,100,218,104,210.1,104s-19,0-26.1,0s-10,3.1-10,6S174,111,174,112.1S174.9,114,176,114s25.9,0,37.9,0C226,114,232,105,232,92c0-13,0-31.2,0-44S223.1,28,214,28s-36.9,0-38,0z" fill="#333"/></svg>';
		const dom = await slim(xml);
		expect(dom).toBe('<svg width="588" height="132" xmlns="http://www.w3.org/2000/svg"><path d="m364,92c0,8.5-2.5,12-14,12-11.6,0-1.6,0-11.9,0S324,100.4,324,92s0-30,0-40,2-14,14-14c8,0,12,0,11.9,0C362,38,364,41.3,364,52s0,31.5,0,40zm-28-64c-15.4,0-22,6-22,24s0,28,0,42,8,20,22,20,1.9,0,16,0,22-6,22-20,0-24,0-42-6.3-24-22-24-.6,0-16,0zm-44,68c0,8-2.9,8-12,8h-12c-8,0-14,0-14-8V78c0-1,.6-2,2-2h26c7.5,0,10,2,10,8v12zm-38-30V50c0-10,2-12,10.1-12s16.7,0,23.9,0,10-3.1,10-6,0-1,0-2-1.4-2-2.1-2-17.8,0-31.9,0c-14,0-20,6-20,22s0,36,0,46,4,18,20.1,18c16,0,3.9,0,17.9,0s20-5.1,20-16,0-4,0-14-4-18-20-18c-10.7,0-20,0-28,0zm-78-38c-1.1,0-2,.8-2,2s0-.8,0,2,2.9,6,10,6,14.6,0,24,0,14,2,14,10,0,16.9,0,17.2-.7.8-1,.8-39.9,0-41,0c-1,0-2,.9-2,2s0,4.7,0,6,.7,2,2,2,40.2,0,41,0,1,.4,1,1.1c0,.6,0,7,0,15,0,7.9-4,11.9-11.9,11.9s-19,0-26.1,0-10,3.1-10,6,0,1,0,2.1.9,1.9,2,1.9,25.9,0,37.9,0c12.1,0,18.1-9,18.1-22s0-31.2,0-44-8.9-20-18-20-36.9,0-38,0z" fill="#333"/></svg>');
	});

	test('check badcase 7', async () => {
		const xml = `<?xml version="1.0" standalone="yes"?>

		<svg version="1.1" viewBox="0.0 0.0 960.0 720.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><clipPath id="p.0"><path d="m0 0l960.0 0l0 720.0l-960.0 0l0 -720.0z" clip-rule="nonzero"></path></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l960.0 0l0 720.0l-960.0 0z" fill-rule="evenodd"></path><g mask="url(#mask-p.1)"><use href="#p.1" transform="matrix(1.0 0.0 0.0 -1.0 0.0 740.9134287719369)" id="use"/></g><defs><mask id="mask-p.1" maskUnits="userSpaceOnUse" x="331.10292596931816" y="364.45671438596844" width="242.84654092152226" height="199.54002557239153"><linearGradient gradientUnits="userSpaceOnUse" id="gradient-p.1" x1="337.1029259723433" y1="372.4558787237811" x2="337.10272230351825" y2="428.7181393290787"><stop offset="0%" stop-color="#ffffff" stop-opacity="1.0"></stop><stop offset="100%" stop-color="#ffffff" stop-opacity="0.0"></stop></linearGradient><rect fill="url(#gradient-p.1)" x="331.10292596931816" y="364.45671438596844" width="242.84654092152226" height="199.54002557239153"></rect></mask></defs><g id="p.1"><g filter="url(#shadowFilter-p.2)"><use href="#p.2" transform="matrix(1.0 0.0 0.0 1.0 0.0 2.0)"></use></g><defs><filter id="shadowFilter-p.2" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceAlpha" stdDeviation="2.0" result="blur"></feGaussianBlur><feComponentTransfer in="blur" color-interpolation-filters="sRGB"><feFuncR type="linear" slope="0" intercept="0.0"></feFuncR><feFuncG type="linear" slope="0" intercept="0.0"></feFuncG><feFuncB type="linear" slope="0" intercept="0.0"></feFuncB><feFuncA type="linear" slope="0.5" intercept="0"></feFuncA></feComponentTransfer></filter></defs><g id="p.2"><path fill="#000000" fill-opacity="0.0" d="m389.22095 310.39722c7.9743958 -21.426392 18.141602 -122.24698 47.846344 -128.55838c29.704712 -6.3114014 130.24649 59.754105 130.38205 90.68994c0.13555908 30.935852 -92.553894 88.559204 -129.56876 94.92511c-37.01483 6.3658752 -76.62747 -49.684875 -92.520325 -56.729736c-15.892853 -7.044861 -2.3640137 12.050476 -2.836792 14.460571" fill-rule="evenodd"></path><path stroke="#000000" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m389.22095 310.39722c7.9743958 -21.426392 18.141602 -122.24698 47.846344 -128.55838c29.704712 -6.3114014 130.24649 59.754105 130.38205 90.68994c0.13555908 30.935852 -92.553894 88.559204 -129.56876 94.92511c-37.01483 6.3658752 -76.62747 -49.684875 -92.520325 -56.729736c-15.892853 -7.044861 -2.3640137 12.050476 -2.836792 14.460571" fill-rule="evenodd"></path></g></g></g><use href="#use" xlink:href="https://upload.wikimedia.org/wikipedia/commons/1/17/Yin_yang.svg" transform="scale(0.5)"/>
		</svg>
		
		`;
		const dom = await slim(xml);
		expect(dom).toBe('<svg viewBox="0,0,960,720" fill="none" stroke-linecap="square" stroke-miterlimit="10" xmlns="http://www.w3.org/2000/svg"><clipPath id="a"><path d="m0,0h960v720H0V0z"/></clipPath><g clip-path="url(#a)"><path fill="#000" fill-opacity="0" d="m0,0h960v720H0z" fill-rule="evenodd"/><g mask="url(#b)"><use href="#c" transform="matrix(1,0,0-1,0,740.91)" id="g"/></g><defs><mask id="b" maskUnits="userSpaceOnUse" x="331.1" y="364.46" width="242.85" height="199.54"><linearGradient gradientUnits="userSpaceOnUse" id="d" x1="337.1" y1="372.46" x2="337.1" y2="428.72"><stop offset="0%" stop-color="#fff"/><stop offset="1e2%" stop-color="#fff" stop-opacity="0"/></linearGradient><rect fill="url(#d)" x="331.1" y="364.46" width="242.85" height="199.54"/></mask><filter id="e" filterUnits="userSpaceOnUse"><feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/><feComponentTransfer in="blur" color-interpolation-filters="sRGB"><feFuncR type="linear" slope="0"/><feFuncG type="linear" slope="0"/><feFuncB type="linear" slope="0"/><feFuncA type="linear" slope=".5"/></feComponentTransfer></filter></defs><g id="c"><use href="#f" transform="translate(0,2)" filter="url(#e)"/><g id="f"><path fill="#000" fill-opacity="0" d="m389.22,310.4c7.97-21.43,18.14-122.25,47.85-128.56,29.7-6.31,130.25,59.75,130.38,90.69.14,30.94-92.55,88.56-129.57,94.93-37.01,6.37-76.63-49.68-92.52-56.73-15.89-7.04-2.36,12.05-2.84,14.46" fill-rule="evenodd"/><path stroke="#000" stroke-linejoin="round" stroke-linecap="butt" d="m389.22,310.4c7.97-21.43,18.14-122.25,47.85-128.56,29.7-6.31,130.25,59.75,130.38,90.69.14,30.94-92.55,88.56-129.57,94.93-37.01,6.37-76.63-49.68-92.52-56.73-15.89-7.04-2.36,12.05-2.84,14.46" fill-rule="evenodd"/></g></g></g><use href="#g" transform="scale(.5)"/></svg>');

	});

	test('check badcase 8', async () => {
		const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
		<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.0" width="800" height="600" id="svg2020">
			<text xml:space="preserve" style="font-size:24.000000px;font-style:normal;font-variant:normal;font-weight:700;font-stretch:Normal;line-height:125.000000%;letter-spacing:0px;word-spacing:0px;fill:#000000;fill-opacity:1;stroke:none;font-family:sans-serif;text-align:start;text-anchor:start;" transform="matrix(1.000000,-0.000000,0.000000,1.000000,200,200)" x="0.000000" y="0.000000" id="text2018">
				<tspan x="0.000000" y="0.000000" id="tspan2016">
					<tspan dx="0.000000" dy="0.000000" style="fill:#000000;font-size:24.000000px!important;font-style:normal;font-variant:normal;font-weight:700;font-stretch:Normal;font-family: sans-serif;" id="tspan2014">fixme</tspan>
				</tspan>
			</text>
		</svg>`;
		const dom = await slim(xml);
		expect(dom).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="8e2" height="6e2"><text xml:space="preserve" style="font-size:24px;font-weight:700;letter-spacing:0;word-spacing:0;font-family:sans-serif;text-align:start" transform="translate(2e2,2e2)"> <tspan dx="0" dy="0" y="0" x="0" font-size="24" font-weight="700" font-family="sans-serif"> fixme </tspan> </text></svg>');
	});

	test('check badcase 9', async () => {
		const xml = `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="900" height="150">
			<text>
				<tspan x="0" y="20" style="fill:#060;flex-grow:1;stroke:yellow">
					<tspan x="100" fill="blue">
						<tspan fill="red" style="stroke:none"> fixme </tspan>
					</tspan>
				</tspan>
			</text>
		</svg>`;
		const dom = await slim(xml);
		expect(dom).toBe('<svg xmlns="http://www.w3.org/2000/svg" width="9e2" height="150"><text> <tspan style="fill:red;flex-grow:1" y="20" x="1e2"> fixme </tspan> </text></svg>');
	});

	test('check badcase 10', async () => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
		<svg width="66px" height="66px" viewBox="0 0 66 66" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<title>矩形</title>
			<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				<g id="Mobile基础-图标备份" transform="translate(-1998.000000, -1968.000000)">
					<g id="分组" transform="translate(1998.000000, 1968.000000)">
						<rect id="矩形" x="0" y="0" width="66" height="66"></rect>
						<path d="M3.34204541,44.5180398 C3.28835594,44.4719676 3.23991947,44.4210364 3.19823681,44.366183 C2.98034081,44.0889303 2.93968147,43.7368614 3.08812907,43.4285231 L8.25643934,32.6723339 L3.09692947,22.5013259 C2.94090941,22.1918753 2.97590647,21.8354158 3.19045967,21.5533627 C3.40603621,21.2701387 3.77319847,21.1004268 4.16662554,21.1004268 L9.29427641,21.1003097 C9.63292254,21.1004268 9.95717414,21.2372383 10.1793681,21.4484562 L16.0963292,27.357991 L28.1720927,27.3581666 L21.5680156,9.3256147 C21.444946,9.01985223 21.5030015,8.68101373 21.7219209,8.41798661 C21.9406355,8.1565401 22.2946313,8 22.6707986,8 L29.527223,8 C29.9132823,8.00087815 30.2729403,8.16403341 30.491655,8.43671991 L45.1026938,27.6213109 L56.9405045,27.6214866 C60.1300135,27.6185595 62.9103365,30.0062349 62.9113597,32.7452181 L62.9104729,33.1385002 C62.9115644,34.5055624 62.2902129,35.7912518 61.1622565,36.7591777 C60.0343002,37.7271036 58.5358389,38.2604756 56.9394129,38.2603 L45.2248083,38.2602999 L30.9535072,57.4686588 C30.7379307,57.7479019 30.3741112,57.9146868 29.9825261,57.9149209 L23.0114231,57.9147453 C22.638735,57.915682 22.2902651,57.7620104 22.0691628,57.5043105 C21.8504481,57.2467863 21.7888451,56.9128068 21.9007948,56.6090932 L27.9751404,38.7499999 L16.2159195,38.7499999 L10.6388325,44.4549319 C10.4177984,44.6824244 10.0900675,44.8125037 9.74494047,44.8125037 L4.16198654,44.8125037 C3.85438067,44.8104547 3.55871341,44.7039092 3.34204541,44.5180398 L3.34204541,44.5180398 Z" id="Shape" fill="#555555" fill-rule="nonzero"></path>
					</g>
				</g>
			</g>
		</svg>`;
		const dom = await slim(xml);
		expect(dom).toBe('<svg width="66" height="66" xmlns="http://www.w3.org/2000/svg"><path d="m3.34,44.52c-.05-.05-.1-.1-.14-.15-.22-.28-.26-.63-.11-.94l5.17-10.76L3.1,22.5c-.16-.31-.12-.67.09-.95.22-.28.58-.45.98-.45H9.3c.34,0,.66.14.89.35l5.92,5.91h12.08L21.57,9.33c-.12-.31-.07-.64.15-.91.22-.26.57-.42.95-.42h6.86c.39,0,.75.16.96.44L45.1,27.62h11.84c3.19,0,5.97,2.38,5.97,5.12v.39c0,1.37-.62,2.65-1.75,3.62s-2.63,1.5-4.22,1.5H45.23L30.95,57.47c-.22.28-.58.45-.97.45h-6.97c-.37,0-.72-.15-.94-.41s-.28-.59-.17-.9l6.07-17.86H16.22l-5.58,5.7c-.22.23-.55.36-.89.36H4.16c-.31,0-.6-.11-.82-.29z" fill="#555"/></svg>');
	});

	test('check badcase 11', async () => {
		const xml = `<svg xmlns="http://www.w3.org/2000/svg"> <style> path:nth-of-type(2) { fill: blue; } </style> <path d="m0,0h50v50H0z"/><path d="m55,0h50v50H55z"/><path d="m110,0h50v50h-50z"/> </svg>`;
		const dom = await slim(xml);
		expect(dom).toBe('<svg xmlns="http://www.w3.org/2000/svg"><path d="m0,0h50v50H0z"/><path d="m55,0h50v50H55z" fill="#00f"/><path d="m110,0h50v50h-50z"/></svg>');
	});
});
