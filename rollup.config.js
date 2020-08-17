import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [{
    input: './src/svg-slimming.ts',
    output: [
        {
            file: pkg.module,
            format: 'es',
        },
        {
            file: pkg.main,
            format: 'umd',
            name: 'svg-slimming',
        },
    ],
    plugins: [
        typescript(),
    ],
}, {
    input: './src/xml-parser.ts',
    output: [
        {
            file: 'dist/xml-parser.mjs',
            format: 'es',
        },
        {
            file: 'dist/xml-parser.js',
            format: 'umd',
            name: 'xml-parser',
        },
    ],
    plugins: [typescript()],
}]
