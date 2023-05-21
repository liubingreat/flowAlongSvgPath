import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
export class Particle {
    constructor(options) {
        this.options = Object.assign(this.getDefaultOptions(), options);
        this.initLayout();
    }

    /**
     * 初始化布局
     */
    initLayout() {
        this.container = document.createElement("div");
        this.canvas = document.createElement("canvas");
        this.container.appendChild(this.canvas);
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;
    }

    /**
     * 添加到容器
     * @param {*} parent 
     */
    async addTo(parent) {
        if (typeof parent == "string") {
            parent = document.querySelector(`#${parent}`);
        }
        parent.appendChild(this.container);
        await this.initZr();
        await this.start();
    }

    /**
     * 初始化zrender并添加粒子
     */
    async initZr() {
        let zr = this.zr = zrender.init(this.canvas);
        let svg = await this.svg2Vector(this.options.svgUrl, this.options.lerpSpace);
        let shps = svg.shps;
        let svgWidth = svg.width;
        let svgHeight = svg.height;
        this.matrix = zrender.matrix.scale(zrender.matrix.create(), zrender.matrix.create(), [this.options.width / svgWidth, this.options.height / svgHeight]);
        this.vectors = [];
        let count = 0;
        let lineGroup = this.lineGroup = new zrender.Group();
        zr.add(lineGroup);
        for (let i = 0; i < shps.length; i++) {
            let shp = shps[i];
            let points = [];
            for (let j = shp.vectors.length - 1; j >= 0; j--) {
                let v = shp.vectors[j];
                
                v = this.project(v);
                points.push([v[0], v[1]]);
            }
            let polyline = new zrender.Polyline({
                shape: {
                    points: points,
                    smooth: 1
                },
                style: {
                    stroke: this.options.lineColor
                }
            });

            lineGroup.add(polyline);
            count += shp.vectors.length;
            this.vectors = this.vectors.concat(shp.vectors);
        }

    
        this.count = count;

        let group = this.group = new zrender.Group();
        zr.add(group);
        for (let i = 0, len = this.options.particleCount; i < len; i++) {
            let circle = new zrender.Circle({
                shape: {
                    cx: 0,
                    cy: 0,
                    r: 0
                },
                style: {
                    fill: this.options.particleColor,
                    shadowColor: this.options.particleShadowColor,
                    shadowBlur: this.options.shadowBlur,
                    // blend: "overlay"
                },
                z: len - i,

            });
            group.add(circle);
        }
    }

    /**
     * 坐标转换
     * @param {*} vector 
     * @returns 
     */
    project(vector) {
        return this.matrix && zrender.vector.applyTransform(zrender.vector.create(), zrender.vector.create(vector.x, vector.y),this.matrix);
    }

    /**
     * 主循环
     * @param {*} param 
     */
    render(param) {
        this.renderHandler = requestAnimationFrame(this.render.bind(this));
        this.frame(param);
    }

    /**
     * 每帧执行处理
     * @param {*} param 
     */
    frame(param) {
        let index = Math.ceil(param / 1000 * this.options.speed);
        let pos = this.getPos(index);
        let count = this.options.particleCount;

        //更新每个粒子位置及半径
        for (let i = count - 1; i >= 0; i--) {
            let circle = this.group.childAt(i);
            let p = pos[i];
            p = this.project(p);
            circle.shape.cx = p[0];
            circle.shape.cy = p[1];
            circle.shape.r = this.exponentialDecay(count - i, this.options.radius, this.options.decay);
            circle.style.shadowBlur = this.options.shadowBlur;
            circle.style.fill = this.options.particleColor;
            circle.dirty();
        }

    }

    /**
     * 指数衰减函数模拟水滴切面曲线
     * @param {*} x 
     * @param {*} a 
     * @param {*} b 
     * @returns 
     */
    exponentialDecay(x, a, b) {
        return a * Math.exp(-b * x);
    }

    /**
     * 获取当前点位以前的点位坐标
     * @param {*} firstPosIndex 
     * @returns 
     */
    getPos(firstPosIndex) {
        firstPosIndex = firstPosIndex % this.count;
        if (firstPosIndex - this.options.particleCount < 0) {
            let arr = new Array(this.options.particleCount - firstPosIndex);
            arr.fill(this.vectors[0]);
            return arr.concat(this.vectors.slice(0, firstPosIndex))
        } else {
            return this.vectors.slice(firstPosIndex - this.options.particleCount, firstPosIndex)
        }

    }

    /**
     * 开始播放
     * @returns 
     */
    start() {
        this.index = 0;
        if (this.count <= this.options.particleCount) {
            console.log("例子总数太少")
            return
        }
        this.renderHandler = requestAnimationFrame(this.render.bind(this))
    }

    /**
     * 停止播放
     */
    stop() {
        cancelAnimationFrame(this.renderHandler)
    }

    /**
     * resize
     */
    resize() {

    }

    /**
     * 销毁
     */
    destroy() {
        cancelAnimationFrame(this.renderHandler)
        this.zr.dispose()
    }

    /**
     * 将svg转换为二维坐标序列
     * @param {*} svg 
     * @param {*} svgCount 
     * @returns 
     */
    async svg2Vector(svg, svgCount) {
        let svgPromise = this.loadSvg(svg)
        return svgPromise.then((e)=> {
    
            let width =  e.xml.width.baseVal.value;
            let height = e.xml.height.baseVal.value;
            if(!width || !height) {
                let viewBox = e.xml.viewBox.baseVal;
                width = viewBox.width;
                height = viewBox.height;
            }
            let paths = e.paths;
            let mergeShps = [];
            for(let i = 0; i < paths.length; i++) {
                let shps =  paths[i].toShapes();
                
                for(let j = 0; j < shps.length; j++) {
                    shps[j].getLength() > 0 && mergeShps.push(shps[j]);
                }
            }
            
            let shps = [], firstLen = 0, firstvectorCount = svgCount || 100;
            for(let i = 0; i < mergeShps.length; i++) {
                let shp = mergeShps[i];
                if(i === 0) {
                    firstLen = shp.getLength();
                    shps.push({
                        length: firstLen,
                        vectors: shp.getSpacedPoints(firstvectorCount)
                    })
                }else {
                    shps.push({
                        length: shp.getLength(),
                        vectors: shp.getSpacedPoints(Math.ceil(shp.getLength() / firstLen) * firstvectorCount)
                    })
                }
            }
            return {
                width,
                height,
                shps
            };
        });
    }

    /**
     * 使用three.js SVGLoader 加载/解析svg
     * @param {*} svg 
     * @returns 
     */
    loadSvg(svg) {
        const loader = new SVGLoader();
        return new Promise((resolve, reject)=>{
            loader.load(
                svg,
                function ( data ) {
                    resolve(data);
                },
                function (  ) {
            
                },
                function ( error ) {
                   reject(0)
                }
            );
        });
    }

    /**
     * 获取默认配置项
     * @returns 
     */
    getDefaultOptions() {
        return {
            svgUrl: "assets/method-draw-image.svg",
            width: 1600,
            lerpSpace: 1000,
            height: 800,
            particleCount: 130,
            speed: 100,
            lineColor: "rgba(0,255,255,1)",
            particleColor: "rgba(0,255,255,1)",
            particleShadowColor: "rgba(0,255,255,0.6)",
            radius: 8,
            decay: 0.1,
            shadowBlur: 14
        }
    }
}