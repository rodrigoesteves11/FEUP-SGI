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

    
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xc48b11,
    });
    // const backframeMaterial = new THREE.MeshStandardMaterial({
    //   color: 0xffffff,
    // });

    const textureLoader = new THREE.TextureLoader();
    const backframeMap = textureLoader.load("textures/road/istockphoto-1272388577-612x612.jpg");
    const backframeMaterial = new THREE.MeshBasicMaterial({ map: backframeMap });

    const tbwidth = 3;
    const lrwidth = 2;

    const frameGeometryTB = new THREE.BoxGeometry(tbwidth + 0.1, 0.1, 0.1);
    const frameGeometryLR = new THREE.BoxGeometry(lrwidth, 0.1, 0.1);

    //left side
    const leftside = new THREE.Mesh(frameGeometryLR, frameMaterial);
    leftside.position.set( tbwidth/2, 1,0);
    leftside.rotation.z = Math.PI/2 ;
    this.add(leftside);
    //right side
    const rightside = new THREE.Mesh(frameGeometryLR, frameMaterial);
    rightside.position.set(-tbwidth/2, 1,0 );
    rightside.rotation.z = Math.PI / 2;
    this.add(rightside);
    //top side
    const topside = new THREE.Mesh(frameGeometryTB, frameMaterial);
    topside.position.set(0, 2, 0);
    topside.rotation.z = Math.PI ;
    this.add(topside);
    //bottom side
    const bottomside = new THREE.Mesh(frameGeometryTB, frameMaterial);
    bottomside.position.set(0, 0, 0);
    bottomside.rotation.z = Math.PI;
    this.add(bottomside);

    //back frame plane
    const backframeGeometry = new THREE.PlaneGeometry(tbwidth, lrwidth);
    backframeMaterial.map.offset.set(0, -0.05); // Move a textura para baixo
    backframeMaterial.map.needsUpdate = true;
    const backframe = new THREE.Mesh(backframeGeometry, backframeMaterial);
    backframe.position.set(0, 1, 0);
    backframe.rotation.z = 2*Math.PI ;
    this.add(backframe);


    const tubeRadius = 0.02; 
    const tubeSegments = 20;


    //beetle body
    const neonColor = 0x000000;

    
    const material = new THREE.MeshStandardMaterial({
      emissive: neonColor, // Cor emissiva para o efeito neon
      emissiveIntensity: 10, // Intensidade do brilho
      color: 0xffffff, // Cor base
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
    curveTubeObject.position.set(0.7, 0.2, 0); 
    curveTubeObject.rotation.z = 2*Math.PI ;
    this.add(curveTubeObject);
    const curveTubeObject2 = new THREE.Mesh(curveTubeGeometry, material);
    curveTubeObject2.position.set(-0.7, 0.2,0 );
    curveTubeObject2.rotation.z = 2*Math.PI ;
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
    curveTubeObject3.position.set(0, 0.2, 0);
    curveTubeObject3.rotation.z = Math.PI / 2 ;
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
    curveTubeObject4.position.set(0, 0.75, 0);
    curveTubeObject4.rotation.z = 2*Math.PI ;
    this.add(curveTubeObject4);

    const curveTubeObject5 = new THREE.Mesh(curveTubeGeometry3, material);
    curveTubeObject5.position.set(0.55, 0.2, 0);
    curveTubeObject5.rotation.z = 2*Math.PI ;
    this.add(curveTubeObject5);
    
    //nail
    const nailGeometry = new THREE.CylinderGeometry(0.03, 0.02, 0.2, 32);
    const nail = new THREE.Mesh(nailGeometry, material);
    nail.rotation.x = Math.PI / 2;
    nail.position.set(0, 2.44, 0);
    this.add(nail);

    //strings
    const stringGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1.57, 32);
    const string = new THREE.Mesh(stringGeometry, material);
    string.rotation.z = -1.3 ;
    string.position.set(-0.7, 2.25, 0);
    this.add(string);

    const string2 = new THREE.Mesh(stringGeometry, material);
    string2.rotation.z = 1.3 ;
    string2.position.set(0.7, 2.25, 0);
    this.add(string2);
    



    


  }
}

Beetle.prototype.isGroup = true;

export { Beetle };
