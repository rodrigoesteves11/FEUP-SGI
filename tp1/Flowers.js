import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/**
 * A TV is a 3D object that represents a photo of scene creator.
 */
class Flowers extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    const textureLoader = new THREE.TextureLoader();

    const dirtAoMap = textureLoader.load(
      "/sgi-t03-g03/tp1/textures/dirt/gravelly_sand_ao_4k.jpg"
    );
    const dirtBaseColor = textureLoader.load(
      "/sgi-t03-g03/tp1/textures/dirt/gravelly_sand_diff_4k.jpg"
    );
    const dirtNormalMap = textureLoader.load(
      "/sgi-t03-g03/tp1/textures/dirt/gravelly_sand_nor_gl_4k.jpg"
    );
    const dirtRoughnessMap = textureLoader.load(
      "/sgi-t03-g03/tp1/textures/dirt/gravelly_sand_rough_4k.jpg"
    );
    const dirtDisplacementMap = textureLoader.load(
      "/sgi-t03-g03/tp1/textures/dirt/gravelly_sand_disp_4k.jpg"
    );

    const dirtMaterial = new THREE.MeshStandardMaterial({
      aoMap: dirtAoMap,
      map: dirtBaseColor,
      normalMap: dirtNormalMap,
      roughnessMap: dirtRoughnessMap,
      displacementMap: dirtDisplacementMap,
      displacementScale: 0,
      color: new THREE.Color(0.7, 0.7, 0.7),
      roughness: 0.8,
    });

    const flowerBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x8d4436,
      side: THREE.DoubleSide,
    });
    const flowerMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x303b2e,
      side: THREE.DoubleSide,
    });

    //Flower Base
    const geometryBase = new THREE.CylinderGeometry(0.7, 0.5, 0.9, 64, 32, true);
    const base = new THREE.Mesh(geometryBase, flowerBaseMaterial);
    base.position.set(0, 0.45, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    this.add(base);

    //Flower Base inside
    const geometryBaseInside = new THREE.CylinderGeometry(0.6, 0.4, 0.9, 64, 32, true);
    const baseInside = new THREE.Mesh(geometryBaseInside, flowerBaseMaterial);
    baseInside.position.set(0, 0.45, 0);
    baseInside.castShadow = true;
    baseInside.receiveShadow = true;
    this.add(baseInside);

    //Flower Base Top Ring
    const geometryBaseTop = new THREE.RingGeometry(0.6, 0.7, 64);
    const baseTop = new THREE.Mesh(geometryBaseTop, flowerBaseMaterial);
    baseTop.position.set(0, 0.9, 0);
    baseTop.rotation.x = Math.PI / 2;
    baseTop.castShadow = true;
    baseTop.receiveShadow = true;
    this.add(baseTop);

    //Base Dirt
    const geometryDirt = new THREE.CircleGeometry(0.6, 32);
    const dirt = new THREE.Mesh(geometryDirt, dirtMaterial);
    dirt.position.set(0, 0.75, 0);
    dirt.rotation.x = -Math.PI / 2;
    this.add(dirt);

    // Função para criar uma flor com caule, centro e pétalas
    const createFlower = (x, z, r) => {
      //Flower base curved
      const maxValue = 0.3;
      const minValue = 0.1;

      const path = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-(Math.random() * (maxValue - minValue)+ minValue), 0.2, 0),
        new THREE.Vector3((Math.random() * (maxValue - minValue)+ minValue), 0.4, 0),
        new THREE.Vector3(0, 0.6, 0)
      );
      const geometryBaseCurved = new THREE.TubeGeometry(
        path,
        64,
        0.02,
        8,
        false
      );
      const baseCurved = new THREE.Mesh(geometryBaseCurved, flowerMaterial2);
      baseCurved.position.set(x, 0.6, z);
      baseCurved.castShadow = true;
      baseCurved.receiveShadow = true;
      this.add(baseCurved);

      //Flower Center
      const geometryCenter = new THREE.SphereGeometry(0.08, 32, 32);
      const centerMaterial = new THREE.MeshStandardMaterial({
        color: 0xf5e342,
        side: THREE.DoubleSide,
      });
      const center = new THREE.Mesh(geometryCenter, centerMaterial);
      center.position.set(x, 1.2, z);
      center.castShadow = true;
      center.receiveShadow = true;
      this.add(center);

      //Flower Petals
      const geometryPetal = new THREE.SphereGeometry(0.05, 32, 32);
      const petalMaterial = new THREE.MeshStandardMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide,
      });

      //Create petals (8) around the center of the flower
      for (let i = 0; i < 8; i++) {
        const petal = new THREE.Mesh(geometryPetal, petalMaterial);
        petal.position.set(x, 1.2, z);
        petal.scale.set(0.8, 2, 0.8);
        petal.rotation.z = (i * Math.PI) / 4;
        petal.rotation.x = 0.4;
        petal.rotation.y = r;
        petal.translateY(0.15);
        petal.castShadow = true;
        petal.receiveShadow = true;
        this.add(petal);
      }
    };

    const flowerPositions = [
      { x: -0.3, z: -0.3, r: 1.234 },
      { x: 0.3, z: -0.3, r: -2.345 },
      { x: -0.3, z: 0.3, r: 3.456 },
      { x: 0.3, z: 0.3, r: -4.567 },
      { x: 0, z: 0, r: 0 },
    ];

    flowerPositions.forEach((pos) => createFlower(pos.x, pos.z, pos.r));
  }
}

Flowers.prototype.isGroup = true;

export { Flowers };
