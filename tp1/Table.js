import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/*
    A Table is a 3D object that represents a table
*/

class Table extends THREE.Object3D {
  /**
      
       */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const plascticAmbientOcclusionTexture = textureLoader.load(
      "./textures/plastic-table/Plastic_Rough_001_ambientOcclusion.jpg"
    );
    const plascticBaseColorTexture = textureLoader.load("./textures/plastic-table/Plastic_Rough_001_basecolor.jpg");
    const plascticNormalMapTexture = textureLoader.load("./textures/plastic-table/Plastic_Rough_001_normal.jpg");
    const plascticRoughnessMapTexture = textureLoader.load(
      "./textures/plastic-table/Plastic_Rough_001_roughness.jpg"
    );
    const plascticHeightMapTexture = textureLoader.load("./textures/plastic-table/Plastic_Rough_001_height.jpg");

    // Materials
    const tableTopMaterial = new THREE.MeshStandardMaterial({
        map: plascticBaseColorTexture,
        aoMap: plascticAmbientOcclusionTexture,
        normalMap: plascticNormalMapTexture,
        roughnessMap: plascticRoughnessMapTexture,
        displacementMap: plascticHeightMapTexture,
        displacementScale: 0.02,
    });

    const tableLegsMaterial = new THREE.MeshStandardMaterial({
        map: plascticBaseColorTexture,
        aoMap: plascticAmbientOcclusionTexture,
        normalMap: plascticNormalMapTexture,
        roughnessMap: plascticRoughnessMapTexture,
        displacementMap: plascticHeightMapTexture,
        displacementScale: 0.02,
    });

    // Table dimensions
    const tableTopWidth = 2;
    const tableTopDepth = 1;
    const tableTopHeight = 0.1;
    const legWidth = 0.1;
    const legHeight = 1;
    const legDepth = 0.1;

    // Create Table
    const tableTopGeometry = new THREE.BoxGeometry(
        tableTopWidth,
        tableTopHeight,
        tableTopDepth
    );
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);

    // Position the table top (above the legs)
    tableTop.position.set(0, legHeight + tableTopHeight / 2, 0);
    this.add(tableTop);

    // Create the legs
    const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);

    // Leg positions relative to the table top
    const legOffsetX = (tableTopWidth - legWidth) / 2;
    const legOffsetZ = (tableTopDepth - legDepth) / 2;

    // Create the four legs and position them
    const leg1 = new THREE.Mesh(legGeometry, tableLegsMaterial);
    leg1.position.set(-legOffsetX, legHeight / 2, -legOffsetZ);
    this.add(leg1);

    const leg2 = new THREE.Mesh(legGeometry, tableLegsMaterial);
    leg2.position.set(legOffsetX, legHeight / 2, -legOffsetZ);
    this.add(leg2);

    const leg3 = new THREE.Mesh(legGeometry, tableLegsMaterial);
    leg3.position.set(-legOffsetX, legHeight / 2, legOffsetZ);
    this.add(leg3);

    const leg4 = new THREE.Mesh(legGeometry, tableLegsMaterial);
    leg4.position.set(legOffsetX, legHeight / 2, legOffsetZ);
    this.add(leg4);

    leg1.castShadow = true;
    leg1.receiveShadow = true;
    
    leg2.castShadow = true;
    leg2.receiveShadow = true;
    
    leg3.castShadow = true;
    leg3.receiveShadow = true;

    leg4.castShadow = true;
    leg4.receiveShadow = true;
    
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
  }
}

Table.prototype.isGroup = true;

export { Table };
