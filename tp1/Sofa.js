import * as THREE from "three";
import { MyApp } from "./MyApp.js";

class Sofa extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    // Orange color material
    const sofaMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c00, // Orange color
    });

    /* Sofa textures and materials
    const sofaTexture = new THREE.TextureLoader();
    const sofaAmbientOcclusionTexture = sofaTexture.load(
      "./textures/leather-orange/Leather_004_OCC.png"
    );
    const sofaBaseColorTexture = sofaTexture.load("./textures/leather-orange/Leather_004_COLOR.png");
    const sofaNormalMapTexture = sofaTexture.load("./textures/leather-orange/Leather_004_NRM.png");
    const sofaRoughnessMapTexture = sofaTexture.load(
      "./textures/leather-orange/Leather_004_DISP.png"
    );
    const sofaHeightMapTexture = sofaTexture.load("./textures/leather-orange/Leather_004_SPEC.png");

    const sofaMaterial = new THREE.MeshStandardMaterial({
      map: sofaBaseColorTexture,
      aoMap: sofaAmbientOcclusionTexture,
      normalMap: sofaNormalMapTexture,
      roughnessMap: sofaRoughnessMapTexture,
      displacementMap: sofaHeightMapTexture,
      displacementScale: 0.000001,
    });
    */

    // 1. Sofa Base (BoxGeometry)
    const baseGeometry = new THREE.BoxGeometry(2.5, 0.37, 0.9); // Width, Height (Y-axis), Depth
    const baseMesh = new THREE.Mesh(baseGeometry, sofaMaterial);
    baseMesh.position.set(0, 0.2, -0.05); // Height = 0.2 on Y-axis
    this.add(baseMesh);

    // 2. Backrest Shape (Rectangular bottom and elliptical top)
    const backrestShape = new THREE.Shape();

    const rectWidth = 2.5; // Width of the rectangle part
    const rectHeight = 0.5; // Height of the rectangle part
    const ellipseRadiusX = rectWidth / 2; // Radius for the elliptical top (half the rectangle's width)
    const ellipseRadiusY = 0.3; // Height of the elliptical top

    // Draw ellipse (top part of the backrest)
    backrestShape.absellipse(
      0,
      rectHeight,
      ellipseRadiusX,
      ellipseRadiusY,
      0,
      Math.PI,
      false
    ); // Ellipse on top of rectangle

    // Draw rectangle (bottom part of the backrest)
    backrestShape.lineTo(-rectWidth / 2, rectHeight); // Start at bottom-left corner
    backrestShape.lineTo(-rectWidth / 2, 0); // Left vertical line
    backrestShape.lineTo(rectWidth / 2, 0); // Top horizontal line (rectangle part)
    backrestShape.lineTo(rectWidth / 2, rectHeight); // Top horizontal line (rectangle part)

    // backrest shape to give it depth with beveling enabled
    const extrudeBackRestSettings = {
      depth: 0.1, // Thickness along Z-axis (how "deep" the backrest is)
      bevelEnabled: true, // Enable beveling
      bevelThickness: 0.05, // Thickness of the bevel
      bevelSize: 0.05, // Distance from the shape outline that the beveling affects
      bevelSegments: 3, // Number of segments used for the beveling curve (higher = smoother)
    };

    const backrestGeometry = new THREE.ExtrudeGeometry(
      backrestShape,
      extrudeBackRestSettings
    );
    const backrestMesh = new THREE.Mesh(backrestGeometry, sofaMaterial);
    backrestMesh.position.set(0, 0.4, -0.45); // Position the backrest on the Y-axis and back on Z-axis
    this.add(backrestMesh);

    // 3. Three Pillows
    let pillowShape = new THREE.Shape();
    let eps = 0.00001;
    let radius0 = 0.25;
    let width = 1.2;
    let height = 1.2;
    let radius = radius0 - eps;
    pillowShape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
    pillowShape.absarc(
      eps,
      height - radius * 2,
      eps,
      Math.PI,
      Math.PI / 2,
      true
    );
    pillowShape.absarc(
      width - radius * 2,
      height - radius * 2,
      eps,
      Math.PI / 2,
      0,
      true
    );
    pillowShape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);

    // Extrude the backrest shape to give it depth with beveling enabled
    const extrudePillowSettings = {
      depth: 0.1, // Thickness along Z-axis (how "deep" the backrest is)
      bevelEnabled: true, // Enable beveling
      bevelThickness: 0.05, // Thickness of the bevel
      bevelSize: 0.05, // Distance from the shape outline that the beveling affects
      bevelSegments: 3, // Number of segments used for the beveling curve (higher = smoother)
    };

    // Creating three pillows with adjusted positions along the X-axis
    for (let i = 0; i < 3; i++) {
      const pillowGeometry = new THREE.ExtrudeGeometry(
        pillowShape,
        extrudePillowSettings
      );
      const pillowMesh = new THREE.Mesh(pillowGeometry, sofaMaterial);
      pillowMesh.rotation.x = Math.PI / 2; // Lay it flat along the X-Z plane
      pillowMesh.position.set(-1.15 + i * 0.8, 0.4, -0.25); // Adjust position on Y-axis (height) and X-axis (horizontal)
      pillowMesh.castShadow = true; 
      pillowMesh.receiveShadow = true; 
      this.add(pillowMesh);
    }

    // 4. Armrests (BoxGeometry + Half Cylinder)
    const armrestWidth = 0.2;
    const armrestHeight = 0.6;
    const armrestDepth = 1;

    const armrestGeometry = new THREE.BoxGeometry(
      armrestWidth,
      armrestHeight,
      armrestDepth
    );
    const leftArmrest = new THREE.Mesh(armrestGeometry, sofaMaterial);
    const rightArmrest = new THREE.Mesh(armrestGeometry, sofaMaterial);

    // Positioning the armrests on Y-axis (height) and X-axis (sides)
    leftArmrest.position.set(-1.25, 0.3, 0); // Left armrest
    rightArmrest.position.set(1.25, 0.3, 0); // Right armrest
    this.add(leftArmrest);
    this.add(rightArmrest);

    // Armrest Half Cylinder (Top of the armrests)
    const halfCylinderGeometry = new THREE.CylinderGeometry(
      0.1,
      0.1,
      armrestDepth,
      32,
      1,
      false,
      0,
      Math.PI
    );

    const leftHalfCylinder = new THREE.Mesh(
      halfCylinderGeometry,
      sofaMaterial
    );
    const rightHalfCylinder = new THREE.Mesh(
      halfCylinderGeometry,
      sofaMaterial
    );

    // Rotate and position the half-cylinder (on top of the armrests)
    leftHalfCylinder.rotation.z = Math.PI / 2; // Rotate for the half-cylinder orientation
    leftHalfCylinder.rotation.y = Math.PI / 2; // Rotate for the half-cylinder orientation

    leftHalfCylinder.position.set(-1.25, 0.6, 0); // Place it on top of the left armrest (Y-axis for height)

    rightHalfCylinder.rotation.z = Math.PI / 2;
    rightHalfCylinder.rotation.y = Math.PI / 2;

    rightHalfCylinder.position.set(1.25, 0.6, 0); // Place it on top of the right armrest
    this.add(leftHalfCylinder);
    this.add(rightHalfCylinder);

    // 5. Add Three Spheres to the Backrest
    const sphereGeometry = new THREE.SphereGeometry(0.03, 32, 32); // Radius = 0.1, segments for smoothness
    for (let i = 0; i < 3; i++) {
      const sphereMesh = new THREE.Mesh(sphereGeometry, sofaMaterial);
      sphereMesh.position.set(-0.8 + i * 0.8, 0.8, - 0.3); // Adjust positions along X-axis
      sphereMesh.receiveShadow = true; 
      this.add(sphereMesh);
    }

    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;

    backrestMesh.castShadow = true;
    backrestMesh.receiveShadow = true;

    leftArmrest.castShadow = true;
    leftArmrest.receiveShadow = true;

    rightArmrest.castShadow = true;
    rightArmrest.receiveShadow = true;

    leftHalfCylinder.castShadow = true;
    leftHalfCylinder.receiveShadow = true;

    rightHalfCylinder.castShadow = true;
    rightHalfCylinder.receiveShadow = true;
  
        
  
  }
}

Sofa.prototype.isGroup = true;

export { Sofa };
