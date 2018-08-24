// const xmlParser = require('../dist/xml-parser.js');
// const xmlParser = require('../dist/xml-parser.min.js');
const svgSlimming = require('../dist/svg-slimming.min.js');
const xmlParser = {
    parse: svgSlimming.xmlParser,
    NodeType: svgSlimming.NodeType
};
const NodeType = xmlParser.NodeType;
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;

describe('parse error test', function() {
    xmlParser.parse(` <?xml version="1.1" ?><svg/>`).catch(err => {
        it('xml声明必须在最前面', function() {
            err.message.should.have.match(/^xml声明必须在文档最前面/);
        });
    });

    xmlParser.parse(`<svg>`).catch(err => {
        it('文档结构错误', function() {
            err.message.should.have.match(/^文档结构错误/);
        });
    });

    xmlParser.parse(`<svg></html>`).catch(err => {
        it('开始和结束标签无法匹配', function() {
            err.message.should.have.match(/^开始和结束标签无法匹配/);
        });
    });

    xmlParser.parse(`<svg/><svg/>`).catch(err => {
        it('只允许出现一个根元素节点', function() {
            err.message.should.have.match(/^只允许出现一个根元素节点/);
        });
    });

    xmlParser.parse(``).catch(err => {
        it('没有根元素节点', function() {
            err.message.should.have.match(/^没有根元素节点/);
        });
    });

    xmlParser.parse(`<svg attr="1" attr="2"/>`).catch(err => {
        it('属性名重复', function() {
            err.message.should.have.match(/^属性名重复/);
        });
    });

    xmlParser.parse(`<svg/></svg>`).catch(err => {
        it('意外的结束标签', function() {
            err.message.should.have.match(/^意外的结束标签/);
        });
    });

    xmlParser.parse(`<svg/>123`).catch(err => {
        it('意外的文本节点', function() {
            err.message.should.have.match(/^意外的文本节点/);
        });
    });

    xmlParser.parse(`<svg:/>`).catch(err => {
        it('错误的开始标签', function() {
            err.message.should.have.match(/^错误的开始标签/);
        });
    });

    xmlParser.parse(`<svg attr:="1"/>`).catch(err => {
        it('错误的属性名', function() {
            err.message.should.have.match(/^错误的属性名/);
        });
    });

    xmlParser.parse(`< svg />`).catch(err => {
        it('解析标签失败', function() {
            err.message.should.have.match(/^解析标签失败/);
        });
    });

});


describe('parse success test', async function() {
    const testStr = `<?xml version="1.0"?>
        <!DOCTYPE html>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">test text node<![CDATA[test cdata node]]><text/><!--test comments--></svg>
        <![TESTSECT[test other section]]>
        <!TESTDECL msg="test other declare">
    `;
    const dom = await xmlParser.parse(testStr);
    const childNodes = dom.childNodes;

    it('根对象应该是 Document', function() {
        dom.nodeName.should.equal('#document');
        dom.nodeType.should.equal(NodeType.Document);
    });

    it('解析 XML 声明', function() {
        childNodes[0].nodeName.should.equal('#xml-decl');
        childNodes[0].nodeType.should.equal(NodeType.XMLDecl);
    });

    it('解析 DocType', function() {
        childNodes[1].nodeName.should.equal('#doctype');
        childNodes[1].nodeType.should.equal(NodeType.DocType);
        childNodes[1].textContent.should.equal('html');
    });

    const svg = childNodes[2];
    it('解析标签', function() {
        svg.nodeName.should.equal('svg');
        svg.nodeType.should.equal(NodeType.Tag);
    });

    it('解析属性', function() {
        svg.attributes.length.should.equal(3);
        svg.attributes[0].value.should.equal('1.1');
        svg.attributes[1].name.should.equal('xmlns');
        svg.attributes[2].name.should.equal('xlink');
        svg.attributes[2].namespace.should.equal('xmlns');
    });

    it('解析文本节点', function() {
        const textNode = svg.childNodes[0];
        textNode.nodeName.should.equal('#text');
        textNode.nodeType.should.equal(NodeType.Text);
        textNode.textContent.should.equal('test text node');
    });

    it('解析 CDATA 节点', function() {
        const cdata = svg.childNodes[1];
        cdata.nodeName.should.equal('#cdata');
        cdata.nodeType.should.equal(NodeType.CDATA);
        cdata.textContent.should.equal('test cdata node');
    });

    it('节点嵌套与自闭合', function() {
        const textTag = svg.childNodes[2];
        textTag.nodeName.should.equal('text');
        textTag.selfClose.should.equal(true);
    });

    it('解析注释', function() {
        const comments = svg.childNodes[3];
        comments.nodeName.should.equal('#comments');
        comments.nodeType.should.equal(NodeType.Comments);
        comments.textContent.should.equal('test comments');
    });

    it('解析其它区块', function() {
        const otherSect = childNodes[3];
        otherSect.nodeName.should.equal('#testsect');
        otherSect.nodeType.should.equal(NodeType.OtherSect);
        otherSect.textContent.should.equal('test other section');
    });

    it('解析其它声明', function() {
        const otherDecl = childNodes[4];
        otherDecl.nodeName.should.equal('#testdecl');
        otherDecl.nodeType.should.equal(NodeType.OtherDecl);
        otherDecl.textContent.should.equal('msg="test other declare"');
    });
});