import * as THREE from "three";
import { MyApp } from './MyApp.js';

/**
 * A Cabinet is a 3D object that represents a cabinet.
 */
class Lamp extends THREE.Object3D {
  /**
    
     */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    const textureLoader = new THREE.TextureLoader();

    const blackmetalambientOcclusionTexture = textureLoader.load(
        "./textures/black-metal/Gun_Metal_Scratched_001_OCC.jpg"
      );
      const blackmetalbaseColorTexture = textureLoader.load(
        "./textures/black-metal/Gun_Metal_Scratched_001_COLOR.jpg"
      );
      const blackmetalnormalMapTexture = textureLoader.load(
        "./textures/black-metal/Gun_Metal_Scratched_001_NORM.jpg"
      );
      const blackmetalroughnessMapTexture = textureLoader.load(
        "./textures/black-metal/Gun_Metal_Scratched_001_ROUGH.jpg"
      );
      const blackmetalheightMapTexture = textureLoader.load(
        "./textures/black-metal/Gun_Metal_Scratched_001_METAL.jpg"
      );
  
      const blackmetalMaterial = new THREE.MeshStandardMaterial({
        map: blackmetalbaseColorTexture,
        aoMap: blackmetalambientOcclusionTexture,
        normalMap: blackmetalnormalMapTexture,
        roughnessMap: blackmetalroughnessMapTexture,
        displacementMap: blackmetalheightMapTexture,
        displacementScale: 0,
        metalness: 0.5,
        roughness: 0.8,
        
      });

    const steelambientOcclusionTexture = textureLoader.load(
      "./textures/steel/Metal_Steel_Brushed_001_ambientOcclusion.jpg"
    );
    const steelbaseColorTexture = textureLoader.load(
      "./textures/steel/Metal_Steel_Brushed_001_diffuse.jpg"
    );
    const steelnormalMapTexture = textureLoader.load(
      "./textures/steel/Metal_Steel_Brushed_001_normal.jpg"
    );
    const steelroughnessMapTexture = textureLoader.load(
      "./textures/steel/Metal_Steel_Brushed_001_roughness.jpg"
    );
    const steelheightMapTexture = textureLoader.load(
      "./textures/steel/Metal_Steel_Brushed_001_height.png"
    );

    const steelMaterial = new THREE.MeshStandardMaterial({
      map: steelbaseColorTexture,
      aoMap: steelambientOcclusionTexture,
      normalMap: steelnormalMapTexture,
      roughnessMap: steelroughnessMapTexture,
      displacementMap: steelheightMapTexture,
      displacementScale: 0,
      metalness: 0.5,
      roughness: 0.8,
    });


    const clothambientOcclusionTexture = textureLoader.load(
      "./textures/cloth/Fabric_011_OCC.jpg"
    );
    const clothbasediffuseMap = textureLoader.load(
      "./textures/cloth/Fabric_011_COLOR.jpg"
    );
    const clothnormalMapTexture = textureLoader.load(
      "./textures/cloth/Fabric_011_NORM.jpg"
    );
    const clothroughnessMapTexture = textureLoader.load(
      "./textures/cloth/Fabric_011_ROUGH.jpg"
    );
    const clothheightMapTexture = textureLoader.load(
      "./textures/cloth/Fabric_011_DISP.png"
    );

    const clothMaterial = new THREE.MeshStandardMaterial({
      map: clothbasediffuseMap, 
      normalMap: clothnormalMapTexture, 
      roughnessMap: clothroughnessMapTexture,
      aoMap: clothambientOcclusionTexture, 
      displacementMap: clothheightMapTexture, 
      displacementScale: 0.1,
      transparent: true,
      roughness: 1, 
      metalness: 0, 
      side: THREE.DoubleSide,
    });

    const lampshadeMaterialInside = new THREE.MeshStandardMaterial({
      map: clothbasediffuseMap,
      normalMap: clothnormalMapTexture,
      roughnessMap: clothroughnessMapTexture,
      aoMap: clothambientOcclusionTexture,
      displacementMap: clothheightMapTexture,
      displacementScale: 0.1,
      transparent: true,
      opacity: 0.7, // Mais translúcido internamente
      metalness: 0,
      side: THREE.BackSide, // Definindo como BackSide para renderizar o lado interno
    });

    
    // Create the lamp
    const points = [];
    for ( let i = 0; i < 16; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 0.4 + 0.3, ( i - 5 ) * 0.07 ) );
    }
    const vasegeometry = new THREE.LatheGeometry( points );
    const lathe = new THREE.Mesh( vasegeometry, blackmetalMaterial );
    this.add( lathe );

    const circle1geometry = new THREE.CircleGeometry( 0.3, 32 ); 
    const circle1 = new THREE.Mesh( circle1geometry, blackmetalMaterial ); 
    circle1.rotation.x = Math.PI / 2;
    circle1.position.set(0,-0.5,0);
    this.add( circle1 );

    const circle2geometry = new THREE.CircleGeometry( 0.36, 32 ); 
    const circle2 = new THREE.Mesh( circle2geometry, blackmetalMaterial ); 
    circle2.rotation.x = -Math.PI / 2;
    circle2.position.set(0,0.7,0);
    this.add( circle2 );

    const polegeometry = new THREE.CapsuleGeometry( 0.08, 0.3, 1, 64); 
    const pole = new THREE.Mesh( polegeometry, steelMaterial ); 
    pole.position.set(0,0.9,0);
    this.add( pole );

    const lampshade = new THREE.CylinderGeometry( 0.4, 0.9, 0.7, 64, 1, true );
    const lampshadeInside = new THREE.CylinderGeometry( 0.4, 0.9, 0.7, 64, 1, true );
    lampshadeInside.scale(-1,1,1);
    const lampshadeMesh = new THREE.Mesh(lampshade, clothMaterial );
    const lampshadeMeshInside = new THREE.Mesh(lampshade, lampshadeMaterialInside );
    lampshadeMesh.position.set(0, 1.2, 0);
    lampshadeMeshInside.position.set(0, 1.2, 0);
    this.add( lampshadeMesh );
    this.add( lampshadeMeshInside );


    //create light above pole
    const light = new THREE.PointLight(0xffffff, 10, 50);
    light.position.set(0, 1.3, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = this.mapSize;
    light.shadow.mapSize.height = this.mapSize;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 1;
    light.shadow.bias = -0.001; // Adicionado para reduzir artefatos
    this.add(light);

  }
}

Lamp.prototype.isGroup = true;

export { Lamp };
