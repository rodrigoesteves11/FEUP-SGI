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


    const tubeRadius = 0.02; 
    const tubeSegments = 20;


    //beetle body
    const neonColor = 0x000000;

    
    const material = new THREE.MeshStandardMaterial({
      emissive: neonColor, // Cor emissiva para o efeito neon
      emissiveIntensity: 10, // Intensidade do brilho
      color: 0x000000, // Cor base
      roughness: 0.3, // Tornar a superfície um pouco suave
      metalness: 1, // Pode ajustar a quantidade de brilho metálico
      side : THREE.DoubleSide,
    });

    //semi-circle r and h
    const r = 0.4;
    const h = (4 / 3) * r;

    //Wheel points
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-r, 0,0),
      new THREE.Vector3(-r, h,0),
      new THREE.Vector3(r, h,0),
      new THREE.Vector3(r, 0,0)
    );

    const curveTubeGeometry = new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, 8, false);
    const curveTubeObject = new THREE.Mesh(curveTubeGeometry, material);
    curveTubeObject.position.set(0, 0.5, 0.7); 
    curveTubeObject.rotation.y = Math.PI / 2;
    this.add(curveTubeObject);
    const curveTubeObject2 = new THREE.Mesh(curveTubeGeometry, material);
    curveTubeObject2.position.set(0, 0.5, -0.7);
    curveTubeObject2.rotation.y = Math.PI / 2;
    this.add(curveTubeObject2);
    
    // 1/4 circle
    const r2 = 1.1;
    const h2 = (4 / 3) * (Math.sqrt(2) - 1) * r2;

    const curve2 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, r2, 0),
      new THREE.Vector3(h2, r2, 0),
      new THREE.Vector3(r2, h2, 0),
      new THREE.Vector3(r2, 0, 0)
    );
    
    const curveTubeGeometry2 = new THREE.TubeGeometry(curve2, tubeSegments, tubeRadius, 8, false);
    const curveTubeObject3 = new THREE.Mesh(curveTubeGeometry2, material);
    curveTubeObject3.position.set(0, 0.5, 0);
    curveTubeObject3.rotation.y = Math.PI / 2;
    curveTubeObject3.rotation.x = Math.PI / 2;
    this.add(curveTubeObject3);

    // 1/4 circle small
    const r3 = 0.55;
    const h3 = (4 / 3) * (Math.sqrt(2) - 1) * r3;

    const curve3 = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, r3,0),
      new THREE.Vector3(h3, r3,0),
      new THREE.Vector3(r3, h3,0),
      new THREE.Vector3(r3, 0,0)
    );
    
    const curveTubeGeometry3 = new THREE.TubeGeometry(curve3, tubeSegments, tubeRadius, 8, false);
    const curveTubeObject4 = new THREE.Mesh(curveTubeGeometry3, material);
    curveTubeObject4.position.set(0, 1.05, 0);
    curveTubeObject4.rotation.y = Math.PI / 2;
    this.add(curveTubeObject4);

    const curveTubeObject5 = new THREE.Mesh(curveTubeGeometry3, material);
    curveTubeObject5.position.set(0, 0.5, -0.55);
    curveTubeObject5.rotation.y = Math.PI / 2;
    this.add(curveTubeObject5);
  
  }
}

Beetle.prototype.isGroup = true;

export { Beetle };
