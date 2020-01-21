const xmlParser = require('../dist/xml-parser.js');
const xmlMin = require('../dist/xml-parser.min.js');
// const svgSlimming = require('../dist/svg-slimming.min.js');
// const xmlParser = {
//     parse: svgSlimming.xmlParser,
//     NodeType: svgSlimming.NodeType
// };
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

describe('parse success test', async function() {
    const testStr = `<?xml version="1.0"?>
        <!DOCTYPE html>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">test text node<![CDATA[test cdata node]]><text/><!--test comments--></svg>
        <![TESTSECT[test other section]]>
        <!TESTDECL msg="test other declare">
    `;
    const dom = await xmlParser.parse(testStr);
    const domMin = await xmlMin.parse(testStr);
    const childNodes = dom.childNodes;
    const childNodesMin = domMin.childNodes;

    it('根对象应该是 Document', function() {
        dom.nodeName.should.equal('#document');
        dom.nodeType.should.equal(xmlParser.NodeType.Document);
    });

    it('根对象应该是 Document | min', function() {
        domMin.nodeName.should.equal('#document');
        domMin.nodeType.should.equal(xmlMin.NodeType.Document);
    });

    it('解析 XML 声明', function() {
        childNodes[0].nodeName.should.equal('#xml-decl');
        childNodes[0].nodeType.should.equal(xmlParser.NodeType.XMLDecl);
    });

    it('解析 XML 声明 | min', function() {
        childNodesMin[0].nodeName.should.equal('#xml-decl');
        childNodesMin[0].nodeType.should.equal(xmlMin.NodeType.XMLDecl);
    });

    it('解析 DocType', function() {
        childNodes[1].nodeName.should.equal('#doctype');
        childNodes[1].nodeType.should.equal(xmlParser.NodeType.DocType);
        childNodes[1].textContent.should.equal('html');
    });

    it('解析 DocType | min', function() {
        childNodesMin[1].nodeName.should.equal('#doctype');
        childNodesMin[1].nodeType.should.equal(xmlMin.NodeType.DocType);
        childNodesMin[1].textContent.should.equal('html');
    });

    const svg = childNodes[2];
    const svgMin = childNodesMin[2];

    it('解析标签', function() {
        svg.nodeName.should.equal('svg');
        svg.nodeType.should.equal(xmlParser.NodeType.Tag);
    });

    it('解析标签 | min', function() {
        svgMin.nodeName.should.equal('svg');
        svgMin.nodeType.should.equal(xmlMin.NodeType.Tag);
    });

    it('解析属性', function() {
        svg.attributes.length.should.equal(3);
        svg.attributes[0].value.should.equal('1.1');
        svg.attributes[1].name.should.equal('xmlns');
        svg.attributes[2].name.should.equal('xlink');
        svg.attributes[2].namespace.should.equal('xmlns');
    });

    it('解析属性 | min', function() {
        svgMin.attributes.length.should.equal(3);
        svgMin.attributes[0].value.should.equal('1.1');
        svgMin.attributes[1].name.should.equal('xmlns');
        svgMin.attributes[2].name.should.equal('xlink');
        svgMin.attributes[2].namespace.should.equal('xmlns');
    });

    it('解析文本节点', function() {
        const textNode = svg.childNodes[0];
        textNode.nodeName.should.equal('#text');
        textNode.nodeType.should.equal(xmlParser.NodeType.Text);
        textNode.textContent.should.equal('test text node');
    });

    it('解析文本节点 | min', function() {
        const textNodeMin = svgMin.childNodes[0];
        textNodeMin.nodeName.should.equal('#text');
        textNodeMin.nodeType.should.equal(xmlMin.NodeType.Text);
        textNodeMin.textContent.should.equal('test text node');
    });

    it('解析 CDATA 节点', function() {
        const cdata = svg.childNodes[1];
        cdata.nodeName.should.equal('#cdata');
        cdata.nodeType.should.equal(xmlParser.NodeType.CDATA);
        cdata.textContent.should.equal('test cdata node');
    });

    it('解析 CDATA 节点 | min', function() {
        const cdataMin = svgMin.childNodes[1];
        cdataMin.nodeName.should.equal('#cdata');
        cdataMin.nodeType.should.equal(xmlMin.NodeType.CDATA);
        cdataMin.textContent.should.equal('test cdata node');
    });

    it('节点嵌套与自闭合', function() {
        const textTag = svg.childNodes[2];
        textTag.nodeName.should.equal('text');
        textTag.selfClose.should.equal(true);
    });

    it('节点嵌套与自闭合 | min', function() {
        const textTagMin = svgMin.childNodes[2];
        textTagMin.nodeName.should.equal('text');
        textTagMin.selfClose.should.equal(true);
    });

    it('解析注释', function() {
        const comments = svg.childNodes[3];
        comments.nodeName.should.equal('#comments');
        comments.nodeType.should.equal(xmlParser.NodeType.Comments);
        comments.textContent.should.equal('test comments');
    });

    it('解析注释 | min', function() {
        const commentsMin = svgMin.childNodes[3];
        commentsMin.nodeName.should.equal('#comments');
        commentsMin.nodeType.should.equal(xmlMin.NodeType.Comments);
        commentsMin.textContent.should.equal('test comments');
    });

    it('解析其它区块', function() {
        const otherSect = childNodes[3];
        otherSect.nodeName.should.equal('#testsect');
        otherSect.nodeType.should.equal(xmlParser.NodeType.OtherSect);
        otherSect.textContent.should.equal('test other section');
    });

    it('解析其它区块 | min', function() {
        const otherSectMin = childNodesMin[3];
        otherSectMin.nodeName.should.equal('#testsect');
        otherSectMin.nodeType.should.equal(xmlMin.NodeType.OtherSect);
        otherSectMin.textContent.should.equal('test other section');
    });

    it('解析其它声明', function() {
        const otherDecl = childNodes[4];
        otherDecl.nodeName.should.equal('#testdecl');
        otherDecl.nodeType.should.equal(xmlParser.NodeType.OtherDecl);
        otherDecl.textContent.should.equal('msg="test other declare"');
    });

    it('解析其它声明 | min', function() {
        const otherDeclMin = childNodesMin[4];
        otherDeclMin.nodeName.should.equal('#testdecl');
        otherDeclMin.nodeType.should.equal(xmlMin.NodeType.OtherDecl);
        otherDeclMin.textContent.should.equal('msg="test other declare"');
    });
});


describe('parse error test', function() {
    xmlParser.parse(` <?xml version="1.1" ?><svg/>`).catch(err => {
        it('xml声明必须在最前面', function() {
            err.message.should.have.match(/^The xml declaration must be at the front of the document!/);
        });
    });

    xmlMin.parse(` <?xml version="1.1" ?><svg/>`).catch(err => {
        it('xml声明必须在最前面 | min', function() {
            err.message.should.have.match(/^The xml declaration must be at the front of the document!/);
        });
    });

    xmlParser.parse(`<svg>`).catch(err => {
        it('文档结构错误', function() {
            err.message.should.have.match(/^Document structure is wrong!/);
        });
    });

    xmlMin.parse(`<svg>`).catch(err => {
        it('文档结构错误 | min', function() {
            err.message.should.have.match(/^Document structure is wrong!/);
        });
    });

    xmlParser.parse(`<svg></html>`).catch(err => {
        it('开始和结束标签无法匹配', function() {
            err.message.should.have.match(/^The start and end tags cannot match!/);
        });
    });

    xmlMin.parse(`<svg></html>`).catch(err => {
        it('开始和结束标签无法匹配 | min', function() {
            err.message.should.have.match(/^The start and end tags cannot match!/);
        });
    });

    xmlParser.parse(`<svg/><svg/>`).catch(err => {
        it('只允许出现一个根元素节点', function() {
            err.message.should.have.match(/^Only one root element node is allowed!/);
        });
    });

    xmlMin.parse(`<svg/><svg/>`).catch(err => {
        it('只允许出现一个根元素节点 | min', function() {
            err.message.should.have.match(/^Only one root element node is allowed!/);
        });
    });

    xmlParser.parse(``).catch(err => {
        it('没有根元素节点', function() {
            err.message.should.have.match(/^No root element node!/);
        });
    });

    xmlMin.parse(``).catch(err => {
        it('没有根元素节点 | min', function() {
            err.message.should.have.match(/^No root element node!/);
        });
    });

    xmlParser.parse(`<svg attr="1" attr="2"/>`).catch(err => {
        it('属性名重复', function() {
            err.message.should.have.match(/^Duplicate property names!/);
        });
    });

    xmlMin.parse(`<svg attr="1" attr="2"/>`).catch(err => {
        it('属性名重复 | min', function() {
            err.message.should.have.match(/^Duplicate property names!/);
        });
    });

    xmlParser.parse(`<svg/></svg>`).catch(err => {
        it('意外的结束标签', function() {
            err.message.should.have.match(/^Unexpected end tag!/);
        });
    });

    xmlMin.parse(`<svg/></svg>`).catch(err => {
        it('意外的结束标签 | min', function() {
            err.message.should.have.match(/^Unexpected end tag!/);
        });
    });

    xmlParser.parse(`<svg/>123`).catch(err => {
        it('意外的文本节点', function() {
            err.message.should.have.match(/^Unexpected text node!/);
        });
    });

    xmlMin.parse(`<svg/>123`).catch(err => {
        it('意外的文本节点 | min', function() {
            err.message.should.have.match(/^Unexpected text node!/);
        });
    });

    xmlParser.parse(`<svg:/>`).catch(err => {
        it('错误的开始标签', function() {
            err.message.should.have.match(/^Wrong start tag!/);
        });
    });

    xmlMin.parse(`<svg:/>`).catch(err => {
        it('错误的开始标签 | min', function() {
            err.message.should.have.match(/^Wrong start tag!/);
        });
    });

    xmlParser.parse(`<svg attr:="1"/>`).catch(err => {
        it('错误的属性名', function() {
            err.message.should.have.match(/^Wrong attribute name!/);
        });
    });

    xmlMin.parse(`<svg attr:="1"/>`).catch(err => {
        it('错误的属性名 | min', function() {
            err.message.should.have.match(/^Wrong attribute name!/);
        });
    });

    xmlParser.parse(`< svg />`).catch(err => {
        it('解析标签失败', function() {
            err.message.should.have.match(/^Failed to parse tags!/);
        });
    });

    xmlMin.parse(`< svg />`).catch(err => {
        it('解析标签失败 | min', function() {
            err.message.should.have.match(/^Failed to parse tags!/);
        });
    });

});
