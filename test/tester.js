const { config } = require('./config.js');
const svgSlimming = require('../dist/svg-slimming.js');
const svgMin = require('../dist/svg-slimming.min.js');
const chai = require('chai');
const should = chai.should();

Object.keys(config).forEach(conf => {
    if (typeof config[conf] === 'boolean') {
        config[conf] = false;
    } else if (Array.isArray(config[conf])) {
        config[conf][0] = false;
    }
});

module.exports = function(testitem, input, output, selfConfig = {}) {

    const realConfig = Object.assign({}, config, selfConfig);

    describe(testitem, function() {

        let res1, res2;
        it('输入和期望输出要一致', async function() {
            res1 = await svgSlimming(input, realConfig);
            res1.should.equal(output);
        });

        it('开发版本和发布版本的结果要一致', async function() {
            res2 = await svgMin(input, realConfig);
            res2.should.equal(res1);
        });
    });
}