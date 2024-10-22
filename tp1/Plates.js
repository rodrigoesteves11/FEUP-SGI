import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/*
    A Plate is a 3D object that represents a plate
*/

class Plate extends THREE.Object3D {
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
    const plateMaterial = new THREE.MeshStandardMaterial({
      map: chocolateBaseColorTexture,
      aoMap: chocolateAmbientOcclusionTexture,
      normalMap: chocolateNormalMapTexture,
      roughnessMap: chocolateRoughnessMapTexture,
      displacementMap: chocolateHeightMapTexture,
      displacementScale: 0.02,
    });

    // Plate dimensions
    const plateRadius = 0.15; 
    const plateHeight = 0.01; 

    // Plate geometry
    const plateGeometry = new THREE.CylinderGeometry(
        plateRadius,
        plateRadius,
        plateHeight,
        32
      );
    const plate = new THREE.Mesh(plateGeometry, plateMaterial); 
    this.add(plate);
  }
}

Cake.prototype.isGroup = true;

export { Cake };
