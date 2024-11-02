import * as THREE from "three";
import { MyApp } from './MyApp.js';

/**
 * A Telephone is a 3D object that represents a telephone.
 */
class Telephone extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    const textureLoader = new THREE.TextureLoader();

    const materialBase = new THREE.MeshStandardMaterial({ color: 0x57c3ba, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.9 });

    // Telephone Base
    const geometryBase = new THREE.BoxGeometry(0.8, 0.2, 1);
    const base = new THREE.Mesh(geometryBase, materialBase);
    base.position.set(0, 0, 0);
    this.add(base);

    // Telephone Body pyramid
    const vertices = new Float32Array([
      0, 0, 0.6,  // Vértice A
      0, 0, 0,    // Vértice B
      0, 0.3, 0   // Vértice C
    ]);

    const geometryTriangle = new THREE.BufferGeometry();
    geometryTriangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    geometryTriangle.computeVertexNormals(); 

    const triangleMesh = new THREE.Mesh(geometryTriangle, materialBase);
    triangleMesh.position.set(0.4, 0.1, -0.1);
    this.add(triangleMesh);

    const triangleMesh2 = new THREE.Mesh(geometryTriangle, materialBase);
    triangleMesh2.position.set(-0.4, 0.1, -0.1);
    this.add(triangleMesh2);

    // Plane for telephone body
    const geometryPlane = new THREE.PlaneGeometry(0.8, 0.67);
    const plane = new THREE.Mesh(geometryPlane, materialBase);
    plane.position.set(0, 0.25, 0.2);
    plane.rotation.x = -THREE.MathUtils.degToRad(63.43);
    this.add(plane);

    // Telephone Body Box
    const geometryBody = new THREE.BoxGeometry(0.8, 0.3, 0.4);
    const body = new THREE.Mesh(geometryBody, materialBase);
    body.position.set(0, 0.25, -0.3);
    this.add(body);

    // Telephone Handset
    const geometryPhone = new THREE.CylinderGeometry(0, 0.17, 0.3, 32);
    const phone = new THREE.Mesh(geometryPhone, materialBase);
    phone.position.set(-0.6, 0.447, -0.3);
    this.add(phone);

    const phone2 = new THREE.Mesh(geometryPhone, materialBase);
    phone2.position.set(0.6, 0.447, -0.3);
    this.add(phone2);

    const geometryPhoneBody = new THREE.CylinderGeometry(0.1, 0.1, 1.3, 32);
    const phoneBody = new THREE.Mesh(geometryPhoneBody, materialBase);
    phoneBody.position.set(0, 0.5, -0.3);
    phoneBody.rotation.z = Math.PI / 2;
    this.add(phoneBody);

    // Cubes for telephone buttons
    const geometryCube = new THREE.BoxGeometry(0.12, 0.12, 0.1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, metalness: 0, roughness: 1 });

    const positions = [
      [0.15, 0.31, 0.05], [0, 0.31, 0.05], [-0.15, 0.31, 0.05],
      [0.15, 0.235, 0.2], [0, 0.235, 0.2], [-0.15, 0.235, 0.2],
      [0.15, 0.16, 0.35], [0, 0.16, 0.35], [-0.15, 0.16, 0.35]
    ];

    positions.forEach(pos => {
      const cube = new THREE.Mesh(geometryCube, cubeMaterial);
      cube.rotation.x = -THREE.MathUtils.degToRad(63.43);
      cube.position.set(...pos);
      this.add(cube);
    });
  }
}

Telephone.prototype.isGroup = true;

export { Telephone };
