import * as THREE from 'https://unpkg.com/three@0.179.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.179.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const board = new THREE.Group();
const squareSize = 1;
for (let x = 0; x < 8; x++) {
  for (let z = 0; z < 8; z++) {
    const color = (x + z) % 2 === 0 ? 0xffffff : 0x222222;
    const geometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize);
    const material = new THREE.MeshStandardMaterial({ color });
    const square = new THREE.Mesh(geometry, material);
    square.position.set((x - 3.5) * squareSize, 0, (z - 3.5) * squareSize);
    board.add(square);
  }
}
scene.add(board);

const pieceGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 32);
const pieceMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const piece = new THREE.Mesh(pieceGeometry, pieceMaterial);
piece.position.set(0, 0.45, 0);
scene.add(piece);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

camera.position.set(5, 7, 10);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
