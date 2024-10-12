import * as THREE from "three";
import { MyAxis } from "./MyAxis.js";
import { Cabinet } from "./Cabinet.js"; // Ensure this path is correct and the Cabinet class is properly defined in Cabinet.js

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

    this.walltextures = {
      ambientOcclusion: "./textures/wood-wall/Wood_Wall_003_ambientOcclusion.jpg",
      baseColor: "./textures/wood-wall/Wood_Wall_003_basecolor.jpg",
      normalMap: "./textures/wood-wall/Wood_Wall_003_normal.jpg",
      roughnessMap: "./textures/wood-wall/Wood_Wall_003_roughness.jpg",
      heightMap: "./textures/wood-wall/Wood_Wall_003_height.png",
    };
    this.planetextures = {
      ambientOcclusion: "./textures/tiles-floor/Marble_Tiles_001_ambientOcclusion.jpg",
      baseColor: "./textures/tiles-floor/Marble_Tiles_001_basecolor.jpg",
      normalMap: "./textures/tiles-floor/Marble_Tiles_001_normal.jpg",
      roughnessMap: "./textures/tiles-floor/Marble_Tiles_001_roughness.jpg",
      heightMap: "./textures/tiles-floor/Marble_Tiles_001_height.png",
    };


    // wall related attributes
    this.wallThickness = 0.2;
    this.wallHeight = 8;


    //floor related attributes
    this.floorWidth = 15;
    this.floorHeight = 15;
  }

  /*
  * Create a Plane Mesh
  */
  buildWalls() {
    const textureLoader = new THREE.TextureLoader();

    const ambientOcclusionTexture = textureLoader.load(this.walltextures.ambientOcclusion);
    const baseColorTexture = textureLoader.load(this.walltextures.baseColor);
    const normalMapTexture = textureLoader.load(this.walltextures.normalMap);
    const roughnessMapTexture = textureLoader.load(this.walltextures.roughnessMap);
    const heightMapTexture = textureLoader.load(this.walltextures.heightMap);

    baseColorTexture.wrapS = THREE.RepeatWrapping;
    baseColorTexture.wrapT = THREE.RepeatWrapping;
    baseColorTexture.repeat.set(2, 2);

    normalMapTexture.wrapS = THREE.RepeatWrapping;
    normalMapTexture.wrapT = THREE.RepeatWrapping;
    normalMapTexture.repeat.set(2, 2);

    const wallMaterial = new THREE.MeshStandardMaterial({
      map: baseColorTexture,
      aoMap: ambientOcclusionTexture,
      normalMap: normalMapTexture,
      roughnessMap: roughnessMapTexture,
      displacementMap: heightMapTexture,
      displacementScale: 0,
    });

    const wallGeometry = new THREE.PlaneGeometry(
      this.floorWidth,
      this.wallHeight,
    );

    const addWall = (position, rotationY = 0) => {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(position.x, position.y, position.z);
      wall.rotation.y = rotationY;
      this.app.scene.add(wall);
    };
    
    // Front wall
    addWall({ x: 0,  y: this.wallHeight / 2, z: -this.floorWidth / 2 });
    
    // Back wall
    addWall({ x: 0, y: this.wallHeight / 2, z: this.floorWidth / 2 }, Math.PI);
    
    // Left wall
    addWall({ x: this.floorWidth / 2 , y: this.wallHeight / 2, z:0 }, -Math.PI / 2);
    
    // Right wall
    addWall({ x: - this.floorWidth / 2 , y: this.wallHeight / 2, z: 0 }, Math.PI / 2);
  }

  /*
   * Create a Plane Mesh
   */
  buildFloor() {
    const textureLoader = new THREE.TextureLoader();

    const ambientOcclusionTexture = textureLoader.load(this.planetextures.ambientOcclusion);
    const baseColorTexture = textureLoader.load(this.planetextures.baseColor);
    const normalMapTexture = textureLoader.load(this.planetextures.normalMap);
    const roughnessMapTexture = textureLoader.load(this.planetextures.roughnessMap);
    const heightMapTexture = textureLoader.load(this.planetextures.heightMap);

    baseColorTexture.wrapS = THREE.RepeatWrapping;
    baseColorTexture.wrapT = THREE.RepeatWrapping;
    baseColorTexture.repeat.set(4, 4);

    normalMapTexture.wrapS = THREE.RepeatWrapping;
    normalMapTexture.wrapT = THREE.RepeatWrapping;
    normalMapTexture.repeat.set(4, 4);

    const planeMaterial = new THREE.MeshStandardMaterial({
      map: baseColorTexture,
      aoMap: ambientOcclusionTexture,
      normalMap: normalMapTexture,
      roughnessMap: roughnessMapTexture,
      displacementMap: heightMapTexture,
      displacementScale: 0.000001,
    });

    let plane = new THREE.PlaneGeometry(this.floorHeight, this.floorWidth);
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

    // create a cabinet
    const cabinet = new Cabinet(this);
    this.app.scene.add(cabinet);
    cabinet.position.set(0 , 1.64, - this.floorWidth / 2 + 1.1);

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
  update() { }
}

export { MyContents };
