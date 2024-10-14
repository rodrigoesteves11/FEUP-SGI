import * as THREE from "three";
import { MyApp } from './MyApp.js';

/**
 * A Cabinet is a 3D object that represents a cabinet.
 */
class Cabinet extends THREE.Object3D {
  /**
    
     */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";
    this.gap = 0.03;
    const textureLoader = new THREE.TextureLoader();

    const darkwoodambientOcclusionTexture = textureLoader.load(
        "./textures/dark-wood/Wood_011_ambientOcclusion.jpg"
      );
      const darkwoodbaseColorTexture = textureLoader.load(
        "./textures/dark-wood/Wood_011_basecolor.jpg"
      );
      const darkwoodnormalMapTexture = textureLoader.load(
        "./textures/dark-wood/Wood_011_normal.jpg"
      );
      const darkwoodroughnessMapTexture = textureLoader.load(
        "./textures/dark-wood/Wood_011_roughness.jpg"
      );
      const darkwoodheightMapTexture = textureLoader.load(
        "./textures/dark-wood/Wood_011_height.png"
      );
  
      const darkwoodMaterial = new THREE.MeshStandardMaterial({
        map: darkwoodbaseColorTexture,
        aoMap: darkwoodambientOcclusionTexture,
        normalMap: darkwoodnormalMapTexture,
        roughnessMap: darkwoodroughnessMapTexture,
        displacementMap: darkwoodheightMapTexture,
        displacementScale: 0,
      });

    const plywoodambientOcclusionTexture = textureLoader.load(
      "./textures/plywood/Wood_Plywood_Front_001_ambientOcclusion.jpg"
    );
    const plywoodbaseColorTexture = textureLoader.load(
      "./textures/plywood/Wood_Plywood_Front_001_basecolor.jpg"
    );
    const plywoodnormalMapTexture = textureLoader.load(
      "./textures/plywood/Wood_Plywood_Front_001_normal.jpg"
    );
    const plywoodroughnessMapTexture = textureLoader.load(
      "./textures/plywood/Wood_Plywood_Front_001_roughness.jpg"
    );
    const plywoodheightMapTexture = textureLoader.load(
      "./textures/plywood/Wood_Plywood_Front_001_height.png"
    );

    const plywoodMaterial = new THREE.MeshStandardMaterial({
      map: plywoodbaseColorTexture,
      aoMap: plywoodambientOcclusionTexture,
      normalMap: plywoodnormalMapTexture,
      roughnessMap: plywoodroughnessMapTexture,
      displacementMap: plywoodheightMapTexture,
      displacementScale: 0,
    });

    // Cabinet Box Geometry
    this.baseHeight = 2;
    this.baseWidth = 4;
    this.baseDepth = 2;
    
    // Cylinder Geometry
    this.topCylinderBase = 0.1;
    this.botCylinderBase = 0.03;
    this.cylinderHeight = 0.8;
    this.cylinderGap = 0.6;



    const baseGeometry = new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth);
    const transparentMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0,
        });
    const base = new THREE.Mesh(baseGeometry, transparentMaterial);
    this.add(base);
    

    const SideBaseGeometry = new THREE.BoxGeometry(this.baseWidth / 2 - this.gap , this.baseHeight, this.baseDepth);
    const leftSideBase = new THREE.Mesh(SideBaseGeometry, plywoodMaterial);
    leftSideBase.position.set(-this.baseHeight / 2, 0, 0);
    this.add(leftSideBase);

    const rightSideBase = new THREE.Mesh(SideBaseGeometry, plywoodMaterial);
    rightSideBase.position.set(this.baseHeight / 2, 0, 0);
    this.add(rightSideBase);
    
    const middleBaseGeometry = new THREE.BoxGeometry(this.gap, this.baseHeight, 2 - 0.05);
    const middleBase = new THREE.Mesh(middleBaseGeometry, plywoodMaterial);
    middleBase.position.set(0, 0, -0.05 / 2);
    this.add(middleBase);

    const middleFrontPanelGeometry = new THREE.PlaneGeometry(this.gap, this.baseHeight);
    const middleFrontPanel = new THREE.Mesh(middleFrontPanelGeometry, darkwoodMaterial);
    middleFrontPanel.position.set(0, 0, (2 - 0.05) / 2 - 0.05 / 2 + 0.001 );
    this.add(middleFrontPanel);

    
    



    const edges = new THREE.EdgesGeometry(baseGeometry);
    const edgePositions = edges.attributes.position.array;

    const createEdgeWithBox = (start, end, thickness) => {
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length(); 

      const edgeGeometry = new THREE.BoxGeometry(thickness, thickness, length + 0.15);
      const edge = new THREE.Mesh(edgeGeometry, darkwoodMaterial);

      edge.position.copy(start).add(direction.multiplyScalar(0.5));
      
      edge.lookAt(end);
      
      this.add(edge);
    };

    for (let i = 0; i < edgePositions.length; i += 6) {
      const start = new THREE.Vector3(
        edgePositions[i],
        edgePositions[i + 1],
        edgePositions[i + 2]
      );
      const end = new THREE.Vector3(
        edgePositions[i + 3],
        edgePositions[i + 4],
        edgePositions[i + 5]
      );
      createEdgeWithBox(start, end, 0.15);
    }

    const knob = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.15), darkwoodMaterial);
    knob.position.set(0.5, 0, 1);
    const knob2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.15), darkwoodMaterial);
    knob2.position.set(-0.5, 0, 1);
    this.add(knob2);
    this.add(knob);

    
    


    const legsGeometry = new THREE.CylinderGeometry(this.topCylinderBase, this.botCylinderBase, this.cylinderHeight, 64);
    const leg1 = new THREE.Mesh(legsGeometry, darkwoodMaterial);
    leg1.position.set(this.baseWidth / 2 - this.cylinderGap / 2, (-this.baseHeight / 2 - this.cylinderHeight / 2) + 0.1, this.baseDepth / 2 - this.cylinderGap / 2);
    leg1.rotation.z = Math.PI / 6;
    this.add(leg1);

    const leg2 = new THREE.Mesh(legsGeometry, darkwoodMaterial);
    leg2.position.set(-this.baseWidth / 2 + this.cylinderGap / 2, (-this.baseHeight / 2 - this.cylinderHeight / 2) + 0.1, this.baseDepth / 2 - this.cylinderGap / 2);
    leg2.rotation.z = - Math.PI / 6;
    this.add(leg2);

    const leg3 = new THREE.Mesh(legsGeometry, darkwoodMaterial);
    leg3.position.set(this.baseWidth / 2 - this.cylinderGap / 2, (-this.baseHeight / 2 - this.cylinderHeight / 2) + 0.1, -this.baseDepth / 2 + this.cylinderGap / 2);
    leg3.rotation.z = Math.PI / 6;
    this.add(leg3);

    const leg4 = new THREE.Mesh(legsGeometry, darkwoodMaterial);
    leg4.position.set(-this.baseWidth / 2 + this.cylinderGap / 2, (-this.baseHeight / 2 - this.cylinderHeight / 2) + 0.1, -this.baseDepth / 2 + this.cylinderGap / 2);
    leg4.rotation.z = - Math.PI / 6;
    this.add(leg4);



  }
}

Cabinet.prototype.isGroup = true;

export { Cabinet };
