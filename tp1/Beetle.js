import * as THREE from "three";
import { MyApp } from './MyApp.js';

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

    const corkMaterial = new THREE.MeshStandardMaterial({
      map: corkbasediffuseMap, 
      normalMap: corknormalMapTexture, 
      roughnessMap: corkroughnessMapTexture,
      aoMap: corkambientOcclusionTexture, 
      displacementMap: corkheightMapTexture, 
      displacementScale: 0,
    });
    

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
      linewidth: 5 // Aumenta a grossura da linha
    });

    const curve = new THREE.CubicBezierCurve(
      new THREE.Vector3( -0.3, 0, 0),
      new THREE.Vector3( -0.25, 0.5, 0 ),
      new THREE.Vector3( 0.25, 0.5, 0 ),
      new THREE.Vector3( 0.3, 0, 0)
    );
    
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material );
    curveObject.position.set(0, 0.5, 0.5);
    curveObject.rotation.y = Math.PI / 2;
    this.add(curveObject);
    const curveObject2 = new THREE.Line( geometry, material );
    curveObject2.position.set(0, 0.5, -0.5);
    curveObject2.rotation.y = Math.PI / 2;
    this.add(curveObject2);

    const curve2 = new THREE.CubicBezierCurve(
      new THREE.Vector3( -0.3, 0, 0),
      new THREE.Vector3( -0.2, 0.5, 0 ),
      new THREE.Vector3( -0.05, 0.9, 0 ),
      new THREE.Vector3( 0.5, 0.9, 0)
    );    
    const points2 = curve2.getPoints( 50 );
    const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
    const curveObject3 = new THREE.Line( geometry2, material );
    curveObject3.position.set(0, 0.5, 0.5);
    curveObject3.rotation.y = Math.PI / 2;
    this.add(curveObject3);

    const curve3 = new THREE.QuadraticBezierCurve(
      new THREE.Vector3( 0.3, 0, 0),
      new THREE.Vector3( 0.3, 0.6, 0 ),
      new THREE.Vector3( -0.1, 0.5, 0)
    );
    const points3 = curve3.getPoints( 50 );
    const geometry3 = new THREE.BufferGeometry().setFromPoints( points3 );
    const curveObject4 = new THREE.Line( geometry3, material );
    curveObject4.position.set(0, 0.5, -0.5);
    curveObject4.rotation.y = Math.PI / 2;
    this.add(curveObject4);
    
    const curve4 = new THREE.QuadraticBezierCurve(
      new THREE.Vector3( -0.1, 0.5, 0),
      new THREE.Vector3( -0.2, 0.8, 0),
      new THREE.Vector3( -0.5, 0.9, 0),
    );
    const points4 = curve4.getPoints( 50 );
    const geometry4 = new THREE.BufferGeometry().setFromPoints( points4 );
    const curveObject5 = new THREE.Line( geometry4, material );
    curveObject5.position.set(0, 0.5, -0.5);
    curveObject5.rotation.y = Math.PI / 2;
    this.add(curveObject5);

    
    

  }
}

Beetle.prototype.isGroup = true;

export { Beetle };
