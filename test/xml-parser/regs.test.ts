const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
import { REG_XML_DECL, REG_CDATA_SECT, REG_OTHER_SECT, REG_DOCTYPE, REG_OTHER_DECL, REG_COMMENTS, REG_START_TAG, REG_END_TAG, REG_ATTR } from '../../src/xml-parser/regs';

describe('XML_PARSER 正则表达式', () => {
	it('XML Declare', () => {
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version="1.0"?>')).to.be.true;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml     version=\'1.1\'      ?>')).to.be.true;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('< ?xml version="1.0"?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version="1.0"? >')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version=" 1.0 "?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version=1.0?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<? xml version="1.0"?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version="0.1"?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?XML version="1.0"?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version=""?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version="1.0" encoding="utf-8"?>')).to.be.true;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version="1.0" standalone="yes"?>')).to.be.true;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version="1.0" standalone="not"?>')).to.be.false;
		REG_XML_DECL.lastIndex = 0;
		expect(REG_XML_DECL.test('<?xml version="1.0" encoding="utf-8" standalone="no"?>')).to.be.true;
	});

	it('CDATA', () => {
		REG_CDATA_SECT.lastIndex = 0;
		expect(REG_CDATA_SECT.test('<![CDATA[]]>')).to.be.true;
		REG_CDATA_SECT.lastIndex = 0;
		expect(REG_CDATA_SECT.test('<![CDATA[Anything 123]]>')).to.be.true;
		REG_CDATA_SECT.lastIndex = 0;
		expect(REG_CDATA_SECT.test(`<![CDATA[
			Anything with return
		]]>`)).to.be.true;
		REG_CDATA_SECT.lastIndex = 0;
		expect(REG_CDATA_SECT.test('<![cdata[]]>')).to.be.false;
		REG_CDATA_SECT.lastIndex = 0;
		expect(REG_CDATA_SECT.test('<![ CDATA [] ]>')).to.be.false;
	});

	it('Other Section', () => {
		REG_OTHER_SECT.lastIndex = 0;
		expect(REG_OTHER_SECT.test('<![INCLUDE[]]>')).to.be.true;
		REG_OTHER_SECT.lastIndex = 0;
		expect(REG_OTHER_SECT.test(`<![ INCLUDE [
			Anything 123
		]]>`)).to.be.true;
		REG_OTHER_SECT.lastIndex = 0;
		expect(REG_OTHER_SECT.test('<![include[]]>')).to.be.false;
	});

	it('Document Type', () => {
		REG_DOCTYPE.lastIndex = 0;
		expect(REG_DOCTYPE.test('<!DOCTYPE>')).to.be.false;
		REG_DOCTYPE.lastIndex = 0;
		expect(REG_DOCTYPE.test('<!DOCTYPE >')).to.be.false;
		REG_DOCTYPE.lastIndex = 0;
		expect(REG_DOCTYPE.test(`<!DOCTYPE test
			Anything 123
		>`)).to.be.true;
		REG_DOCTYPE.lastIndex = 0;
		expect(REG_DOCTYPE.test('<!DOCTYPE "anyt\'hing" \'anyt"hing\' <![CDATA[Any Thing]]>>')).to.be.true;
		REG_DOCTYPE.lastIndex = 0;
		expect(REG_DOCTYPE.test('<!DOCTYPE "aaa \'123>')).to.be.false;
		REG_DOCTYPE.lastIndex = 0;
		expect(REG_DOCTYPE.test('<!DOCTYPE <bbb>')).to.be.false;
	});

	it('Other Declare', () => {
		REG_OTHER_DECL.lastIndex = 0;
		expect(REG_OTHER_DECL.test('<!ELEMENT>')).to.be.false;
		REG_OTHER_DECL.lastIndex = 0;
		expect(REG_OTHER_DECL.test('<!ELEMENT >')).to.be.false;
		REG_OTHER_DECL.lastIndex = 0;
		expect(REG_OTHER_DECL.test(`<!ELEMENT test
			Anything 123
		>`)).to.be.true;
		REG_OTHER_DECL.lastIndex = 0;
		expect(REG_OTHER_DECL.test('<!ELEMENT "anyt\'hing" \'anyt"hing\' <![CDATA[Any Thing]]>>')).to.be.true;
		REG_OTHER_DECL.lastIndex = 0;
		expect(REG_OTHER_DECL.test('<!ELEMENT "aaa \'123>')).to.be.false;
		REG_OTHER_DECL.lastIndex = 0;
		expect(REG_OTHER_DECL.test('<!ELEMENT <bbb>')).to.be.false;
	});

	it('Comments', () => {
		REG_COMMENTS.lastIndex = 0;
		expect(REG_COMMENTS.test('<!--->')).to.be.false;
		REG_COMMENTS.lastIndex = 0;
		expect(REG_COMMENTS.test('<!---->')).to.be.true;
		REG_COMMENTS.lastIndex = 0;
		expect(REG_COMMENTS.test('<!--------- -------->')).to.be.true;
		REG_COMMENTS.lastIndex = 0;
		expect(REG_COMMENTS.test(`<!-- test
			Anything 123
		-->`)).to.be.true;
	});

	it('Start Tag', () => {
		REG_START_TAG.lastIndex = 0;
		expect(REG_START_TAG.test('<a>')).to.be.true;
		REG_START_TAG.lastIndex = 0;
		expect(REG_START_TAG.test('< a>')).to.be.false;
		REG_START_TAG.lastIndex = 0;
		expect(REG_START_TAG.test('<1a>')).to.be.false;
		REG_START_TAG.lastIndex = 0;
		expect(REG_START_TAG.test(`<a123     
		 b
		 =
		 "
		 2
		 "
		  c
		  =
		  '
		  3
		  '
			 >`)).to.be.true;
	});

	it('End Tag', () => {
		REG_END_TAG.lastIndex = 0;
		expect(REG_END_TAG.test('</a>')).to.be.true;
		REG_END_TAG.lastIndex = 0;
		expect(REG_END_TAG.test(`</a        
		
		>`)).to.be.true;
		REG_END_TAG.lastIndex = 0;
		expect(REG_END_TAG.test('< /a>')).to.be.false;
		REG_END_TAG.lastIndex = 0;
		expect(REG_END_TAG.test('</ a>')).to.be.false;
		REG_END_TAG.lastIndex = 0;
		expect(REG_END_TAG.test('</1a>')).to.be.false;
		REG_END_TAG.lastIndex = 0;
		expect(REG_END_TAG.test('</a b>')).to.be.false;
	});

	it('Attribute', () => {
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('a="b"')).to.be.true;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('a="&"')).to.be.false;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('a=""')).to.be.true;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('a="<"')).to.be.false;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test(`a  =  '
		b
		'   `)).to.be.true;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('1a="b"')).to.be.false;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('a="&nbsp;"')).to.be.true;
		REG_ATTR.lastIndex = 0;
		expect(REG_ATTR.test('a="&#xAbc123;"')).to.be.true;
	});
});
