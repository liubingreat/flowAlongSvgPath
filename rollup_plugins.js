
import resolve from 'rollup-plugin-node-resolve';// 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel'          // rollup 的 babel 插件，ES6转ES5
import commonjs from 'rollup-plugin-commonjs'    // 将非ES6语法的包转为ES6可用
import json from 'rollup-plugin-json';           //解析json文件
export const plugins = () => [
    json(),
    resolve({
        modulesOnly: false,
        // only:[ /^@luma.gl\/.*$/, /^@mapbox$/, /^supercluster$/],
        browser: false,
        preferBuiltins: false
    }),
    babel({
        exclude: '**/node_modules/**'
    }),
    commonjs({
        ignoreGlobal: true
    }),

].filter(Boolean);
