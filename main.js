import './style.css'
import './toggle.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

document.getElementById('age').innerHTML = `${Math.floor((new Date() - new Date(1991, 9, 21)) / (365 * 24 * 60 * 60 * 1000))}`;

const checkbox = document.getElementById('cb3');
checkbox.checked = true;
const main = document.getElementById('main');

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        main.style.display = 'grid';
    } else {
        main.style.display = 'none';
    }
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('main-canvas'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.set(30, -50, -20)

renderer.render(scene, camera);

const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x93A9D1, wireframe: true });
// const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x93A9D1 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);

scene.add(torus);
torus.position.set(50, 0, 0)

const pointLight = new THREE.PointLight(0x93A9D1);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);
scene.add(pointLight, ambientLight)

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
    const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
    const starMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const star = new THREE.Mesh(starGeometry, starMaterial);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(200));
    star.position.set(x, y, z);
    scene.add(star);
}

Array(300).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
scene.background = spaceTexture;

const meTexture = new THREE.TextureLoader().load('me.jpeg');
const me = new THREE.Mesh(
    new THREE.BoxGeometry(20, 20, 20),
    new THREE.MeshBasicMaterial({ map: meTexture }),
);
scene.add(me);
me.position.set(30, 20, 30);

const morteSanfoneiraTexture = new THREE.TextureLoader().load('morte-sanfoneira.png');
const morteSanfoneira = new THREE.Mesh(
    new THREE.BoxGeometry(20, 20, 20),
    new THREE.MeshBasicMaterial({ map: morteSanfoneiraTexture }),
);
scene.add(morteSanfoneira);
morteSanfoneira.position.set(-50, 15, -20);

const moonTexture = new THREE.TextureLoader().load('moon.jpeg');
const normalTexture = new THREE.TextureLoader().load('normal.jpeg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(5, 32, 32),
    new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture }),
);
scene.add(moon);
moon.position.set(-20, 25, -50);

function torusRotate() {
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;
}

function meRotate() {
    me.rotation.y += 0.01;
}

function morteSanfoneiraRotate() {
    morteSanfoneira.rotation.y -= 0.01;
}

const orbitRadius = 20;
let date;

function moonRotate() {
    date = Date.now() * 0.0005;
    moon.position.set(
        Math.cos(date) * orbitRadius, -0.1,
        Math.sin(date) * orbitRadius
    );
    moon.rotation.y -= 0.01;
}

let lastScrollTop = 0;

function moveCamera() {
    const scrollTop = (document.body.getBoundingClientRect().top - 8);

    if (scrollTop > lastScrollTop) {
        camera.position.z += lastScrollTop * 0.0004;
        camera.position.x += lastScrollTop * 0.0002;
        camera.rotation.y += lastScrollTop * 0.0002;
    } else {
        camera.position.z -= lastScrollTop * 0.0004;
        camera.position.x -= lastScrollTop * 0.0002;
        camera.rotation.y -= lastScrollTop * 0.0002;
    }

    lastScrollTop = scrollTop;
}

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
    requestAnimationFrame(animate);

    torusRotate();
    meRotate();
    morteSanfoneiraRotate();
    moonRotate();

    controls.update();

    renderer.render(scene, camera);
}

animate();