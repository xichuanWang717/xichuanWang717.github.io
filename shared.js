import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { MOVIES, CR_BY_YEAR, YEARS } from './data.js';

// Make data globally accessible for experiments
window.__MOVIES__ = MOVIES;
window.__CR_BY_YEAR__ = CR_BY_YEAR;
window.__YEARS__ = YEARS;

// ── Scene ──
const container = document.getElementById('three-container');
const W = container.clientWidth, H = container.clientHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 2000);
camera.position.set(0, 200, 950);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(W, H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(W, H);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0';
labelRenderer.domElement.style.pointerEvents = 'none';
container.appendChild(labelRenderer.domElement);

// ── Controls ──
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.target.set(0, 0, 0);
controls.maxPolarAngle = Math.PI / 2.2;
controls.minDistance = 300;
controls.maxDistance = 1500;
controls.enabled = true;

// ── Lights (flat: ambient only) ──
const ambientLight = new THREE.AmbientLight(0xffefd6, 0.78);
scene.add(ambientLight);
const keyLight = new THREE.DirectionalLight(0xf5c16c, 0.82);
keyLight.position.set(-260, 360, 620);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x4ecdc4, 0.32, 1400);
rimLight.position.set(420, 220, 520);
scene.add(rimLight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ── Resize ──
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  labelRenderer.setSize(w, h);
});

// ── Keep list of lights for cleanup ──
const LIGHTS = [ambientLight, keyLight, rimLight];

function clearScene() {
  while (scene.children.length > LIGHTS.length) {
    const obj = scene.children[scene.children.length - 1];
    scene.remove(obj);
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  }
}

export {
  scene, camera, renderer, labelRenderer, controls,
  MOVIES, CR_BY_YEAR, YEARS,
  clearScene, LIGHTS,
};
