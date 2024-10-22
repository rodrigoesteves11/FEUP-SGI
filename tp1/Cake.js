import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/*
    A Cake is a 3D object that represents a cake
*/

class Cake extends THREE.Object3D {
  /**
      
       */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const chocolateAmbientOcclusionTexture = textureLoader.load(
      "./textures/chocolate-cake/Chocolate_001_ambientOcclusion.jpg"
    );
    const chocolateBaseColorTexture = textureLoader.load(
      "./textures/chocolate-cake/Chocolate_001_baseColor.jpg"
    );
    const chocolateNormalMapTexture = textureLoader.load(
      "./textures/chocolate-cake/Chocolate_001_normal.jpg"
    );
    const chocolateRoughnessMapTexture = textureLoader.load(
      "./textures/chocolate-cake/Chocolate_001_roughness.jpg"
    );
    const chocolateHeightMapTexture = textureLoader.load(
      "./textures/chocolate-cake/Chocolate_001_height.jpg"
    );

    // Materials
    const cakeMaterial = new THREE.MeshStandardMaterial({
      map: chocolateBaseColorTexture,
      aoMap: chocolateAmbientOcclusionTexture,
      normalMap: chocolateNormalMapTexture,
      roughnessMap: chocolateRoughnessMapTexture,
      displacementMap: chocolateHeightMapTexture,
      displacementScale: 0.02,
    });

    // Cake dimensions
    const cakeRadius = 0.45;
    const cakeHeight = 0.3;

    // Create cake
    const cakeGeometry = new THREE.CylinderGeometry(
      cakeRadius,
      cakeRadius,
      cakeHeight,
      32
    );
    const cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
    this.add(cake);
  }
}

Cake.prototype.isGroup = true;

export { Cake };
