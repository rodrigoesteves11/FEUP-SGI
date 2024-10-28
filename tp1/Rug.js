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

    // Load the textures tp1\textures\rug\Rug_005_ambientOcclusion.jpg
    const textureLoader = new THREE.TextureLoader();
    const displacementMap = textureLoader.load("./textures/rug/Rug_005_height.jpg");
    const normalMap = textureLoader.load("./textures/rug/Rug_005_normal.jpg");
    const aoMap = textureLoader.load("./textures/rug/Rug_005_ambientOcclusion.jpg");
    const roughnessMap = textureLoader.load("./textures/rug/Rug_005_roughness.jpg");

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

      // Generate UV mapping manually
      this.generateUVs(rugGeometry, width, height);

      // Create the material with the corresponding color and textures
      const rugMaterial = new THREE.MeshStandardMaterial({
        color: colors[i],
        side: THREE.DoubleSide, // Make sure both sides of the rug are visible
        displacementMap: displacementMap,
        normalMap: normalMap,
        aoMap: aoMap,
        roughnessMap: roughnessMap, // Use roughness map
        displacementScale: 0.1, // Start with a lower scale for realistic height
      });

      // Create the mesh for each rounded rectangle and add it to the group
      const rugMesh = new THREE.Mesh(rugGeometry, rugMaterial);
      rugMesh.rotation.x = -Math.PI / 2; // Lay it flat on the X-Z plane
      rugMesh.position.set(0, offsetY, 0); // Position on Y-axis slightly to avoid clipping

      this.add(rugMesh); // Add each ring to the rug group
    }

    // Position the rug slightly above the floor
    this.position.set(0, 0.01, 0); // Y = 0.01 to avoid clipping with the ground
  }

  // Function to generate UV mapping
  generateUVs(geometry, width, height) {
    const uvAttribute = new THREE.Float32BufferAttribute(geometry.attributes.position.count * 2, 2);
    const uvArray = uvAttribute.array;

    for (let i = 0; i < geometry.attributes.position.count; i++) {
      const x = geometry.attributes.position.getX(i);
      const y = geometry.attributes.position.getY(i);
      
      // Map the x and y coordinates to the UV space
      uvArray[i * 2] = (x + width / 2) / width;  // U
      uvArray[i * 2 + 1] = (y + height / 2) / height; // V
    }

    geometry.setAttribute('uv', uvAttribute);
  }
}

Rug.prototype.isGroup = true;

export { Rug };
