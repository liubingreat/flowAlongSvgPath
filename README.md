# flowAlongSvgPath
animate flow along svg path
![image](https://github.com/liubingreat/flowAlongSvgPath/assets/27998857/d64c8924-6c5a-4ec7-b565-295ad2bf89c1)
# example
```javascript
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

```
