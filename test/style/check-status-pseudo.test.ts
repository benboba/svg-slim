import { parseSelector } from 'svg-vdom';
import { checkStatusPseudo } from '../../src/style/check-status-pseudo';

describe('style/check-status-pseudo', () => {
	test('check status pseudo', () => {
        const selector = parseSelector('rect#a.b[c=d], rect:hover, rect:not, rect::hover, rect:first-letter, rect::first-letter, rect:not(.a), rect:not(:hover)');
        expect(checkStatusPseudo(selector[0])).toBeFalsy();
        expect(checkStatusPseudo(selector[1])).toBeTruthy();
        expect(checkStatusPseudo(selector[2])).toBeFalsy();
        expect(checkStatusPseudo(selector[3])).toBeFalsy();
        expect(checkStatusPseudo(selector[4])).toBeTruthy();
        expect(checkStatusPseudo(selector[5])).toBeTruthy();
        expect(checkStatusPseudo(selector[6])).toBeFalsy();
        expect(checkStatusPseudo(selector[7])).toBeTruthy();
    });
});
