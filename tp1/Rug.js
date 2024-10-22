import * as THREE from "three";
import { MyApp } from "./MyApp.js";

class Rug extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    // Define colors for the rectangular rings with rounded corners
    const colors = [
      0xc65a71, // Pink (outermost)
      0x954a9c, // Purple
      0x3b88b6, // Skyblue
      0xd27063, // Orange (innermost)
    ];

    // Define the dimensions for the outermost rounded rectangle
    const outerWidth = 4; // Width of the outermost rectangle
    const outerHeight = 2.5; // Height of the outermost rectangle
    const cornerRadius = 0.4; // Initial radius for the rounded corners

    // Loop to create the 4 nested rounded rectangles
    for (let i = 0; i < 4; i++) {
      const width = outerWidth - i * 1; // Decrease width for each inner rectangle
      const height = outerHeight - i * 0.65; // Decrease height for each inner rectangle
      const currentCornerRadius = Math.min(cornerRadius, width / 4, height / 4); // Ensure corner radius is proportional to width and height
      const offsetY = i * 0.01; // Small offset to avoid Z-fighting

      // Create the shape for the rounded rectangle
      const rectShape = new THREE.Shape();

      // Start from the top-left corner and create a path around the rounded rectangle
      rectShape.moveTo(-width / 2 + currentCornerRadius, height / 2);
      rectShape.lineTo(width / 2 - currentCornerRadius, height / 2);
      rectShape.quadraticCurveTo(width / 2, height / 2, width / 2, height / 2 - currentCornerRadius);
      rectShape.lineTo(width / 2, -height / 2 + currentCornerRadius);
      rectShape.quadraticCurveTo(width / 2, -height / 2, width / 2 - currentCornerRadius, -height / 2);
      rectShape.lineTo(-width / 2 + currentCornerRadius, -height / 2);
      rectShape.quadraticCurveTo(-width / 2, -height / 2, -width / 2, -height / 2 + currentCornerRadius);
      rectShape.lineTo(-width / 2, height / 2 - currentCornerRadius);
      rectShape.quadraticCurveTo(-width / 2, height / 2, -width / 2 + currentCornerRadius, height / 2);

      // Create the geometry for the rounded rectangle shape
      const rugGeometry = new THREE.ShapeGeometry(rectShape);

      // Create the material with the corresponding color
      const rugMaterial = new THREE.MeshBasicMaterial({
        color: colors[i],
        side: THREE.DoubleSide, // Make sure both sides of the rug are visible
      });

      // Create the mesh for each rounded rectangle and add it to the group
      const rugMesh = new THREE.Mesh(rugGeometry, rugMaterial);
      rugMesh.rotation.x = -Math.PI / 2; // Lay it flat on the X-Z plane
      rugMesh.position.set(0, offsetY, 0); // Position on Y-axis slightly to avoid clipping

      this.add(rugMesh); // Add each ring to the rug group
    }

    // Position the rug slightly above the floor
    this.position.set(0, 0.01, 0); // Y = 0.1 to avoid clipping with the ground
  }
}

Rug.prototype.isGroup = true;

export { Rug };
