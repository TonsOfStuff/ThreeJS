import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//Sphere creation
const geometry = new THREE.SphereGeometry(2);
const material = new THREE.MeshBasicMaterial({color: 0x00c5ff})



var customMaterial = new THREE.ShaderMaterial( 
{
  uniforms: {  },
  vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
  fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending,
  transparent: true
});

for (let i = 0; i <= 15; i++){
  const star = new THREE.Mesh(geometry, customMaterial);
  star.name = "s";
  star.position.x = Math.random() * 200 - Math.random() * 200
  star.position.y = Math.random() * 200 - Math.random() * 200
  star.position.z = Math.random() * 200 - Math.random() * 200
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
const gridHelper = new THREE.GridHelper(200,50);
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(gridHelper, lightHelper)



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
      filtered[0].object.material.color = {b: 0.01, g: 0.23, isColor: true, r: 0.123};
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