import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshBasicMaterial({color: 0xff000})

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,0,1)
scene.add(pointLight)

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 7;

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.12;

//Helpers
const gridHelper = new THREE.GridHelper(200,50);
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(gridHelper, lightHelper)

function animate(){
    requestAnimationFrame(animate);

    controls.update();

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;



    renderer.render(scene, camera);
}

animate();