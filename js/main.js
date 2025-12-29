import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// =======================
// ESCENA
// =======================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// =======================
// CÁMARA
// =======================
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
camera.position.set(0, 1, 3);
camera.lookAt(0, 0, 0);

// =======================
// RENDERER
// =======================
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// =======================
// LUCES (FUERTES)
// =======================
scene.add(new THREE.AmbientLight(0xffffff, 2));

const light1 = new THREE.DirectionalLight(0xffffff, 2);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffffff, 2);
light2.position.set(-5, -5, -5);
scene.add(light2);

// =======================
// Ejes (DEBUG VISUAL)
// =======================
const axes = new THREE.AxesHelper(2);
scene.add(axes);

// =======================
// CARGAR MODELO
// =======================
let modelo;
const loader = new GLTFLoader();

loader.load(
  "./models/modelo/model.gltf",
  (gltf) => {
    modelo = gltf.scene;

    // 🔴 ESCALA FORZADA
    modelo.scale.set(0.01, 0.01, 0.01);

    // 🔴 RECENTRAR AUTOMÁTICAMENTE
    const box = new THREE.Box3().setFromObject(modelo);
    const center = box.getCenter(new THREE.Vector3());
    modelo.position.sub(center);

    scene.add(modelo);

    console.log("MODELO CARGADO Y CENTRADO");
  },
  undefined,
  (error) => {
    console.error("ERROR AL CARGAR MODELO:", error);
  }
);

// =======================
// MOVIMIENTO HORIZONTAL (MOUSE)
// =======================
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

// =======================
// ANIMACIÓN
// =======================
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// =======================
// RESPONSIVE
// =======================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
