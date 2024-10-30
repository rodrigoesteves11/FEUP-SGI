import * as THREE from "three";
import { MyApp } from './MyApp.js';

/**
 * A TV is a 3D object that represents a photo of scene creator.
 */
class TV extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";
    
    const textureLoader = new THREE.TextureLoader();

    const tvMaterial = new THREE.MeshStandardMaterial({ color: 0x645187, side: THREE.DoubleSide });
    const tvMaterial2 = new THREE.MeshStandardMaterial({ color: 0x323e52, side: THREE.DoubleSide });

    //TV Base
    const geometryBase = new THREE.BoxGeometry(6, 0.7, 1);
    const base = new THREE.Mesh(geometryBase, tvMaterial);
    base.position.set(0, 0.35, 0);
    this.add(base);
    //TV Support
    const geometrySupport = new THREE.BoxGeometry(5.5, 0.3, 0.5);
    const support = new THREE.Mesh(geometrySupport, tvMaterial);
    support.position.set(0, 0.85, 0);
    this.add(support);
    //TV Frame
    //Top
    const geometryScreenTop = new THREE.BoxGeometry(5.8, 0.25, 0.7);
    const screenTop = new THREE.Mesh(geometryScreenTop, tvMaterial);
    screenTop.position.set(0, 3.875, 0);
    this.add(screenTop);
    //Bottom
    const geometryScreenBottom = new THREE.BoxGeometry(5.8, 0.25, 0.7);
    const screenBottom = new THREE.Mesh(geometryScreenBottom, tvMaterial);
    screenBottom.position.set(0, 1.125, 0);
    this.add(screenBottom);
    //Left
    const geometryScreenLeft = new THREE.BoxGeometry(0.25, 3, 0.7);
    const screenLeft = new THREE.Mesh(geometryScreenLeft, tvMaterial);
    screenLeft.position.set(-2.775, 2.5, 0);
    this.add(screenLeft);
    //Right
    const geometryScreenRight = new THREE.BoxGeometry(0.25, 3, 0.7);
    const screenRight = new THREE.Mesh(geometryScreenRight, tvMaterial);
    screenRight.position.set(2.775, 2.5, 0);
    this.add(screenRight);
    //TV BackPlate
    const geometryScreenBack = new THREE.PlaneGeometry(5.3, 2.5);
    const screenBack = new THREE.Mesh(geometryScreenBack, tvMaterial);
    screenBack.position.set(0, 2.5, 0.35);
    this.add(screenBack);
    //TV Screen
    const geometryScreen = new THREE.PlaneGeometry(5.3, 2.5);
    const screenMap = textureLoader.load("/sgi-t03-g03/tp1/textures/TV/tv2.jpg");
    const screenMaterial = new THREE.MeshStandardMaterial({ map: screenMap, side: THREE.DoubleSide });
    const screen= new THREE.Mesh(geometryScreen, screenMaterial);
    screen.rotation.y = Math.PI;
    screen.position.set(0, 2.5, -0.25);
    this.add(screen);

    //TV Inside Frames
    //Top
    const geometryInsideTop = new THREE.PlaneGeometry(5.3, 0.1);
    const insideTop = new THREE.Mesh(geometryInsideTop, tvMaterial2);
    insideTop.position.set(0, 3.749, -0.3);
    insideTop.rotation.x = Math.PI / 2;
    this.add(insideTop);
    //Bottom
    const geometryInsideBottom = new THREE.PlaneGeometry(5.3, 0.1);
    const insideBottom = new THREE.Mesh(geometryInsideBottom, tvMaterial2);
    insideBottom.position.set(0, 1.251, -0.3);
    insideBottom.rotation.x = Math.PI / 2;
    this.add(insideBottom);
    //Left
    const geometryInsideLeft = new THREE.PlaneGeometry(0.1, 2.5);
    const insideLeft = new THREE.Mesh(geometryInsideLeft, tvMaterial2);
    insideLeft.position.set(-2.649, 2.5, -0.3);
    insideLeft.rotation.y = Math.PI / 2;
    this.add(insideLeft);
    //Right
    const geometryInsideRight = new THREE.PlaneGeometry(0.1, 2.5);
    const insideRight = new THREE.Mesh(geometryInsideRight, tvMaterial2);
    insideRight.position.set(2.649, 2.5, -0.3);
    insideRight.rotation.y = Math.PI / 2;
    this.add(insideRight);

    //TV Details

    const tvDetailMaterial = new THREE.MeshStandardMaterial({ color: 0x3b88af, side: THREE.DoubleSide });

    const geometryDetail = new THREE.BoxGeometry(0.15, 0.25, 0.5);
    const positions = [
      [2.7, 0.35, -0.27],
      [2.54, 0.35, -0.27],
      [2.38, 0.35, -0.27],
      [2.22, 0.35, -0.27],
      [-2.7, 0.35, -0.27],
      [-2.54, 0.35, -0.27],
      [-2.38, 0.35, -0.27],
      [-2.22, 0.35, -0.27]
    ];
  
  
  positions.forEach(position => {
      const detail = new THREE.Mesh(geometryDetail, tvDetailMaterial);
      detail.position.set(...position);
      this.add(detail);
  });
    
  //TV BOX
  
  const tvBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x425472, side: THREE.DoubleSide }); 
  const geometryBox = new THREE.BoxGeometry(1.5, 0.3, 1);
  const box = new THREE.Mesh(geometryBox, tvBoxMaterial);
  box.position.set(1, 4.15, 0.05);
  this.add(box);

  //TV BOX Details

  const tvBoxDetailMaterial = new THREE.MeshStandardMaterial({ color: 0x336188, side: THREE.DoubleSide });
  const geometryBigDetail = new THREE.BoxGeometry(0.6, 0.05, 0.05);
  const bigDetail = new THREE.Mesh(geometryBigDetail, tvBoxDetailMaterial);
  bigDetail.position.set(1.3, 4.2, -0.44);
  this.add(bigDetail);

  const positions2 = [
    [1.56, 4.1, -0.44],//final
    [1.144, 4.1, -0.44],
    [1.248, 4.1, -0.44],
    [1.352, 4.1, -0.44],
    [1.456, 4.1, -0.44],
    [1.04, 4.1, -0.44],//inicial

  ];
  const geometryDetail2 = new THREE.BoxGeometry(0.08, 0.05, 0.05);

  positions2.forEach(position => {
    const detail = new THREE.Mesh(geometryDetail2, tvBoxDetailMaterial);
    detail.position.set(...position);
    this.add(detail);
  });

  //TV Volume Buttons
  const geometryButton = new THREE.CylinderGeometry(0.05, 0.05, 0.05, 32);
  const volumeButton = new THREE.Mesh(geometryButton, tvBoxDetailMaterial);
  volumeButton.position.set(0.5, 4.15, -0.44);
  volumeButton.rotation.x = Math.PI / 2;
  this.add(volumeButton);
  const volumeButton2 = new THREE.Mesh(geometryButton, tvBoxDetailMaterial);
  volumeButton2.position.set(0.7, 4.15, -0.44);
  volumeButton2.rotation.x = Math.PI / 2;
  this.add(volumeButton2);

  //TV Antenna Base
  const geometryAntennaBase = new THREE.SphereGeometry(0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const antennaBase = new THREE.Mesh(geometryAntennaBase, tvBoxDetailMaterial);
  antennaBase.position.set(1, 4.3, 0.05);
  this.add(antennaBase);

  //TV Antennas Stick (zigzag)
  
  // Criar o caminho sinuoso da antena
  const path = new THREE.CurvePath();
  path.add(new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.2, 0.3, 0),
      new THREE.Vector3(0.4, -0.3, 0),
      new THREE.Vector3(0.6, 0.1, 0)
  ));
 
  // Criar geometria de tubo ao longo do caminho
  const tubeGeometry = new THREE.TubeGeometry(path,10, 0.02, 8, false);
  const tube = new THREE.Mesh(tubeGeometry, tvBoxDetailMaterial);
  tube.position.set(1.2, 4.5, 0.05);
  tube.rotation.z = Math.PI / 4;
  this.add(tube);
  const tube2 = new THREE.Mesh(tubeGeometry, tvBoxDetailMaterial);
  tube2.position.set(0.8, 4.5, 0.05);
  tube2.rotation.y = -Math.PI;
  tube2.rotation.z = Math.PI / 4;
  this.add(tube2);

  //TV Antenna Ball
  const geometryAntennaBall = new THREE.SphereGeometry(0.05, 32, 32);
  const antennaBall = new THREE.Mesh(geometryAntennaBall, tvBoxDetailMaterial);
  antennaBall.position.set(0.45, 4.96, 0.05);
  this.add(antennaBall);
  const antennaBall2 = new THREE.Mesh(geometryAntennaBall, tvBoxDetailMaterial);
  antennaBall2.position.set(1.55, 4.96, 0.05);
  this.add(antennaBall2);




  }
}

TV.prototype.isGroup = true;

export { TV };
