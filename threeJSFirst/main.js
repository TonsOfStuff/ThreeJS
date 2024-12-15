import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const sizeOfUniverse = 500;


//UI
const starInfoUI = document.getElementById("starUI");
starInfoUI.style.display = "none";


//Colors
const blue = new THREE.Color().setRGB(0, 0, 0.5);
const yellow = new THREE.Color().setRGB(0.5, 0.7, 0);
const red = new THREE.Color().setRGB(0.1, 0, 0);

//Sphere creation
const geometry = new THREE.SphereGeometry(2);
const material = new THREE.MeshBasicMaterial({color: yellow})


for (let i = 0; i <= 50; i++){
  const star = new THREE.Mesh(geometry, material);
  star.name = i.toString();
  star.position.x = Math.random() * sizeOfUniverse - Math.random() * sizeOfUniverse
  star.position.y = Math.random() * sizeOfUniverse - Math.random() * sizeOfUniverse
  star.position.z = Math.random() * sizeOfUniverse - Math.random() * sizeOfUniverse
  scene.add(star);
}


//Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,1)
scene.add(pointLight)


camera.position.z = 7;

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.12;

//Helpers
//const gridHelper = new THREE.GridHelper(200,50);
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper)



//Raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1; 
}

function onMouseDown(event) {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, false);

  if (intersects.length > 0) {
    let filtered = intersects.filter(item => item.object.name != "");
    if (filtered.length > 0){
      console.log('Clicked on:', filtered[0]);
      starInfoUI.style.display = "block"
      starInfoUI.innerText = filtered[0].object.name;
    }
    
  }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);


//Main loop
function animate(){
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();