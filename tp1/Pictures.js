import * as THREE from "three";
import { MyApp } from './MyApp.js';

/**
 * A Pictures is a 3D object that represents a photo of scene creator.
 */
class Pictures extends THREE.Object3D {
  constructor(app, texture) {
    super();
    this.app = app;
    this.type = "Group";
    this.texturespath = texture;
    const textureLoader = new THREE.TextureLoader();

    const texturePhoto = textureLoader.load(this.texturespath);

    const materialBase = new THREE.MeshStandardMaterial({ color: 0x57c3ba, side: THREE.DoubleSide });
    const materialBase2 = new THREE.MeshStandardMaterial({ color: 0xfffa2b, side: THREE.DoubleSide });

    const materialPhoto = new THREE.MeshStandardMaterial({
      map: texturePhoto,
    });

    // Picture Frame
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0xc48b11,
    });
    

    const tbwidth = 2;
    const lrwidth = 2;

    const frameGeometryTB = new THREE.BoxGeometry(0.1, 0.1, tbwidth + 0.1);
    const frameGeometryLR = new THREE.BoxGeometry(lrwidth, 0.1, 0.1);

    //left side
    const leftside = new THREE.Mesh(frameGeometryLR, frameMaterial);
    leftside.position.set( 0, 1,tbwidth/2);
    leftside.rotation.z = Math.PI/2 ;
    this.add(leftside);
    //right side
    const rightside = new THREE.Mesh(frameGeometryLR, frameMaterial);
    rightside.position.set(0, 1,-tbwidth/2 );
    rightside.rotation.z = Math.PI/2;
    this.add(rightside);
    //top side
    const topside = new THREE.Mesh(frameGeometryTB, frameMaterial);
    topside.rotation.z = Math.PI;
    topside.position.set(0, 2, 0);
    this.add(topside);
    //bottom side
    const bottomside = new THREE.Mesh(frameGeometryTB, frameMaterial);
    bottomside.position.set(0, 0, 0);
    bottomside.rotation.x = Math.PI;
    this.add(bottomside);

    //back frame plane
    const backframeGeometry = new THREE.PlaneGeometry(tbwidth, lrwidth);
    const backframe = new THREE.Mesh(backframeGeometry, materialPhoto);
    backframe.position.set(0, 1, 0);
    backframe.rotation.y = -Math.PI/2 ;
    this.add(backframe);
   
  }
}

Pictures.prototype.isGroup = true;

export { Pictures };

//NOTA O QUADRO DEVE SER OVAL E NÃO RETANGULAR