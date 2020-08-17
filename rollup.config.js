import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import copy from 'rollup-plugin-copy';

export default [{
    input: './src/slimming/app.ts',
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
        copy({
            targets: [{
                src: ['*.md', 'package.json'],
                dest: 'dist',
            }],
        }),
    ],
}, {
    input: './src/xml-parser/app.ts',
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
