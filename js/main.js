// ===============================
// IMPORTS
// ===============================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js";

// ===============================
// ESCENA
// ===============================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// ===============================
// CÁMARA
// ===============================
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

// ===============================
// RENDERER
// ===============================
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ===============================
// LUCES (FUERTES A PROPÓSITO)
// ===============================
scene.add(new THREE.AmbientLight(0xffffff, 1.2));

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// ===============================
// EJES (DEBUG – LO QUE YA VES)
// ===============================
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// ===============================
// CARGA DEL MODELO
// ===============================
let modelo;
const loader = new GLTFLoader();

loader.load(
  "./models/modelo/model.gltf",
  (gltf) => {
    modelo = gltf.scene;

    // FORZAR VISIBILIDAD TOTAL
    modelo.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = false;
        child.material.opacity = 1;
        child.material.depthWrite = true;
        child.material.side = THREE.DoubleSide;
        child.material.needsUpdate = true;
      }
    });

    // CENTRAR MODELO
    const box = new THREE.Box3().setFromObject(modelo);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    modelo.position.sub(center);

    // ESCALA AUTOMÁTICA
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    modelo.scale.setScalar(scale);

    // ROTACIÓN CORRECTIVA (BLENDER FIX)
    modelo.rotation.x = -Math.PI / 2;

    // AJUSTE DE CÁMARA
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    scene.add(modelo);

    console.log("MODELO CARGADO Y VISIBLE");
  },
  undefined,
  (error) => {
    console.error("ERROR AL CARGAR MODELO:", error);
  }
);

// ===============================
// MOVIMIENTO HORIZONTAL CON MOUSE
// ===============================
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

  const deltaX = e.clientX - xPrevio;
  modelo.rotation.y += deltaX * 0.005;
  xPrevio = e.clientX;
});

// ===============================
// ANIMACIÓN
// ===============================
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// ===============================
// RESIZE
// ===============================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
