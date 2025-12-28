import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js';

// Escena
const scene = new THREE.Scene();

// Cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Render
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 0.8);
light.position.set(5, 5, 5);
scene.add(light);

// Cargar modelo
let modelo;
const loader = new GLTFLoader();

loader.load('./modelo.glb', (gltf) => {
  modelo = gltf.scene;
  modelo.scale.set(1, 1, 1);
  scene.add(modelo);
});

// 🔹 Movimiento horizontal con mouse
let arrastrando = false;
let xPrevio = 0;

renderer.domElement.addEventListener('mousedown', (e) => {
  arrastrando = true;
  xPrevio = e.clientX;
});

window.addEventListener('mouseup', () => {
  arrastrando = false;
});

window.addEventListener('mousemove', (e) => {
  if (!arrastrando || !modelo) return;

  const dx = e.clientX - xPrevio;
  modelo.position.x += dx * 0.01;
  xPrevio = e.clientX;
});

// Animación
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Responsive
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
