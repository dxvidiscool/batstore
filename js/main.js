import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

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

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// Cargar modelo GLTF + BIN
let modelo;
const loader = new GLTFLoader();

loader.load(
  "./models/modelo/scene.gltf",
  (gltf) => {
    modelo = gltf.scene;
    modelo.scale.set(0.5, 0.5, 0.5);
    modelo.position.set(0, 0, 0);
    scene.add(modelo);
    console.log("MODELO CARGADO");
  },
  undefined,
  (error) => console.error(error)
);

// Movimiento horizontal con mouse
let arrastrando = false;
let xPrevio = 0;

renderer.domElement.addEventListener("mousedown", (e) => {
  arrastrando = true;
  xPrevio = e.clientX;
});

window.addEventListener("mouseup", () => {
  arrastrando = false;
});

window.addEventListener("mousemove", (e) => {
  if (!arrastrando || !modelo) return;
  const dx = e.clientX - xPrevio;
  modelo.position.x += dx * 0.01;
  xPrevio = e.clientX;
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
