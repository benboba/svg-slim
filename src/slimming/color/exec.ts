import { shortenFunc } from '../utils/shorten-func';
import { numberPattern } from '../const/syntax';
import { keywords } from './keywords';
import { valid, validOpacity } from './valid';
import { hsl2rgb } from './hsl2rgb';

interface IRGBColor {
    r: number;
    g: number;
    b: number;
    a: number;
    origin: string;
    valid: boolean;
}

const colorFuncReg = new RegExp(`((?:rgb|hsl)a?)\\((${numberPattern})(%?),(${numberPattern})(%?),(${numberPattern})(%?)(?:,(${numberPattern})(%?))?\\)`, 'gi');
const hexReg = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FF = 255;
const Hundred = 100;
const Hex = 16;

export function exec(color: string): IRGBColor {
    let _color = shortenFunc(color.trim());

    // 首先把关键字转为 16 位色
    if (keywords.hasOwnProperty(color)) {
        _color = keywords[color as keyof typeof keywords];
    }

    const result = {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
        origin: _color,
        valid: true
    };

    // 16 位色直接解析
    const hexMatch = _color.match(hexReg);
    if (hexMatch) {
        const hex = hexMatch[1];
        switch (hex.length) {
            case 3:
                result.r = parseInt(`0x${hex[0]}${hex[0]}`, Hex);
                result.g = parseInt(`0x${hex[1]}${hex[1]}`, Hex);
                result.b = parseInt(`0x${hex[2]}${hex[2]}`, Hex);
                break;
            case 4:
                result.r = parseInt(`0x${hex[0]}${hex[0]}`, Hex);
                result.g = parseInt(`0x${hex[1]}${hex[1]}`, Hex);
                result.b = parseInt(`0x${hex[2]}${hex[2]}`, Hex);
                result.a = parseInt(`0x${hex[3]}${hex[3]}`, Hex) / FF;
                break;
            case 8:
                result.r = parseInt(`0x${hex[0]}${hex[1]}`, Hex);
                result.g = parseInt(`0x${hex[2]}${hex[3]}`, Hex);
                result.b = parseInt(`0x${hex[4]}${hex[5]}`, Hex);
                result.a = parseInt(`0x${hex[6]}${hex[7]}`, Hex) / FF;
                break;
            default:
                result.r = parseInt(`0x${hex[0]}${hex[1]}`, Hex);
                result.g = parseInt(`0x${hex[2]}${hex[3]}`, Hex);
                result.b = parseInt(`0x${hex[4]}${hex[5]}`, Hex);
                break;
        }
        return result;
    }

    // rgb/rgba/hsl/hsla 解析
    const colorMatch = colorFuncReg.exec(_color);
    if (colorMatch) {
        switch (colorMatch[1]) {
            case 'rgba':
                if (colorMatch[3] === colorMatch[5] && colorMatch[5] === colorMatch[7]) {
                    result.r = valid(colorMatch[3], FF, colorMatch[2]);
                    result.g = valid(colorMatch[5], FF, colorMatch[4]);
                    result.b = valid(colorMatch[7], FF, colorMatch[6]);
                    result.a = validOpacity(colorMatch[8].length, colorMatch[9], colorMatch[8]);
                } else {
                    result.valid = false;
                }
                break;
            case 'hsl':
                if (colorMatch[3] || !colorMatch[5] || !colorMatch[7]) {
                    result.valid = false;
                } else {
                    [result.r, result.g, result.b] = hsl2rgb(+colorMatch[2], +colorMatch[4] / Hundred, +colorMatch[6] / Hundred);
                }
                break;
            case 'hsla':
                if (colorMatch[3] || !colorMatch[5] || !colorMatch[7]) {
                    result.valid = false;
                } else {
                    [result.r, result.g, result.b] = hsl2rgb(+colorMatch[2], +colorMatch[4] / Hundred, +colorMatch[6] / Hundred);
                    result.a = validOpacity(colorMatch[8].length, colorMatch[9], colorMatch[8]);
                }
                break;
            default:
                if (colorMatch[3] === colorMatch[5] && colorMatch[5] === colorMatch[7]) {
                    result.r = valid(colorMatch[3], FF, colorMatch[2]);
                    result.g = valid(colorMatch[5], FF, colorMatch[4]);
                    result.b = valid(colorMatch[7], FF, colorMatch[6]);
                } else {
                    result.valid = false;
                }
                break;
        }
        return result;
    } else {
        result.valid = false;
        return result;
    }
}
