/* Minimal Three.js hero — improved car-like geometry with glow */
(function () {
    function isFileProtocol() { return typeof location !== 'undefined' && location.protocol === 'file:'; }
    if (isFileProtocol()) return;

    function ready() {
        var container = document.querySelector('.hero__scene') || document.getElementById('hero');
        if (!container) return;
        var canvasWrap = document.createElement('div');
        canvasWrap.id = 'three-hero';
        canvasWrap.style.position = 'absolute';
        canvasWrap.style.inset = '0';
        canvasWrap.style.pointerEvents = 'none';
        container.style.position = 'relative';
        container.appendChild(canvasWrap);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, canvasWrap.clientWidth / canvasWrap.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.8, 5);
        var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(canvasWrap.clientWidth, canvasWrap.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        canvasWrap.appendChild(renderer.domElement);

        var ambient = new THREE.AmbientLight(0x404060, 0.5);
        scene.add(ambient);
        var key = new THREE.DirectionalLight(0xffffff, 2);
        key.position.set(3, 6, 4);
        scene.add(key);
        var fill = new THREE.DirectionalLight(0xff8844, 0.6);
        fill.position.set(-3, 2, -2);
        scene.add(fill);
        var rim = new THREE.DirectionalLight(0x4488ff, 0.4);
        rim.position.set(0, -1, -4);
        scene.add(rim);

        // Car body group
        var car = new THREE.Group();

        // Main body (low polygon car shape)
        var bodyGeo = new THREE.BoxGeometry(2.2, 0.5, 1);
        var bodyMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1e,
            metalness: 0.7,
            roughness: 0.15,
        });
        var body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.15;
        car.add(body);

        // Cabin (top)
        var cabinGeo = new THREE.BoxGeometry(1.0, 0.35, 0.85);
        var cabinMat = new THREE.MeshStandardMaterial({
            color: 0x222228,
            metalness: 0.5,
            roughness: 0.3,
        });
        var cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(-0.1, 0.55, 0);
        car.add(cabin);

        // Hood
        var hoodGeo = new THREE.BoxGeometry(0.7, 0.15, 0.7);
        var hoodMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1e,
            metalness: 0.8,
            roughness: 0.1,
        });
        var hood = new THREE.Mesh(hoodGeo, hoodMat);
        hood.position.set(0.95, 0.4, 0);
        car.add(hood);

        // Wheels
        var wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.8 });
        var wheelPos = [[-0.7, 0, -0.65], [-0.7, 0, 0.65], [0.7, 0, -0.65], [0.7, 0, 0.65]];
        wheelPos.forEach(function (pos) {
            var wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.15, 16), wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos[0], 0.08, pos[2]);
            car.add(wheel);
            // Wheel rim
            var rimMat2 = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.2 });
            var rim2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.16, 8), rimMat2);
            rim2.rotation.z = Math.PI / 2;
            rim2.position.set(pos[0], 0.08, pos[2]);
            car.add(rim2);
        });

        // Spoiler
        var spoilerMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.6 });
        var spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.8), spoilerMat);
        spoiler.position.set(-1.15, 0.35, 0);
        car.add(spoiler);

        car.position.y = 0.3;
        scene.add(car);

        // Glow ring under car
        var glowGeo = new THREE.RingGeometry(0.8, 1.4, 32);
        var glowMat = new THREE.MeshBasicMaterial({
            color: 0xff6a00,
            transparent: true,
            opacity: 0.12,
            side: THREE.DoubleSide,
        });
        var glow = new THREE.Mesh(glowGeo, glowMat);
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = -0.05;
        scene.add(glow);

        // Ground
        var floorGeo = new THREE.PlaneGeometry(20, 20);
        var floorMat = new THREE.MeshStandardMaterial({
            color: 0x0b0b0b,
            roughness: 0.8,
            metalness: 0.1,
        });
        var floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.25;
        scene.add(floor);

        // Hide fallback image
        var fallbackImage = container.querySelector('.hero__fallback-image');
        if (fallbackImage) {
            fallbackImage.style.transition = 'opacity 0.4s ease';
            fallbackImage.style.opacity = '0';
            window.setTimeout(function () {
                if (fallbackImage && fallbackImage.parentNode) {
                    fallbackImage.style.display = 'none';
                }
            }, 410);
        }

        function onResize() {
            var w = canvasWrap.clientWidth, h = canvasWrap.clientHeight;
            if (w === 0 || h === 0) return;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        window.addEventListener('resize', onResize);

        var t = 0;
        function animate() {
            t += 0.008;
            // Gentle float
            car.position.y = 0.3 + Math.sin(t * 0.8) * 0.04;
            // Slow rotation
            car.rotation.y = Math.sin(t * 0.15) * 0.35;
            car.rotation.x = Math.sin(t * 0.12) * 0.02;
            // Glow pulse
            glow.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.04;
            glow.scale.setScalar(1 + Math.sin(t * 0.6) * 0.02);
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        onResize();
        animate();
    }

    if (window.THREE) ready();
    else {
        var s = document.createElement('script');
        s.src = 'https://unpkg.com/three@0.158.0/build/three.min.js';
        s.onload = function () { ready(); };
        s.onerror = function () { /* fallback to CSS image */ };
        document.head.appendChild(s);
    }
})();
