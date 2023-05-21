import {plugins} from "./rollup_plugins";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
const path = require("path");
const config = {
    input: "src/index.js",
    plugins: plugins().concat([
        livereload({
            watch: [
                path.resolve(__dirname)
            ]
        }),
        serve({
            open: true,
            port: 8000,
            openPage: '/index.html',
            contentBase: path.resolve(__dirname, "./")
        })
    ]),
    output: {
        file: "dist/index.js",
        format: "umd",
        name: "flowAlongSvgPath",
        sourcemap: true
    }

};
export default config;