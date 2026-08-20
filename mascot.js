(() => {
  const container = document.getElementById("wf-mascot-container");
  const bubble = document.getElementById("wf-mascot-bubble");

  if (!container || !bubble || !window.THREE) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch (error) {
    container.remove();
    bubble.remove();
    return;
  }

  const getSize = () => ({
    width: container.clientWidth || 180,
    height: container.clientHeight || 180,
  });

  const particleField = document.getElementById("mf-particles");
  const particleCount = 22;
  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const size = 3 + Math.random() * 5;
    particle.className = "mf-particle";
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${8 + Math.random() * 10}s`;
    particle.style.animationDelay = `${Math.random() * 12}s`;
    particleField?.appendChild(particle);
  }

  const sparkleBurst = (x, y, count = 8) => {
    for (let index = 0; index < count; index += 1) {
      const sparkle = document.createElement("span");
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.3;
      const distance = 30 + Math.random() * 30;
      sparkle.className = "mf-burst";
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.setProperty("--mf-dx", `${Math.cos(angle) * distance}px`);
      sparkle.style.setProperty("--mf-dy", `${Math.sin(angle) * distance}px`);
      document.body.appendChild(sparkle);
      window.setTimeout(() => sparkle.remove(), 650);
    }
  };
  window.mfSparkleBurst = sparkleBurst;

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, .btn, a.button, input[type=submit], input[type=button]");
    if (target) sparkleBurst(event.clientX, event.clientY, 6);
  });

  const cloudPuff = (x, y, count = 6) => {
    for (let index = 0; index < count; index += 1) {
      const puff = document.createElement("span");
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI;
      const distance = 20 + Math.random() * 40;
      puff.className = "mf-cloud-puff";
      puff.style.left = `${x}px`;
      puff.style.top = `${y}px`;
      puff.style.setProperty("--mf-dx", `${Math.cos(angle) * distance}px`);
      puff.style.setProperty("--mf-dy", `${Math.sin(angle) * distance}px`);
      document.body.appendChild(puff);
      window.setTimeout(() => puff.remove(), 950);
    }
  };
  window.mfCloudPuff = cloudPuff;

  const cloudField = document.getElementById("mf-top-clouds");
  for (let index = 0; index < 6; index += 1) {
    const cloud = document.createElement("span");
    const width = 70 + Math.random() * 90;
    const height = width * 0.4;
    cloud.className = "mf-cloud";
    cloud.style.width = `${width}px`;
    cloud.style.height = `${height}px`;
    cloud.style.top = `${Math.random() * 70}px`;
    cloud.style.opacity = `${0.6 + Math.random() * 0.3}`;
    cloud.style.animationDuration = `${35 + Math.random() * 30}s`;
    cloud.style.animationDelay = `${-Math.random() * 40}s`;

    [
      { size: 0.55, left: 0.1, top: -0.25 },
      { size: 0.4, left: 0.55, top: -0.15 },
    ].forEach((lobe) => {
      const element = document.createElement("span");
      element.className = "mf-cloud-lobe";
      element.style.width = `${width * lobe.size}px`;
      element.style.height = `${width * lobe.size}px`;
      element.style.left = `${width * lobe.left}px`;
      element.style.top = `${width * lobe.top}px`;
      cloud.appendChild(element);
    });
    cloudField?.appendChild(cloud);
  }

  document.querySelectorAll("button, .btn, a.button, .main-nav a, input[type=submit], input[type=button]")
    .forEach((element) => {
      element.addEventListener("mouseenter", () => {
        const rect = element.getBoundingClientRect();
        if (rect.top < 180) cloudPuff(rect.left + rect.width / 2, rect.top, 5);
      });
    });

  const bottomContainer = document.getElementById("mf-bottom-scene");
  if (bottomContainer) {
    const forestScene = new THREE.Scene();
    const forestSize = () => ({
      width: window.innerWidth,
      height: bottomContainer.clientHeight || 220,
    });
    const initialForestSize = forestSize();
    const forestCamera = new THREE.PerspectiveCamera(
      45,
      initialForestSize.width / initialForestSize.height,
      0.1,
      60
    );
    forestCamera.position.set(0, 2.4, 9);
    forestCamera.lookAt(0, 1.2, 0);
    const forestRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    forestRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    forestRenderer.setSize(initialForestSize.width, initialForestSize.height);
    forestRenderer.setClearColor(0x000000, 0);
    forestRenderer.domElement.setAttribute("aria-hidden", "true");
    bottomContainer.appendChild(forestRenderer.domElement);

    forestScene.add(new THREE.HemisphereLight(0xffffff, 0x345b3a, 1));
    const forestSun = new THREE.DirectionalLight(0xfff2d0, 0.8);
    forestSun.position.set(4, 8, 4);
    forestScene.add(forestSun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 8),
      new THREE.MeshStandardMaterial({ color: 0x587a52 })
    );
    ground.rotation.x = -Math.PI / 2;
    forestScene.add(ground);

    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x6b4a34, roughness: 0.9 });
    const pineMaterial = new THREE.MeshStandardMaterial({ color: 0x345b3a, roughness: 0.8 });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x5e8650, roughness: 0.8 });
    const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x7fa15e, roughness: 0.8 });

    const forestGroup = new THREE.Group();
    const grassGroup = new THREE.Group();
    const grassBlades = [];
    forestScene.add(forestGroup, grassGroup);

    for (let index = 0; index < 14; index += 1) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.6, 6), trunkMaterial);
      trunk.position.y = 0.3;
      tree.add(trunk);
      for (let tier = 0; tier < 3; tier += 1) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(0.55 - tier * 0.13, 0.7, 7),
          pineMaterial
        );
        cone.position.y = 0.75 + tier * 0.42;
        tree.add(cone);
      }
      tree.position.set((Math.random() - 0.5) * 34, 0, -1 - Math.random() * 3);
      tree.scale.setScalar(0.7 + Math.random() * 0.6);
      forestGroup.add(tree);
    }

    for (let index = 0; index < 40; index += 1) {
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.3, 4), grassMaterial);
      blade.position.set((Math.random() - 0.5) * 30, 0.15, 1 + Math.random() * 2.5);
      blade.rotation.y = Math.random() * Math.PI;
      grassGroup.add(blade);
      grassBlades.push(blade);
    }

    const forestClock = new THREE.Clock();
    const animateForest = () => {
      requestAnimationFrame(animateForest);
      const time = forestClock.elapsedTime;
      forestGroup.position.x -= Math.min(forestClock.getDelta(), 0.05) * 0.15;
      if (forestGroup.position.x < -17) forestGroup.position.x += 17;
      grassBlades.forEach((blade, index) => {
        blade.rotation.z = Math.sin(time * 1.5 + index) * 0.15;
      });
      forestRenderer.render(forestScene, forestCamera);
    };
    animateForest();

    window.addEventListener("resize", () => {
      const nextSize = forestSize();
      forestCamera.aspect = nextSize.width / nextSize.height;
      forestCamera.updateProjectionMatrix();
      forestRenderer.setSize(nextSize.width, nextSize.height);
    });
  }

  const size = getSize();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, size.width / size.height, 0.1, 50);
  camera.position.set(0, 1.6, 5.2);
  camera.lookAt(0, 1.1, 0);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(size.width, size.height);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  container.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x557755, 1.1));
  const sun = new THREE.DirectionalLight(0xfff2d0, 0.9);
  sun.position.set(3, 6, 4);
  scene.add(sun);

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: 0.8 });
  const bellyMaterial = new THREE.MeshStandardMaterial({ color: 0xf3e0c4, roughness: 0.8 });
  const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2a2a, roughness: 0.5 });
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3 });
  const hoofMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2a20, roughness: 0.6 });
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2c14e,
    roughness: 0.3,
    metalness: 0.4,
    emissive: 0x442f00,
    emissiveIntensity: 0.3,
  });

  const fawn = new THREE.Group();
  scene.add(fawn);

  const charm = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 16), goldMaterial);
  charm.position.set(0, 1.28, 0.55);
  charm.rotation.x = Math.PI / 2;
  fawn.add(charm);
  const charmGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.045), goldMaterial);
  charmGem.position.set(0, 1.2, 0.58);
  fawn.add(charmGem);

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.68, 12, 10), bodyMaterial);
  body.scale.set(1.35, 0.78, 0.78);
  body.position.set(0, 1, 0);
  fawn.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.36, 8, 8), bellyMaterial);
  belly.scale.set(1, 0.6, 0.8);
  belly.position.set(0, 0.78, 0.08);
  fawn.add(belly);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.45, 0.62);
  fawn.add(headGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 10, 10), bodyMaterial);
  head.scale.set(0.9, 0.85, 1);
  headGroup.add(head);

  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), bellyMaterial);
  muzzle.scale.set(1.25, 0.72, 1);
  muzzle.position.set(0, -0.07, 0.3);
  headGroup.add(muzzle);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), noseMaterial);
  nose.position.set(0, -0.04, 0.46);
  headGroup.add(nose);

  const eyeGeometry = new THREE.SphereGeometry(0.055, 8, 8);
  const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eyeLeft.position.set(0.16, 0.08, 0.28);
  headGroup.add(eyeLeft);
  const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
  eyeRight.position.set(-0.16, 0.08, 0.28);
  headGroup.add(eyeRight);

  const makeEar = (sign) => {
    const pivot = new THREE.Group();
    pivot.position.set(sign * 0.2, 0.25, 0);
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.34, 6), bodyMaterial);
    ear.position.y = 0.18;
    ear.rotation.z = sign * 0.4;
    pivot.add(ear);
    headGroup.add(pivot);
    return pivot;
  };
  const earLeft = makeEar(1);
  const earRight = makeEar(-1);

  [1, -1].forEach((sign) => {
    const nub = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), hoofMaterial);
    nub.position.set(sign * 0.13, 0.34, -0.04);
    headGroup.add(nub);
  });

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.2, 6), bellyMaterial);
  tail.position.set(0, 1.05, -0.62);
  tail.rotation.x = Math.PI * 0.9;
  fawn.add(tail);

  const makeLeg = (x, z) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.68, z);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.48, 8), bodyMaterial);
    upper.position.y = -0.24;
    pivot.add(upper);
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.09, 8), hoofMaterial);
    hoof.position.y = -0.48;
    pivot.add(hoof);
    fawn.add(pivot);
    return pivot;
  };
  const legs = [makeLeg(0.24, 0.34), makeLeg(-0.24, 0.34), makeLeg(0.24, -0.34), makeLeg(-0.24, -0.34)];

  const ringParticles = new THREE.Group();
  fawn.add(ringParticles);
  for (let index = 0; index < 5; index += 1) {
    ringParticles.add(new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), goldMaterial));
  }

  fawn.scale.setScalar(0.85);
  fawn.position.y = -0.3;

  let mode = "idle";
  let jumpProgress = null;
  let blinkTimer = 0;
  let nextBlinkAt = 2 + Math.random() * 3;
  let bubbleTimeout;
  const clock = new THREE.Clock();
  const greetings = ["Hi there!", "Welcome!", "Keep exploring", "Nice to see you!"];

  const showBubble = (text) => {
    bubble.textContent = text;
    bubble.classList.add("show");
    clearTimeout(bubbleTimeout);
    bubbleTimeout = window.setTimeout(() => bubble.classList.remove("show"), 2200);
  };

  const triggerJump = () => {
    if (mode !== "jump") {
      mode = "jump";
      jumpProgress = 0;
      const rect = container.getBoundingClientRect();
      sparkleBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.6, 10);
    }
  };

  container.addEventListener("click", () => {
    triggerJump();
    showBubble(greetings[Math.floor(Math.random() * greetings.length)]);
  });
  container.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      container.click();
    }
  });
  container.addEventListener("mouseenter", () => showBubble("Hello!"));

  document.querySelectorAll("button, .nav-cta, .primary-btn, .secondary-btn, .filter-btn").forEach((element) => {
    element.addEventListener("mouseenter", () => {
      earLeft.rotation.z = 0.3;
      earRight.rotation.z = -0.3;
      triggerJump();
    });
  });

  const animate = () => {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    blinkTimer += delta;
    if (blinkTimer > nextBlinkAt) {
      const phase = blinkTimer - nextBlinkAt;
      const blinkDuration = 0.15;
      if (phase < blinkDuration) {
        const scale = Math.max(0.08, 1 - Math.sin((phase / blinkDuration) * Math.PI));
        eyeLeft.scale.y = scale;
        eyeRight.scale.y = scale;
      } else {
        eyeLeft.scale.y = 1;
        eyeRight.scale.y = 1;
        blinkTimer = 0;
        nextBlinkAt = 2 + Math.random() * 3;
      }
    }

    earLeft.rotation.z += (Math.sin(time * 1.3) * 0.08 - earLeft.rotation.z) * 0.05;
    earRight.rotation.z += (Math.cos(time * 1.1) * -0.08 - earRight.rotation.z) * 0.05;

    ringParticles.children.forEach((particle, index) => {
      const angle = time * 1.5 + (index / ringParticles.children.length) * Math.PI * 2;
      particle.position.set(
        Math.cos(angle) * 0.14,
        1.22 + Math.sin(time * 2 + index) * 0.02,
        0.55 + Math.sin(angle) * 0.14
      );
    });

    if (mode === "idle") {
      body.scale.set(1, 1 + Math.sin(time * 1.8) * 0.02, 1 + Math.sin(time * 1.8) * 0.02);
      headGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
      fawn.rotation.y = Math.sin(time * 0.3) * 0.15;
    }

    if (mode === "jump" && jumpProgress !== null) {
      jumpProgress += delta;
      const progress = Math.min(jumpProgress / 0.7, 1);
      const lift = Math.sin(progress * Math.PI) * 0.7;
      const legAngle = Math.sin(progress * Math.PI) * 0.6;
      fawn.position.y = -0.3 + lift;
      fawn.rotation.x = -Math.sin(progress * Math.PI) * 0.2;
      legs.slice(0, 2).forEach((leg) => { leg.rotation.x = legAngle; });
      legs.slice(2).forEach((leg) => { leg.rotation.x = -legAngle; });
      if (progress >= 1) {
        jumpProgress = null;
        mode = "idle";
        fawn.position.y = -0.3;
        fawn.rotation.x = 0;
        legs.forEach((leg) => { leg.rotation.x = 0; });
      }
    }

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener("resize", () => {
    const nextSize = getSize();
    camera.aspect = nextSize.width / nextSize.height;
    camera.updateProjectionMatrix();
    renderer.setSize(nextSize.width, nextSize.height);
  });
})();
