import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/**
 * A Cabinet is a 3D object that represents a cabinet.
 */
class Spring extends THREE.Object3D {
  /**
    
     */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";

    const textureLoader = new THREE.TextureLoader();


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

    class CustomSinCurve extends THREE.Curve {

      constructor( scale = 0 ) {
        super();
        this.scale = scale;
      }
    
      getPoint(t, optionalTarget = new THREE.Vector3()) {
        const radius = 0.2;
        const coils = 10;
        const height = 1;

        const angle = coils * 2 * Math.PI * t;
        const x = radius * Math.cos(angle);
        const y = height * t;
        const z = radius * Math.sin(angle);

        return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
      }
    }
    
    const path = new CustomSinCurve( 1 );
    const geometry = new THREE.TubeGeometry( path, 200, 0.02, 8, false );
    const mesh = new THREE.Mesh( geometry, steelMaterial );
    mesh.rotation.x = Math.PI/2;
    mesh.position.set(2, 0.4, 0);
    this.add( mesh );
    
  }
}

Spring.prototype.isGroup = true;

export { Spring };
