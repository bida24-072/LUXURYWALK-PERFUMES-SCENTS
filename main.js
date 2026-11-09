import * as THREE from 'three';

// ==========================================
// 1. THREE.JS SMOKE REVEAL EFFECT
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
container.appendChild(renderer.domElement);

function createSmokeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Golden tinted smoke
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(212, 175, 55, 0.8)'); 
    gradient.addColorStop(0.4, 'rgba(180, 140, 50, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    
    return new THREE.CanvasTexture(canvas);
}

const smokeTexture = createSmokeTexture();
const particleCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const velocities = [];

for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 30;
    const z = (Math.random() - 0.5) * 10;
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
    });
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    map: smokeTexture,
    color: 0xffffff, 
    size: 12,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const smokeParticles = new THREE.Points(geometry, material);
scene.add(smokeParticles);

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    document.body.classList.add('revealed'); // Fades in the text
});

window.addEventListener('touchmove', (e) => {
    if(e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
        document.body.classList.add('revealed');
    }
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();
    
    targetMouseX += (mouseX - targetMouseX) * 0.05;
    targetMouseY += (mouseY - targetMouseY) * 0.05;

    const positions = geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;

        // Mouse repulsion
        const dx = positions[i3] - (targetMouseX * 15);
        const dy = positions[i3 + 1] - (targetMouseY * 15);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 8) {
            const force = (8 - distance) / 8;
            positions[i3] += (dx / distance) * force * 0.3;
            positions[i3 + 1] += (dy / distance) * force * 0.3;
        }

        positions[i3] += Math.sin(time + positions[i3 + 1]) * 0.005;
        positions[i3 + 1] += Math.cos(time + positions[i3]) * 0.005;
    }

    geometry.attributes.position.needsUpdate = true;
    camera.position.x = Math.sin(time * 0.2) * 1;
    camera.position.y = Math.cos(time * 0.2) * 1;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// 2. WHATSAPP ORDER INTEGRATION
// ==========================================
// REPLACE '267XXXXXXXXX' WITH THE ACTUAL PHONE NUMBER (e.g., 26771234567)
const whatsappNumber = "267XXXXXXXXX"; 

function orderViaWhatsApp(productName, price) {
    const message = `Hello Luxury Walk! I would like to order the "${productName}" for ${price}. Is it available?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
}
