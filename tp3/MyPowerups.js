import * as THREE from 'three';

class MyPowerups {
  /**
   * @param {Array<Object>} coordinates - Array of coordinates for powerups. Each object should have { x, y, z }.
   * @param {THREE.Scene} scene - The scene to add powerups to.
   */
  constructor(coordinates, scene) {
    this.coordinates = coordinates; // Array of coordinates
    this.scene = scene; // Scene to add powerups
    this.powerups = []; // Store generated powerups
  }

  /**
   * Generate obstacles based on predefined coordinates.
   */
  generatePowerups() {
    this.coordinates.forEach((coord) => {
      // Pyramid Geometry
      const pyramidGeometry = new THREE.ConeGeometry(
        2, // Radius
        2, // Height
        4 // Segments (4 sides for a pyramid)
      );

      // Create a random material for the obstacle
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0, 1, 0),
        metalness: 0.5,
        roughness: 0.8,
      });

      // Create the regular pyramid
      const regularPyramid = new THREE.Mesh(pyramidGeometry, material);
      regularPyramid.position.set(coord.x, coord.y + 4, coord.z);
      regularPyramid.castShadow = true;
      regularPyramid.receiveShadow = true;

      // Create the upside-down pyramid
      const upsideDownPyramid = new THREE.Mesh(pyramidGeometry, material);
      upsideDownPyramid.position.set(coord.x, coord.y+ 2, coord.z); // Position slightly above the regular pyramid
      upsideDownPyramid.rotation.set(Math.PI, 0, 0); // Rotate upside-down
      upsideDownPyramid.castShadow = true;
      upsideDownPyramid.receiveShadow = true;

      // Add pyramids to the scene
      this.scene.add(regularPyramid);
      this.scene.add(upsideDownPyramid);

      // Store the pyramids in the obstacles array
      this.powerups.push(regularPyramid, upsideDownPyramid);
    });
  }
}

export { MyPowerups };
