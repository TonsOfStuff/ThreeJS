import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const sizeOfUniverse = 5000;

let selected = null;


//UI
const starInfoUI = document.getElementById("starInfo");

const starUI = document.getElementById("starUI")
starUI.style.display = "none";


//Colors
const blue = new THREE.Color().setRGB(0, 0.3, 0.5);
const yellow = new THREE.Color().setRGB(0.5, 0.7, 0);
const red = new THREE.Color().setRGB(0.9, 0.2, 0);

//Sphere creation
const geometry = new THREE.SphereGeometry(2);



for (let i = 0; i <= 10000; i++){
  let material = new THREE.MeshBasicMaterial({color: yellow})
  let rand = Math.round(Math.random() * 5)
  if (rand == 0){
    material = new THREE.MeshBasicMaterial({color: red})
  }else if (rand == 1){
    material = new THREE.MeshBasicMaterial({color: blue})
  }

    

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
      selected = filtered[0];
      starUI.style.display = "grid"
      starInfoUI.innerText = filtered[0].object.name;
    }
    
  }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseDown, false);

//TWEEN
function tweenCamera(targetPosition, duration, focusPosition) {
  if (!camera || !controls) {
      console.error("Camera or controls are not defined.");
      return;
  }

  controls.enabled = false;

  // Create vectors for tweening
  var startPosition = new THREE.Vector3().copy(camera.position);
  var startTarget = new THREE.Vector3().copy(controls.target);

  // Tween camera position and controls target
  var tween = new TWEEN.Tween({
      camX: startPosition.x,
      camY: startPosition.y,
      camZ: startPosition.z,
      targetX: startTarget.x,
      targetY: startTarget.y,
      targetZ: startTarget.z
  })
  .to({
      camX: targetPosition.x,
      camY: targetPosition.y,
      camZ: targetPosition.z + 10, // Add offset if needed
      targetX: focusPosition.x,
      targetY: focusPosition.y,
      targetZ: focusPosition.z
  }, duration)
  .easing(TWEEN.Easing.Cubic.InOut)
  .onUpdate(function (object) {
      // Update camera position
      camera.position.set(object.camX, object.camY, object.camZ);
      
      // Smoothly update controls target
      controls.target.set(object.targetX, object.targetY, object.targetZ);
      controls.update();
  })
  .onComplete(function () {
      // Re-enable controls
      controls.enabled = true;
  })
  .start();
}

//Go to star
document.addEventListener("keydown", (event) => {
  if (event.key === "g" && selected != null){
    tweenCamera(selected.object.position, 4000, selected.object.position)
  }
})












//Main loop
function animate(){
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

    TWEEN.update();
}

animate();