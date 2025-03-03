import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};


// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

//Color
debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';

// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
          //animation: uTime
        uTime: { value: 0.0},
        //big waves
        uBigWavesElevation: { value: 0.2},
        uBigWavesFrecuency: {value: new THREE.Vector2(4, 1.5)},
        uBigWavesSpeed: {value: 0.75},
         //small waves:
         uSmallWavesElevation: { value: 0.15},
         uSmallWavesFrecuency: {value: 3.0},
         uSmallWavesSpeed: {value: 0.2},
         uSmallIterations: {value:3.0},
        //colors
        uDepthColor: { value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: { value: 0.08},
        uColorMultiplier: {value: 1.7},
       
        
      

    }
});
// to create a mix of big & small waves => sinus
// we want to control the frecuency on the x & z axes => uBigWavesFrecuency
// Animation => using the elapsed time to offset the value in the sin()
// We want to control the speed ot the waves=> using the same speed for both axes => uBigWavesSpeed
// We are going to use TWO DIFFERENT COLORS, one for the DEPTH, and other for the SURFACE => CONTROL OF THE COLORS: CREATION debugObject
// to do that more realistic we need small Waves using a 3D perlin noise to meke the waves change in time.
// In raging see the waves look more chaotic with different and unpredictable frequencies => applying more cnoise at higher frecuencies => for() loop in vertex.glsl
//Debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name('uBigWavesElevation')

gui.add(waterMaterial.uniforms.uBigWavesFrecuency.value, 'x')
    .min(0)
    .max(10)
    .step(0.001)
    .name('uBigWavesFrecuencyX');

gui.add(waterMaterial.uniforms.uBigWavesFrecuency.value, 'y')
    .min(0)
    .max(10)
    .step(0.001)
    .name('uBigWavesFrecuencyY');

gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
    .min(0)
    .max(3)
    .step(0.001)
    .name('uBigWavesSpeed');

gui.addColor(debugObject, 'depthColor')
    .onChange(()=>{ waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)})
    .name('depthColor');

gui.addColor(debugObject, 'surfaceColor')
    .onChange(()=>{ waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)})
    .name('surfaceColor')

gui.add(waterMaterial.uniforms.uColorOffset, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name('uColorOffset');

gui.add(waterMaterial.uniforms.uColorMultiplier, 'value')
    .min(0)
    .max(10)
    .step(0.001)
    .name('uColorMultiplier');

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
    .min(0)
    .max(1)
    .step(0.001)
    .name('uSmallWavesElevation');

gui.add(waterMaterial.uniforms.uSmallWavesFrecuency, 'value')
    .min(0)
    .max(30)
    .step(0.001)
    .name('uSmallWavesFrecuency');

gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
    .min(0)
    .max(4)
    .step(0.001)
    .name('uSmallWavesSpeed');

gui.add(waterMaterial.uniforms.uSmallIterations, 'value')
    .min(0)
    .max(5)
    .step(1)
    .name('uSmallIterations');

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = - Math.PI * 0.5;
scene.add(water);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();

    //Update material
    if(waterMaterial.uniforms.uTime) waterMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();