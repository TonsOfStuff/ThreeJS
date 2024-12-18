import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';
import { RenderPass } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2500);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const sizeOfUniverse = 10000;

let selected = null;


//UI
const starInfoUI = document.getElementById("starInfo");

const starUI = document.getElementById("starUI")
starUI.style.display = "none";

const closeUI = document.getElementById("close")
closeUI.addEventListener("click", () => {
  starUI.style.display = "none";
  selected = null;
})


//Colors
const blue = new THREE.Color().setRGB(0, 0.3, 0.5);
const yellow = new THREE.Color().setRGB(0.5, 0.2, 0);
const red = new THREE.Color().setRGB(0.9, 0.2, 0);
const white = new THREE.Color().setRGB(1, 1, 1);

//Sphere creation
const geometry = new THREE.IcosahedronGeometry(1.5, 12);



for (let i = 0; i <= 8000; i++){
  let material = new THREE.MeshBasicMaterial({color: yellow})
  const star = new THREE.Mesh(geometry, material);

  let temp = Math.round(Math.random() * 33000 - Math.random() * 32000) + 2300
  if (temp > 10000){
    if (Math.random() * 100 > 1){
      temp = Math.round(Math.random() * 7000) + 2300
    }
  }
  if (temp <= 2300){
    temp = 2300
  }
  let radius = Math.round((Math.random() * 2 + temp / 10000) * 100) / 100
  let mass = Math.round((Math.random() * 3 + temp / 2000) * 100) / 100

  star.userData.temperature = temp
  star.userData.radius = radius
  star.userData.mass = mass



  if (temp <= 5000){
    material = new THREE.MeshBasicMaterial({color: red})
  }else if (temp <= 7000){
    material = new THREE.MeshBasicMaterial({color: yellow})
  }else if (temp <= 10000){
    material = new THREE.MeshBasicMaterial({color: white})
  }else if (temp <= 50000){
    material = new THREE.MeshBasicMaterial({color: blue})
  }

  star.material = material
  star.scale.set(radius, radius, radius)


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
      starInfoUI.innerText = "Name: " + filtered[0].object.name + "\n";
      starInfoUI.innerText += "Temperature: " + filtered[0].object.userData['temperature'] + "K\n"
      starInfoUI.innerText += "Radius: " + filtered[0].object.userData["radius"] + " Solar Radii\n"
      starInfoUI.innerText += "Mass: " + filtered[0].object.userData["mass"] + " Solar Mass\n"
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

//Bloom
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight), 2, 1, 0.85
)
bloomPass.threshold = 0;
bloomPass.strength = 2;
bloomPass.radius = 1;

const bloomComposer = new EffectComposer(renderer)
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);










//Main loop
function animate(){
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);

    TWEEN.update();

    bloomComposer.render();
}

animate();