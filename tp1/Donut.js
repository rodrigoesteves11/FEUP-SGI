import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/*
    A Donut is a 3D object that represents the pink donut from The Simpsons, with a slice removed and placed on a plate.
*/

class Donut extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    // Materials
    const donutMaterial = new THREE.MeshStandardMaterial({
      color: 0xD971AC, // Pink frosting color
      roughness: 0.5,
      metalness: 0.1,
    });

    const donutBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0xD2A679, // Donut bread color
      roughness: 0.7,
    });

    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, // White plate color
      roughness: 0.9,
    });

    // Donut dimensions with a smaller hole
    const donutRadius = 0.4;
    const tubeRadius = 0.2;
    const sliceAngle = Math.PI / 4; // Angle of the slice (45 degrees)

    // Create donut base with a slice removed
    const donutGeometry = new THREE.TorusGeometry(
      donutRadius * 0.9,
      tubeRadius,
      32,
      64,
      2 * Math.PI  // Incomplete torus to create a gap
    );
    const donutBase = new THREE.Mesh(donutGeometry, donutBaseMaterial);
    donutBase.rotation.x = Math.PI / 2; // Rotate to align with Y-axis
    donutBase.position.y = -0.05; // Slightly raised to sit on top of the donut base
    this.add(donutBase);

    // Frosting on top of donut with a slice removed
    const frostingGeometry = new THREE.TorusGeometry(
      donutRadius,
      tubeRadius * 0.9,
      32,
      64,
      2 * Math.PI 
    );
    const frosting = new THREE.Mesh(frostingGeometry, donutMaterial);
    frosting.position.y = 0.02; // Slightly raised to sit on top of the donut base
    frosting.rotation.x = Math.PI / 2;
    this.add(frosting);

    // Sprinkles
    const sprinkleColors = [0xFF69B4, 0xFFD700, 0xADFF2F, 0x87CEEB, 0xFF6347];
    const sprinkleCount = 200;
    const minRadius = donutRadius * 0.75; // Minimum radius to keep sprinkles outside the hole
    const maxRadius = donutRadius * 1.1; // Maximum radius to stay within the donut's outer edge

    for (let i = 0; i < sprinkleCount; i++) {
      const sprinkleMaterial = new THREE.MeshStandardMaterial({
        color: sprinkleColors[Math.floor(Math.random() * sprinkleColors.length)],
        metalness: 0.3,
        roughness: 0.2,
      });
      const sprinkleGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.04, 8);
      const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial);

      // Randomize position within circular area, but exclude the slice angle
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      let angle;
      do {
        angle = Math.random() * (2 * Math.PI );
      } while (angle > (2 * Math.PI ) && angle < sliceAngle); // Avoid placing in slice area

      const posX = radius * Math.cos(angle);
      const posZ = radius * Math.sin(angle);

      sprinkle.position.set(posX, 0.20, posZ);
      sprinkle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.add(sprinkle);
    }

    // Plate under the donut
    const plateRadius = donutRadius * 1.5;
    const plateHeight = 0.05;
    const plateGeometry = new THREE.CylinderGeometry(plateRadius, plateRadius, plateHeight, 32);
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -0.2; // Position the plate slightly below the donut
    this.add(plate);
  }
}

Donut.prototype.isGroup = true;

export { Donut };
