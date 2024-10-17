import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/**
 * A Cabinet is a 3D object that represents a cabinet.
 */
class Beetle extends THREE.Object3D {
  /**
    
     */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

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

    const corkambientOcclusionTexture = textureLoader.load(
      "./textures/cork/Cork_002_OCC.jpg"
    );
    const corkbasediffuseMap = textureLoader.load(
      "./textures/cork/Cork_002_COLOR.jpg"
    );
    const corknormalMapTexture = textureLoader.load(
      "./textures/cork/Cork_002_NORM.jpg"
    );
    const corkroughnessMapTexture = textureLoader.load(
      "./textures/cork/Cork_002_ROUGH.jpg"
    );
    const corkheightMapTexture = textureLoader.load(
      "./textures/cork/Cork_002_DISP.png"
    );
    const corkMaterial = new THREE.MeshBasicMaterial({
      map: corkbasediffuseMap,
    });
    
    
    // MeshStandardMaterial({
    //   map: corkbasediffuseMap,
    //   normalMap: corknormalMapTexture,
    //   roughnessMap: corkroughnessMapTexture,
    //   aoMap: corkambientOcclusionTexture,
    //   displacementMap: corkheightMapTexture,
    //   displacementScale: 0,
    //   roughness: 1, // Máxima rugosidade para eliminar reflexos
    //   metalness: 0, // Sem metalicidade (sem brilho metálico)
    //   reflectivity: 0, // Sem reflexão
    // });

    corkbasediffuseMap.wrapS = THREE.RepeatWrapping;
    corkbasediffuseMap.wrapT = THREE.RepeatWrapping;
    corkbasediffuseMap.repeat.set(2, 2);

    corknormalMapTexture.wrapS = THREE.RepeatWrapping;
    corknormalMapTexture.wrapT = THREE.RepeatWrapping;
    corknormalMapTexture.repeat.set(2, 2);

    const frameGeometryTB = new THREE.BoxGeometry(4 + 0.1, 0.1, 0.1);
    const frameGeometryLR = new THREE.BoxGeometry(2, 0.1, 0.1);

    //left side
    const leftside = new THREE.Mesh(frameGeometryLR, darkwoodMaterial);
    leftside.position.set(0, 1, 2);
    leftside.rotation.z = Math.PI / 2;
    this.add(leftside);
    //right side
    const rightside = new THREE.Mesh(frameGeometryLR, darkwoodMaterial);
    rightside.position.set(0, 1, -2);
    rightside.rotation.z = Math.PI / 2;
    this.add(rightside);
    //top side
    const topside = new THREE.Mesh(frameGeometryTB, darkwoodMaterial);
    topside.position.set(0, 2, 0);
    topside.rotation.y = Math.PI / 2;
    this.add(topside);
    //bottom side
    const bottomside = new THREE.Mesh(frameGeometryTB, darkwoodMaterial);
    bottomside.position.set(0, 0, 0);
    bottomside.rotation.y = Math.PI / 2;
    this.add(bottomside);

    //back frame plane
    const backframeGeometry = new THREE.PlaneGeometry(4, 2);
    const backframe = new THREE.Mesh(backframeGeometry, corkMaterial);
    backframe.position.set(0, 1, 0);
    backframe.rotation.y = Math.PI / 2;
    this.add(backframe);

    //beetle body

    const material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 5, // Aumenta a grossura da linha
    });

    //semi-circle r and h
    const r = 0.4;
    const h = (4 / 3) * r;

    //Wheel points
    const p0 = new THREE.Vector2(-r, 0);
    const p1 = new THREE.Vector2(-r, h);
    const p2 = new THREE.Vector3(r, h);
    const p3 = new THREE.Vector3(r, 0);
    const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);

    const points = curve.getPoints(50); // 50 pontos para criar uma curva suave
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create the final object to add to the scene
    const curveObject = new THREE.Line(geometry, material);
    curveObject.position.set(0, 0.5, 0.7);
    curveObject.rotation.y = Math.PI / 2;
    this.add(curveObject);
    const curveObject2 = new THREE.Line(geometry, material);
    curveObject2.position.set(0, 0.5, -0.7);
    curveObject2.rotation.y = Math.PI / 2;
    this.add(curveObject2);

    // 1/4 circle
    const r2 = 1.1;
    const h2 = (4 / 3) * (Math.sqrt(2) - 1) * r2;

    const curve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector2(0, r2),
      new THREE.Vector2(h2, r2),
      new THREE.Vector2(r2, h2),
      new THREE.Vector2(r2, 0)
    );
    const points2 = curve2.getPoints(50);
    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    const curveObject3 = new THREE.Line(geometry2, material);
    curveObject3.position.set(0, 0.5, 0);
    curveObject3.rotation.y = Math.PI / 2;
    curveObject3.rotation.x = Math.PI / 2;
    this.add(curveObject3);

    // 1/4 circle small
    const r3 = 0.55;
    const h3 = (4 / 3) * (Math.sqrt(2) - 1) * r3;

    const curve3 = new THREE.CubicBezierCurve3(
      new THREE.Vector2(0, r3),
      new THREE.Vector2(h3, r3),
      new THREE.Vector2(r3, h3),
      new THREE.Vector2(r3, 0)
    );
    const points3 = curve3.getPoints(50);
    const geometry3 = new THREE.BufferGeometry().setFromPoints(points3);

    const curveobject4 = new THREE.Line(geometry3, material);
    curveobject4.position.set(0, 1.05, 0);
    curveobject4.rotation.y = Math.PI / 2;
    this.add(curveobject4);

    const curveObject5 = new THREE.Line(geometry3, material);
    curveObject5.position.set(0, 0.5, -0.55);
    curveObject5.rotation.y = Math.PI / 2;
    this.add(curveObject5);
  }
}

Beetle.prototype.isGroup = true;

export { Beetle };
