import chai = require('chai');
const should = chai.should();
import { shorten } from '../../../src/slimming/matrix/shorten';

describe('matrix/shorten', () => {
	it('shorten translate', () => {
        shorten({
            type: 'translate',
            val: [1.523, 1.333]
        }).should.deep.equal({
            type: 'translate',
            val: [1.5, 1.3],
        });

        shorten({
            type: 'translate',
            val: [1.999, 0]
        }).should.deep.equal({
            type: 'translate',
            val: [2],
        });

        shorten({
            type: 'translate',
            val: [.01, 0.009]
        }).should.deep.equal({
            type: 'translate',
            val: [0],
            noEffect: true,
        });

        shorten({
            type: 'translate',
            val: [.1, 3]
        }, 0, 0, 0).should.deep.equal({
            type: 'translate',
            val: [0, 3],
        });
    });

	it('shorten scale', () => {
        shorten({
            type: 'scale',
            val: [1.3342, 2.3367]
        }).should.deep.equal({
            type: 'scale',
            val: [1.334, 2.337],
        });

        shorten({
            type: 'scale',
            val: [1.9999, 1.9999]
        }).should.deep.equal({
            type: 'scale',
            val: [2],
        });

        shorten({
            type: 'scale',
            val: [1.0001, 1.00009]
        }).should.deep.equal({
            type: 'scale',
            val: [1],
            noEffect: true,
        });
    });

	it('shorten rotate', () => {
        shorten({
            type: 'rotate',
            val: [5.3367]
        }).should.deep.equal({
            type: 'rotate',
            val: [5.34],
        });

        shorten({
            type: 'rotate',
            val: [0.0001]
        }).should.deep.equal({
            type: 'rotate',
            val: [0],
            noEffect: true,
        });
    });

	it('shorten skewX', () => {
        shorten({
            type: 'skewX',
            val: [5.3367]
        }).should.deep.equal({
            type: 'skewX',
            val: [5.34],
        });

        shorten({
            type: 'skewX',
            val: [0.0001]
        }).should.deep.equal({
            type: 'skewX',
            val: [0],
            noEffect: true,
        });
    });

	it('shorten skewY', () => {
        shorten({
            type: 'skewY',
            val: [5.3367]
        }).should.deep.equal({
            type: 'skewY',
            val: [5.34],
        });

        shorten({
            type: 'skewY',
            val: [0.0001]
        }).should.deep.equal({
            type: 'skewY',
            val: [0],
            noEffect: true,
        });
    });

	it('shorten matrix', () => {
        shorten({
            type: 'matrix',
            val: [1, 0, 0.0001, 0.9999, 0, 0],
        },0,0,0).should.deep.equal({
            type: 'translate',
            val: [0],
            noEffect: true,
        });

        shorten({
            type: 'matrix',
            val: [1, 0, 0.0001, 0.9999, 0, 0],
        }).should.deep.equal({
            type: 'translate',
            val: [0],
            noEffect: true,
        });

        shorten({
            type: 'matrix',
            val: [0.0001, 2.234, 234.5, 0.565, 57, 435]
        }).should.deep.equal({
            type: 'matrix',
            val: [0, 2.234, 234.5, 0.565, 57, 435],
        });

        shorten({
            type: 'matrix',
            val: [1, 0, 0, 1, 51, 5]
        }).should.deep.equal({
            type: 'translate',
            val: [51, 5],
        });

        shorten({
            type: 'matrix',
            val: [1, 0, 0, 1, 5, 0]
        }).should.deep.equal({
            type: 'translate',
            val: [5],
        });

        shorten({
            type: 'matrix',
            val: [2, 0, 0, 3, 0, 0]
        }).should.deep.equal({
            type: 'scale',
            val: [2, 3],
        });

        shorten({
            type: 'matrix',
            val: [2, 0, 0, 2, 0, 0]
        }).should.deep.equal({
            type: 'scale',
            val: [2],
        });

        shorten({
            type: 'matrix',
            val: [Math.cos(30 * Math.PI / 180), Math.sin(30 * Math.PI / 180), -Math.sin(30 * Math.PI / 180), Math.cos(30 * Math.PI / 180), 0, 0]
        }).should.deep.equal({
            type: 'rotate',
            val: [30],
        });

        shorten({
            type: 'matrix',
            val: [-Math.cos(30 * Math.PI / 180), Math.sin(30 * Math.PI / 180), -Math.sin(30 * Math.PI / 180), -Math.cos(30 * Math.PI / 180), 0, 0]
        }).should.deep.equal({
            type: 'rotate',
            val: [150],
        });

        shorten({
            type: 'matrix',
            val: [-Math.cos(30 * Math.PI / 180), -Math.sin(30 * Math.PI / 180), Math.sin(30 * Math.PI / 180), -Math.cos(30 * Math.PI / 180), 0, 0]
        }).should.deep.equal({
            type: 'rotate',
            val: [210],
        });

        shorten({
            type: 'matrix',
            val: [Math.cos(5 * Math.PI / 180), -Math.sin(5 * Math.PI / 180), Math.sin(5 * Math.PI / 180), Math.cos(5 * Math.PI / 180), 0, 0]
        }).should.deep.equal({
            type: 'rotate',
            val: [-5],
        });

        shorten({
            type: 'matrix',
            val: [1, 0, Math.tan(30 * Math.PI / 180), 1, 0, 0]
        }).should.deep.equal({
            type: 'skewX',
            val: [30],
        });

        shorten({
            type: 'matrix',
            val: [1, 0, Math.tan(355 * Math.PI / 180), 1, 0, 0]
        }).should.deep.equal({
            type: 'skewX',
            val: [-5],
        });

        shorten({
            type: 'matrix',
            val: [1, Math.tan(30 * Math.PI / 180), 0, 1, 0, 0]
        }).should.deep.equal({
            type: 'skewY',
            val: [30],
        });

        shorten({
            type: 'matrix',
            val: [1, Math.tan(355 * Math.PI / 180), 0, 1, 0, 0]
        }).should.deep.equal({
            type: 'skewY',
            val: [-5],
        });
    });
});
