import { Particle } from "./Particle";
import GUI from "lil-gui";

export async function onload() {

    let particle = window.particle = new Particle({
        svgUrl: "assets/method-draw-image.svg",
        width: 1600,
        lerpSpace: 2200,
        height: 800,
        particleCount: 130,
        speed: 100,
        lineColor: "rgba(0,255,255,1)",
        particleColor: "rgba(0,255,255,1)",
        particleShadowColor: "rgba(0,255,255,0.6)",
        radius: 6.3,
        decay: 0.017,
        shadowBlur: 35.85
    });
    particle.addTo("container");


    let gui = new GUI();
    gui.add(particle.options, "speed", 0.0, 1000).name("速度");
    gui.add(particle.options, "radius", 0.0, 20).name("粒子半径");
    gui.add(particle.options, "decay", 0.0, 1).name("粒子拖尾衰减");
    gui.add(particle.options, "shadowBlur", 0.0, 50).name("粒子辉光");
}
