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
//import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";
//import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { Vase } from "./Vase.js";
import { Newspaper } from "./Newspaper.js";
import { Door } from "./Door.js";
import { LampLight } from "./LampLight.js";
import { TallLampLight } from "./TallLampLight.js";
import { DonutLight } from "./DonutLight.js";
import { WindowLight } from "./WindowLight.js";



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
    this.floorWidth2 = 20;
  }

  /*
   * Create a Plane Mesh
   */
  buildWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8a2ac,
      roughness: 1,
    });

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
      wall.castShadow = true;
      wall.receiveShadow = true;
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
      wall.castShadow = true;
      wall.receiveShadow = true;
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
      topFrame.castShadow = true;
      topFrame.receiveShadow = true;
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
      bottomFrame.castShadow = true;
      bottomFrame.receiveShadow = true;
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
      leftFrame.castShadow = true;
      leftFrame.receiveShadow = true;
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
      rightFrame.castShadow = true;
      rightFrame.receiveShadow = true;
      this.app.scene.add(rightFrame);

      // Half sphere and 2 box geometry to hide the ouside window
      // First create 2 box geometries to hide the top and bottom of the sphere

      const sphereRadius = Math.max(windowWidth, windowHeight); // Adjust radius to cover the window area
      const invisibleMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: false,
        colorWrite: false,
      });

      const invibleGeometry = new THREE.BoxGeometry(
        this.floorWidth,
        sphereRadius,
        0.1
      );

      const invibleMeshTop = new THREE.Mesh(invibleGeometry, invisibleMaterial);
      invibleMeshTop.position.set(
        position.x,
        this.wallHeight + windowHeight / 2,
        position.z + 0.01
      );

      invibleMeshTop.rotation.y = -Math.PI / 2;
      this.app.scene.add(invibleMeshTop);

      const invibleMeshBottom = new THREE.Mesh(invibleGeometry, invisibleMaterial);
      invibleMeshBottom.position.set(
        position.x,
        0,
        position.z + 0.01
      );

      invibleMeshBottom.rotation.y = -Math.PI / 2;
      this.app.scene.add(invibleMeshBottom);

      // Outdoor half-sphere
      const textureLoader = new THREE.TextureLoader();
      const halfSphereGeometry = new THREE.SphereGeometry(
        sphereRadius,
        32,
        32,
        0,
        Math.PI
      ); // Half-sphere geometry
      const texture = textureLoader.load(
        "./textures/window/equirectangular_neighbor_texture.png"
      ); // Load texture
      texture.wrapS = THREE.RepeatWrapping; // Ensure texture wraps correctly for a half-sphere
      const sphereMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide, // Render inside of the sphere
      });

      const halfSphere = new THREE.Mesh(halfSphereGeometry, sphereMaterial);
      halfSphere.position.set(
        position.x,
        position.y + windowOffsetY,
        position.z + 0.01 // Slightly offset to be just outside the wall
      );
      halfSphere.rotation.y = -Math.PI / 2;
      this.app.scene.add(halfSphere);

      // Insible half-sphere
      const invisibleHalfSphereGeometry = new THREE.SphereGeometry(
        sphereRadius + 1,
        32,
        32,
        0,
        Math.PI
      ); // Half-sphere geometry

      const invisibleHalfSphere = new THREE.Mesh(
        invisibleHalfSphereGeometry,
        invisibleMaterial
      );
      invisibleHalfSphere.position.set(
        position.x,
        position.y + windowOffsetY,
        position.z + 0.01
      );
      invisibleHalfSphere.rotation.y = -Math.PI / 2;
      this.app.scene.add(invisibleHalfSphere);
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
    EX LEFT WALL wihout window
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
    this.planeMesh.receiveShadow = true;
    this.app.scene.add(this.planeMesh);
  }

  /*
   * Create a footer
   */
  buildfooter() {
    const footerMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8a2ac,
      roughness: 1,
    });
    const footerHeight = 0.2;
    const footerDepth = 0.1;

    const frontfooter = new THREE.Mesh(
      new THREE.BoxGeometry(this.floorWidth2, footerHeight, footerDepth),
      footerMaterial
    );
    frontfooter.position.set(0, footerHeight / 2, -this.floorWidth / 2 + footerDepth / 2);
    frontfooter.castShadow = true;
    frontfooter.receiveShadow = true;
    this.app.scene.add(frontfooter);

    const backfooter = new THREE.Mesh(
      new THREE.BoxGeometry(this.floorWidth2, footerHeight, footerDepth),
      footerMaterial
    );
    backfooter.position.set(0, footerHeight / 2, this.floorWidth / 2 - footerDepth / 2);
    backfooter.castShadow = true;
    backfooter.receiveShadow = true;
    this.app.scene.add(backfooter);

    const leftfooter = new THREE.Mesh(
      new THREE.BoxGeometry(footerDepth, footerHeight, this.floorWidth),
      footerMaterial
    );
    leftfooter.position.set(-this.floorWidth2 / 2 + footerDepth / 2, footerHeight / 2, 0);
    leftfooter.castShadow = true;
    leftfooter.receiveShadow = true;
    this.app.scene.add(leftfooter);

    const rightfooter = new THREE.Mesh(
      new THREE.BoxGeometry(footerDepth, footerHeight, this.floorWidth),
      footerMaterial
    );
    rightfooter.position.set(this.floorWidth2 / 2 - footerDepth / 2, footerHeight / 2, 0);
    rightfooter.castShadow = true;
    rightfooter.receiveShadow = true;
    this.app.scene.add(rightfooter);
  }

  /**
   * initializes the contents
   */

  init() {
    // create once
    if (this.axis === null) {
      // create and attach the axis to the scene
      this.axis = new MyAxis(this);
      //this.app.scene.add(this.axis);
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

    // Create Donut Spotlight
    const donutSpotLight = new DonutLight(this);
    donutSpotLight.position.set(0, 10, 0);
    this.app.donutLight = donutSpotLight;
    this.app.scene.add(donutSpotLight);

    //Create a jornal
    const journal = new Newspaper(this);
    journal.position.set(1.8, 1, -this.floorWidth / 2 + 6);
    this.app.scene.add(journal);

    // Create a spring
    const spring = new Spring(this);
    this.app.scene.add(spring);
    spring.scale.set(0.5, 0.5, 0.7);
    spring.position.set(-3.7, 1.7, -this.floorWidth / 2 + 1.6);

    // Create a curtains
    const curtains = new Curtains(this);
    this.app.openCloseCurtains = curtains;
    this.app.scene.add(curtains);
    curtains.position.setX(-this.floorWidth / 2 - 0.5);

    // create a cabinet
    const cabinet = new Cabinet(this);
    this.app.scene.add(cabinet);
    cabinet.scale.set(0.8, 0.8, 1.3);
    cabinet.position.set(-3.4, 0.23, -this.floorWidth / 2 + 1.3);

    // create sofa
    const sofa = new Sofa(this);
    sofa.position.set(1, 0, -this.floorWidth / 2 + 1.4);
    sofa.scale.set(2.5, 2.5, 2.5);
    this.app.scene.add(sofa);

    // create rug
    const rug = new Rug(this);
    rug.scale.set(2, 1.75, 2);
    rug.position.set(1, 0.001, -this.floorWidth / 2 + 6);
    this.app.scene.add(rug);

    // create a lamp
    const lamp = new Lamp(this);
    this.app.scene.add(lamp);
    lamp.position.set(-3.8, 1.69, -this.floorWidth / 2 + 0.55);

    //create a lampLight
    const lampLight = new LampLight(this);
    lampLight.position.set(-3.8, 1.69, -this.floorWidth / 2 + 0.55);
    this.app.lampLight = lampLight;
    this.app.scene.add(lampLight);

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
    this.app.tv = tv;

    //create Tall Lamp
    const tallLamp = new TallLamp(this);
    tallLamp.position.set(8, 0, -this.floorWidth / 2 + 1);
    this.app.scene.add(tallLamp);

    //create Tall Lamp Light
    const tallLampLight = new TallLampLight(this);
    tallLampLight.position.set(6.4, 5.9, -this.floorWidth/2 + 1);
    this.app.tallLamp = tallLampLight;
    this.app.scene.add(tallLampLight);

    //create window light
    const windowLight = new WindowLight(this);
    windowLight.position.set(-this.floorWidth2 / 2 - 15, 20, 0);
    this.app.scene.add(windowLight);
 
    //create Flowers
    const flowers = new Flowers(this);
    flowers.position.set(8, 0, this.floorWidth / 2 - 1);
    this.app.scene.add(flowers);

    //create Vase
    const vase = new Vase(this);
    vase.position.set(4.3, 1, this.floorWidth / 2 - 1.1);
    this.app.scene.add(vase);

    // create a door
    const door = new Door(this);
    door.position.setX(this.floorWidth2 / 2 - 0.1);
    this.app.scene.add(door);


    // RectAreaLight para simular o brilho do ecrã
    const screenLight2 = new THREE.RectAreaLight(0xffffff, 3, 5.3, 2.5); // Cor, intensidade e dimensões
    screenLight2.position.set(0, 2.5, this.floorWidth / 2 - 1.35); // Posiciona a luz bem próxima do ecrã
    this.app.scene.add(screenLight2);

    // this.app.scene.add( new RectAreaLightHelper( screenLight2 ) );

    // // add a point light on top of the model
    // const pointLight = new THREE.PointLight(0xffffff, 500, 0);
    // pointLight.position.set(0, 20, 0);
    // this.app.scene.add(pointLight);

    // // add a point light helper for the previous point light
    // const sphereSize = 0.5;
    // const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    // this.app.scene.add(pointLightHelper);

    const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
    pointLight.position.set( 0, 20, 0 );
    // add shadow casting
    pointLight.castShadow = true
    pointLight.shadow.mapSize.width = 4096
    pointLight.shadow.mapSize.height = 4096
    pointLight.shadow.bias = -0.001;
    pointLight.shadow.camera.near = 0.5
    pointLight.shadow.camera.far = 100
    pointLight.shadow.camera.left = -15
    pointLight.shadow.camera.right = 15
    pointLight.shadow.camera.top = 15
    pointLight.shadow.camera.bottom = -15
    this.app.scene.add( pointLight );

    // add a point light helper for the previous point light
    const sphereSize = 0.5;
    const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
    this.app.scene.add( pointLightHelper );


    // add an ambient light
    const ambientLight = new THREE.AmbientLight(0x555555);
    this.app.scene.add(ambientLight);

    this.buildFloor();

    this.buildWalls();

    this.buildfooter();
  }

  /**
   * updates the contents
   * this method is called from the render method of the app
   *
   */
  update() {}
}

export { MyContents };
