const chai = require('chai');
const should = chai.should();
import { parseSelector } from '../../../src/slimming/style/parse-selector';


describe('style/parse-selector', () => {
	it('parse selectors', () => {
		const selectors = '*.a #b c::d + e:f(h) ~ g[i="j"][k^=l][m]';
		parseSelector(selectors).should.deep.equal([
            {
                attr: [],
                class: ['a'],
                id: [],
                pseudo: [],
                universal: true,
            },
            {
                attr: [],
                class: [],
                id: ['b'],
                pseudo: [],
            },
            {
                attr: [],
                class: [],
                combinator: 2,
                id: [],
                pseudo: [{
                    func: 'd',
                    isClass: false,
                }],
                type: 'c',
            },
            {
                attr: [],
                class: [],
                combinator: 3,
                id: [],
                pseudo: [{
                    func: 'f',
                    value: 'h',
                    isClass: true,
                }],
                type: 'e',
            },
            {
                attr: [{
                    key: 'i',
                    value: '"j"'
                },
                {
                    key: 'k',
                    modifier: 1,
                    value: 'l',
                },
                {
                    key: 'm'
                }],
                class: [],
                id: [],
                pseudo: [],
                type: 'g',
            },
        ]);
	});
});
