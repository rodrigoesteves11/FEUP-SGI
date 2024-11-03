import * as THREE from "three";
import { MyNurbsBuilder } from "./utils/MyNurbsBuilder.js";

class Curtains extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";
    this.isOpen = false; // Track if curtains are open
    this.animationInProgress = false; // Track if animation is in progress
    this.init();
  }

  init() {
    const controlPoints = this.createControlPoints();
    const degree1 = 3; // Degree in U direction
    const degree2 = 3; // Degree in V direction
    const samples1 = 50; // Sample points in U direction
    const samples2 = 50; // Sample points in V direction
    const material = new THREE.MeshBasicMaterial({
      color: 0xe3ec62,
      side: THREE.DoubleSide,
      opacity: 1,
      transparent: true,
    });

    const rodRadius = 0.1;
    const rodLength = 9;
    const curtainHeight = 8.5;

    // Right Curtain
    const nurbsBuilder = new MyNurbsBuilder(this.app);
    const geometry = nurbsBuilder.build(
      controlPoints,
      degree1,
      degree2,
      samples1,
      samples2,
      material
    );
    this.rightCurtain = new THREE.Mesh(geometry, material);
    this.rightCurtain.rotation.z = -Math.PI / 2;
    this.rightCurtain.scale.set(2.5, 1, 0.2); // Start with z scale 0 for closed
    this.rightCurtain.position.set(0, curtainHeight, -rodLength / 2 + 0.25); // Set position to the left side
    this.add(this.rightCurtain);

    // Left Curtain
    this.leftCurtain = new THREE.Mesh(geometry, material);
    this.leftCurtain.rotation.z = -Math.PI / 2;
    this.leftCurtain.rotation.y = Math.PI;
    this.leftCurtain.scale.set(2.5, 1, 0.2); // Start with z scale 0 for closed
    this.leftCurtain.position.set(0, curtainHeight, rodLength / 2 - 0.25); // Set position to the right side
    this.add(this.leftCurtain);

    // Curtain rod
    const rodGeometry = new THREE.CylinderGeometry(
      rodRadius,
      rodRadius,
      rodLength,
      32
    );
    const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x800080 });
    const rod = new THREE.Mesh(rodGeometry, rodMaterial);
    rod.rotation.x = Math.PI / 2; // Rotate to make it horizontal along the X-axis
    rod.position.set(0, curtainHeight, 0.05); // Place at the top of the curtains
    this.add(rod);

    // Rod finishers
    const finisherRadius = 0.2;
    const finisherGeometry = new THREE.SphereGeometry(finisherRadius, 16, 16);
    const finisherMaterial = new THREE.MeshStandardMaterial({
      color: 0x800080,
    });

    const leftFinisher = new THREE.Mesh(finisherGeometry, finisherMaterial);
    leftFinisher.position.set(0, curtainHeight, -rodLength / 2);
    this.add(leftFinisher);

    const rightFinisher = new THREE.Mesh(finisherGeometry, finisherMaterial);
    rightFinisher.position.set(0, curtainHeight, rodLength / 2);
    this.add(rightFinisher);

    // Connectors to the wall
    const connectorRadius = 0.05;
    const connectorLength = 0.5;
    const connectorGeometry = new THREE.CylinderGeometry(
      connectorRadius,
      connectorRadius,
      connectorLength,
      16
    );
    const connectorMaterial = new THREE.MeshStandardMaterial({
      color: 0x800080,
    });

    const leftConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    leftConnector.rotation.z = Math.PI / 2; // Rotate to align with the rod
    leftConnector.position.set(
      -connectorLength / 2,
      curtainHeight,
      -rodLength / 2
    );
    this.add(leftConnector);

    const rightConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
    rightConnector.rotation.z = Math.PI / 2; // Rotate to align with the rod
    rightConnector.position.set(
      -connectorLength / 2,
      curtainHeight,
      rodLength / 2
    );
    this.add(rightConnector);

    this.rightCurtain.castShadow = true;
    this.rightCurtain.receiveShadow = true;

    this.leftCurtain.castShadow = true;
    this.leftCurtain.receiveShadow = true;

    rod.castShadow = true;
    rod.receiveShadow = true;

    leftFinisher.castShadow = true;
    leftFinisher.receiveShadow = true;

    rightFinisher.castShadow = true;
    rightFinisher.receiveShadow = true;

    leftConnector.castShadow = true;
    leftConnector.receiveShadow = true;

    rightConnector.castShadow = true;
    rightConnector.receiveShadow = true;

  }

  // Animation function for opening and closing curtains
  toggleCurtains() {
    if (this.animationInProgress) return; // Avoid double-clicking

    const minScaleZ = 0.2; // Minimum z scale for slight gap when closed
    const targetScaleZ = this.isOpen ? minScaleZ : 0.7; // Target z scale, with a gap when closed
    const duration = 1000; // Duration of animation in milliseconds
    const startTime = performance.now();

    this.animationInProgress = true;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1); // Progress from 0 to 1

      // Smooth interpolation using ease-in-out (cubic)
      const scaleFactor = this.easeInOutCubic(progress);

      this.rightCurtain.scale.z = this.isOpen
        ? 1.25 - scaleFactor * (1.25 - minScaleZ)
        : minScaleZ + scaleFactor * (1.25 - minScaleZ);
      this.leftCurtain.scale.z = this.isOpen
        ? 1.25 - scaleFactor * (1.25 - minScaleZ)
        : minScaleZ + scaleFactor * (1.25 - minScaleZ);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isOpen = !this.isOpen; // Toggle state
        this.animationInProgress = false; // Animation done
      }
    };

    requestAnimationFrame(animate);
  }

  // Cubic easing function for smooth in-out animation
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  createControlPoints() {
    const points = [];
    const numPointsX = 10; // Number of points along the X axis
    const numPointsZ = 10; // Number of points along the Z axis
    const amplitude = 1; // Amplitude of the wave
    const frequencyX = 5; // Frequency of the wave in X direction
    const frequencyZ = 2; // Frequency of the wave in Z direction

    for (let i = 0; i < numPointsX; i++) {
      const row = [];
      for (let j = 0; j < numPointsZ; j++) {
        const x = (i / (numPointsX - 1)) * 10; // Scale X position
        const z = (j / (numPointsZ - 1)) * 10; // Scale Z position
        const y =
          amplitude * Math.sin(frequencyX * x) * Math.sin(frequencyZ * z);
        row.push([x, y, z, 1]); // Control point in homogeneous coordinates
      }
      points.push(row);
    }

    return points;
  }


}

Curtains.prototype.isGroup = true;

export { Curtains };
