import * as THREE from "three";
import { MyApp } from './MyApp.js';

/**
 * A Cabinet is a 3D object that represents a cabinet.
 */
class Lamp extends THREE.Object3D {
  /**
    
     */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    const textureLoader = new THREE.TextureLoader();

    //Lamp Base "Torus"
    const geometryBase = new THREE.TorusGeometry(0.28, 0.07, 16, 100);
    const materialBase = new THREE.MeshPhongMaterial({ color: 0xb85527 });
    const base = new THREE.Mesh(geometryBase, materialBase);
    base.rotation.x = Math.PI / 2;
    base.position.set(0, -0.05, 0);
    this.add(base);

    //Lamp Mid Body "Cylinder"
    const geometryMid = new THREE.CylinderGeometry(0.27, 0.3, 1.3, 32);
    const mid = new THREE.Mesh(geometryMid, materialBase);
    mid.position.set(0, 0, 0);
    this.add(mid);

    //Lamp Top Body "1/2 Sphere"
    const geometryTop = new THREE.SphereGeometry(0.27, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const materialTop = new THREE.MeshPhongMaterial({ color: 0x669042 });
    const top = new THREE.Mesh(geometryTop, materialTop);
    top.position.set(0, 0.65, 0);
    this.add(top);

    //Lamp Pole "Cylinder"
    const geometryPole = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
    const materialPole = new THREE.MeshPhongMaterial({ color: 0x8397cc });
    const pole = new THREE.Mesh(geometryPole, materialPole);
    pole.position.set(0, 0.75, 0);
    this.add(pole);

    //Lamp Shade "2 Torus top (bigger) and bottom (smaller) and Cylinder Opened"
    const geometryShadeTop = new THREE.TorusGeometry(0.25, 0.04, 16, 100);
    const geometryShadeBottom = new THREE.TorusGeometry(0.43, 0.04, 16, 100);
    const geometryShadeMid = new THREE.CylinderGeometry(0.27, 0.45, 0.765, 64, 1, true);
    const materialShade = new THREE.MeshPhongMaterial({ color: 0xb361a6, side: THREE.DoubleSide });
    const shadeTop = new THREE.Mesh(geometryShadeTop, materialShade);
    shadeTop.rotation.x = Math.PI / 2;
    shadeTop.position.set(0, 1.85, 0);
    this.add(shadeTop);
    const shadeBottom = new THREE.Mesh(geometryShadeBottom, materialShade);
    shadeBottom.rotation.x = Math.PI / 2;
    shadeBottom.position.set(0, 1.15, 0);
    this.add(shadeBottom);
    const shadeMid = new THREE.Mesh(geometryShadeMid, materialShade);
    shadeMid.position.set(0, 1.5, 0);
    this.add(shadeMid);




  }
}

Lamp.prototype.isGroup = true;

export { Lamp };
