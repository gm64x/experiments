import * as THREE from "three"; // Importa tudo como THREE (Objeto) do three (nome do pacote three.js)
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadModel } from "./modules/modelLoader.js";
import GUI from "lil-gui";

const scene = new THREE.Scene(); // Cria uma nova cena 3D e armazena na constante 'scene'
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); // Cria uma nova câmera 3D e armazena na constante 'camera'
// Define o campo de visão (FOV), proporção da tela (aspect ratio), plano de corte próximo (near) e plano de corte distante (far).
// Objetos fora do intervalo entre near e far não serão renderizados.
// Fonte: https://threejs.org/manual/#en/creating-a-scene

const renderer = new THREE.WebGLRenderer(); // Cria um novo renderizador WebGL e armazena na constante 'renderer'
renderer.setClearColor(0x000000, 0); // Fundo totalmente transparente
renderer.setSize(window.innerWidth, window.innerHeight); // Define o tamanho do renderizador para a largura e altura da janela atual
document.body.appendChild(renderer.domElement); // adicionamos o elemento DOM do renderizador ao corpo do documento (este é um elemento <canvas>)

// Adiciona controles de mouse (orbital) para controlar a câmera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // suaviza o movimento
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 20;
controls.target.set(0, 0, 0);
controls.update();

// Adiciona uma luz direcional para iluminar o modelo
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

// Adiciona luz ambiente para garantir visibilidade
const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

// Garante que a câmera está posicionada para ver o modelo
camera.position.set(0, 0, 5);

// Carrega o modelo usando a função do módulo (agora retorna uma Promise com update/params)
let modelController = null;
loadModel(scene).then((ctrl) => {
  modelController = ctrl;
  // create lil-gui controls once model is ready
  createGui(ctrl.params);
});

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material); // Cria uma malha 3D (Mesh) com a geometria e o material definidos
// scene.add(cube); // Adiciona a malha à
// camera.position.z = 5;
// cube.rotation.x = 0.35;

function animate() {
  // Atualiza controles (importante quando enableDamping = true)
  controls.update();
  // Atualiza animação do modelo
  const delta = clock.getDelta();
  if (modelController && typeof modelController.update === "function") {
    modelController.update(delta);
  }
  renderer.render(scene, camera);
}

// Redimensiona o renderer e atualiza a câmera quando a janela muda de tamanho
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize, false);

// Clock for measuring deltas
const clock = new THREE.Clock();

// Create lil-gui panel for model params
function createGui(params) {
  const gui = new GUI({ width: 300 });
  gui.add(params, "rotationSpeed", 0, 65).name("Rotation speed");
  gui.add(params, "tiltAmplitude", 0, 0.5).name("Tilt amplitude");
  gui.add(params, "tiltSpeed", 0, 3).name("Tilt speed");
  gui.add(params, "paused").name("Paused");
}

renderer.setAnimationLoop(animate);
