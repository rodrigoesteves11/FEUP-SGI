import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/*
    A Door present on the left wall closing the entrance to the another division
*/

class Door extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    const doorMaterial = new THREE.MeshStandardMaterial({
        color: 0xba685f, 
      });

    // 2. Backrest Shape (Rectangular bottom and elliptical top)
    const doorShape = new THREE.Shape();

    const rectWidth = 6.5; // Width of the rectangle part
    const rectHeight = 6 // Height of the rectangle part
    const ellipseRadiusX = rectWidth / 2; // Radius for the elliptical top (half the rectangle's width)
    const ellipseRadiusY = 2; // Height of the elliptical top

    // Draw ellipse (top part of the backrest)
    doorShape.absellipse(
      0,
      rectHeight,
      ellipseRadiusX,
      ellipseRadiusY,
      0,
      Math.PI,
      false
    ); // Ellipse on top of rectangle

    // Draw rectangle (bottom part of the backrest)
    doorShape.lineTo(-rectWidth / 2, rectHeight); // Start at bottom-left corner
    doorShape.lineTo(-rectWidth / 2, 0); // Left vertical line
    doorShape.lineTo(rectWidth / 2, 0); // Top horizontal line (rectangle part)
    doorShape.lineTo(rectWidth / 2, rectHeight); // Top horizontal line (rectangle part)

    // backrest shape to give it depth with beveling enabled
    const extrudeDoorSettings = {
      depth: 0.1, // Thickness along Z-axis (how "deep" the backrest is)
      bevelEnabled: true, // Enable beveling
      bevelThickness: 0.05, // Thickness of the bevel
      bevelSize: 0.05, // Distance from the shape outline that the beveling affects
      bevelSegments: 3, // Number of segments used for the beveling curve (higher = smoother)
    };

    const doorGeometry = new THREE.ExtrudeGeometry(
      doorShape,
      extrudeDoorSettings
    );
    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
    doorMesh.rotation.y = Math.PI/2;
    this.add(doorMesh);

    // Crack to simulate 2 doors

    const crackMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000, 
      });

      const crackGeometry = new THREE.BoxGeometry(
        0.02,
        rectHeight + ellipseRadiusY,
        0.05
    );
    const crack = new THREE.Mesh(crackGeometry, crackMaterial);
    crack.position.setX(-0.05);
    crack.position.setY(rectHeight/2 + ellipseRadiusY/2);
    this.add(crack);

    // Door Handles
    const handleRadius = 0.15;
    const handleGeometry = new THREE.SphereGeometry(handleRadius, 16, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    leftHandle.position.set(-0.175, (rectHeight + ellipseRadiusY)/2, -0.6);
    this.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
    rightHandle.position.set(-0.175, (rectHeight + ellipseRadiusY)/2, 0.6);
    this.add(rightHandle);

  }
}
Door.prototype.isGroup = true;

export { Door };