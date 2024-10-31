import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { Cabinet } from "./Cabinet.js";
import { Lamp } from "./Lamp.js";
import { Beetle } from "./Beetle.js";
import { Table } from "./Table.js";
import { Spring } from "./Spring.js";
import { Sofa } from "./Sofa.js";
import { Rug } from "./Rug.js";
import { Telephone } from "./Telephone.js";
import { Pictures } from "./Pictures.js";
import { TV } from "./TV.js";
import { TallLamp } from "./TallLamp.js";
import { Donut } from "./Donut.js";
import { Curtains } from "./Curtains.js";
import { Flowers } from "./Flowers.js";


/**
 *  This class contains the contents of out application
 */
class MyContents {
  /**
       constructs the object
       @param {MyApp} app The application object
    */
  constructor(app) {
    this.app = app;
    this.axis = null;

    // wall related attributes
    this.wallHeight = 10;

    //floor related attributes
    this.floorWidth = 18;
    this.floorWidth2 = 22;
  }

  /*
   * Create a Plane Mesh
   */
  buildWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf8a2ac });

    // Define wall geometry sizes
    const wallGeometry = new THREE.PlaneGeometry(
      this.floorWidth,
      this.wallHeight
    );
    const wallGeometry2 = new THREE.PlaneGeometry(
      this.floorWidth2,
      this.wallHeight
    );

    const addWall = (position, rotationY = 0, wallGeometry) => {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(position.x, position.y, position.z);
      wall.rotation.y = rotationY;
      this.app.scene.add(wall);
    };

    // Function to create a wall with a window hole and a half-sphere outside
    const createWallWithWindow = (
      position,
      rotationY,
      width,
      height,
      windowWidth,
      windowHeight,
      windowOffsetY
    ) => {
      // Wall shape with window hole
      const shape = new THREE.Shape();
      shape.moveTo(-width / 2, height / 2);
      shape.lineTo(width / 2, height / 2);
      shape.lineTo(width / 2, -height / 2);
      shape.lineTo(-width / 2, -height / 2);
      shape.lineTo(-width / 2, height / 2);

      const hole = new THREE.Path();
      const windowX = windowWidth / 2;
      const windowY = windowHeight / 2;
      hole.moveTo(-windowX, windowOffsetY + windowY);
      hole.lineTo(windowX, windowOffsetY + windowY);
      hole.lineTo(windowX, windowOffsetY - windowY);
      hole.lineTo(-windowX, windowOffsetY - windowY);
      hole.lineTo(-windowX, windowOffsetY + windowY);
      shape.holes.push(hole);

      const wallGeometryWithWindow = new THREE.ShapeGeometry(shape);
      const wall = new THREE.Mesh(wallGeometryWithWindow, wallMaterial);
      wall.position.set(position.x, position.y, position.z);
      wall.rotation.y = rotationY;
      this.app.scene.add(wall);

      // Glass pane
      const glassGeometry = new THREE.PlaneGeometry(windowWidth, windowHeight);
      const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.25,
        roughness: 0,
        metalness: 0,
      });
      const glassPane = new THREE.Mesh(glassGeometry, glassMaterial);
      glassPane.position.set(
        position.x,
        position.y + windowOffsetY,
        position.z + 0.01
      );
      glassPane.rotation.y = rotationY;
      this.app.scene.add(glassPane);

      // Brown frame material
      const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

      // Frame thickness and depth
      const frameThickness = 0.2;
      const frameDepth = 0.2;

      // Top frame
      const topFrame = new THREE.Mesh(
        new THREE.BoxGeometry(
          windowWidth + frameThickness * 2,
          frameThickness,
          frameDepth
        ),
        frameMaterial
      );
      topFrame.position.set(
        position.x,
        position.y + windowOffsetY + windowY + frameThickness / 2,
        position.z + frameDepth / 2
      );
      topFrame.rotation.y = rotationY;
      this.app.scene.add(topFrame);

      // Bottom frame
      const bottomFrame = new THREE.Mesh(
        new THREE.BoxGeometry(
          windowWidth + frameThickness * 2,
          frameThickness,
          frameDepth
        ),
        frameMaterial
      );
      bottomFrame.position.set(
        position.x,
        position.y + windowOffsetY - windowY - frameThickness / 2,
        position.z + frameDepth / 2
      );
      bottomFrame.rotation.y = rotationY;
      this.app.scene.add(bottomFrame);

      // Left frame
      const leftFrame = new THREE.Mesh(
        new THREE.BoxGeometry(
          frameThickness,
          windowHeight + frameThickness,
          frameDepth
        ),
        frameMaterial
      );
      leftFrame.position.set(
        position.x + windowX - windowWidth / 2,
        position.y + windowOffsetY,
        position.z + frameDepth / 2 - windowWidth / 2
      );
      leftFrame.rotation.y = rotationY;
      this.app.scene.add(leftFrame);

      // Right frame
      const rightFrame = new THREE.Mesh(
        new THREE.BoxGeometry(
          frameThickness,
          windowHeight + frameThickness,
          frameDepth
        ),
        frameMaterial
      );
      rightFrame.position.set(
        position.x - windowX + windowWidth / 2,
        position.y + windowOffsetY,
        position.z + frameDepth / 2 + windowWidth / 2
      );
      rightFrame.rotation.y = rotationY;
      this.app.scene.add(rightFrame);
    };

    // Front wall
    addWall(
      { x: 0, y: this.wallHeight / 2, z: -this.floorWidth / 2 },
      0,
      wallGeometry2
    );

    // Back wall
    addWall(
      { x: 0, y: this.wallHeight / 2, z: this.floorWidth / 2 },
      Math.PI,
      wallGeometry2
    );

    // Left wall with a larger window
    createWallWithWindow(
      { x: -this.floorWidth2 / 2, y: this.wallHeight / 2, z: 0 },
      Math.PI / 2,
      this.floorWidth,
      this.wallHeight,
      8,
      4,
      1 // Y-offset for window position
    );

    /*
    { x: -this.floorWidth2 / 2, y: this.wallHeight / 2, z: 0 },
      Math.PI / 2,
      wallGeometry

    */

    // Right wall
    addWall(
      { x: this.floorWidth2 / 2, y: this.wallHeight / 2, z: 0 },
      -Math.PI / 2,
      wallGeometry
    );
  }

  /*
   * Create a Plane Mesh
   */
  buildFloor() {
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x0a9a95 });

    let plane = new THREE.PlaneGeometry(this.floorWidth2, this.floorWidth);
    this.planeMesh = new THREE.Mesh(plane, planeMaterial);
    this.planeMesh.rotation.x = -Math.PI / 2;
    this.app.scene.add(this.planeMesh);
  }

  /**
   * initializes the contents
   */

  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      this.app.scene.add(this.axis);
    }

    // create a table
    const table = new Table(this);
    this.app.scene.add(table);
    table.scale.set(2, 1, 2);
    table.position.setX(1);
    table.position.setZ(-this.floorWidth / 2 + 6);

    // Create Donut
    const donut = new Donut(this);
    this.app.scene.add(donut);
    donut.position.set(1, 1.33, -this.floorWidth / 2 + 6);

    // Create a spring
    const spring = new Spring(this);
    this.app.scene.add(spring);
    spring.scale.set(0.7, 0.7, 0.7);
    spring.position.set(0.5, 0.97, -this.floorWidth / 2 + 5.5);

    // Create a curtains
    const curtains = new Curtains(this);
    this.app.scene.add(curtains);
    curtains.position.setX(-this.floorWidth / 2 - 1.5);

    // create a cabinet
    const cabinet = new Cabinet(this);
    this.app.scene.add(cabinet);
    cabinet.scale.set(0.8, 0.8, 1.3);
    cabinet.position.set(-3.4, 0.23, -this.floorWidth / 2 + 1.3);

    // create sofa
    const sofa = new Sofa(this);
    sofa.position.set(1, 0, -this.floorWidth / 2 + 1.3);
    sofa.scale.set(2.5, 2.5, 2.5);
    this.app.scene.add(sofa);

    // create rug
    const rug = new Rug(this);
    rug.scale.set(2, 1.75, 2);
    rug.position.set(1, 0.1, -this.floorWidth / 2 + 6);
    this.app.scene.add(rug);

    // create a lamp
    const lamp = new Lamp(this);
    this.app.scene.add(lamp);
    lamp.position.set(-3.8, 1.69, -this.floorWidth / 2 + 0.55);

    //create telephone
    const telephone = new Telephone(this);
    telephone.position.set(-3.1, 1.69, -this.floorWidth / 2 + 1.6);
    telephone.scale.set(0.8, 0.8, 0.8);
    this.app.scene.add(telephone);

    //create beetle frame
    const beetle = new Beetle(this);
    beetle.position.set(1, 4.5, -this.floorWidth / 2 + 0.05);
    beetle.rotation.z = -0.2;
    this.app.scene.add(beetle);

    //create picture1
    const picture1 = new Pictures(this, "./textures/pictures/jorge1.jpg");
    picture1.position.set(-8, 3, this.floorWidth / 2 - 0.05);
    picture1.rotation.y = -Math.PI / 2;
    this.app.scene.add(picture1);

    //create picture2
    const picture2 = new Pictures(this, "./textures/pictures/jorge2.jpg");
    picture2.position.set(-5, 5, this.floorWidth / 2 - 0.05);
    picture2.rotation.y = -Math.PI / 2;
    this.app.scene.add(picture2);

    //create a TV
    const tv = new TV(this);
    tv.position.set(0, 0, this.floorWidth / 2 - 1);
    this.app.scene.add(tv);

    //create Tall Lamp
    const tallLamp = new TallLamp(this);
    tallLamp.position.set(8, 0, -this.floorWidth / 2 + 1);
    this.app.scene.add(tallLamp);

     
    //create Flowers
    const flowers = new Flowers(this);
    flowers.position.set(8, 0, this.floorWidth / 2 - 1);
    this.app.scene.add(flowers);




    //Spotlight for Tall Lamp (NEEDS ITS OWN CLASS)
    const Talllight = new THREE.SpotLight(0xfff2d3, 20, 10, Math.PI/3.5 , 0.3, 1.5);
    Talllight.position.set(6.4, 6.9, -this.floorWidth/2 + 1);
    Talllight.target.position.set(4.55, 0, -this.floorWidth/2 + 1.3); // Ajuste a posição de destino para apontar para baixo
    this.app.scene.add(Talllight);
    this.app.scene.add(Talllight.target);

    // //Spotlight Helper
    //  const helper = new THREE.SpotLightHelper(light);
    //  this.app.scene.add(helper);

    // add a point light on top of the model
    const pointLight = new THREE.PointLight(0xffffff, 500, 0);
    pointLight.position.set(0, 20, 0);
    this.app.scene.add(pointLight);

    // add a point light helper for the previous point light
    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    this.app.scene.add(pointLightHelper);

    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    this.buildFloor();

    this.buildWalls();
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   *
   */
  update() {}
}

export { MyContents };
