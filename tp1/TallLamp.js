import * as THREE from "three";
import { MyApp } from './MyApp.js';

/**
 * A TV is a 3D object that represents a photo of scene creator.
 */
class TallLamp extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";
    
    const textureLoader = new THREE.TextureLoader();

    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x915996, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.3 });
    const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x5f7ed0, side: THREE.DoubleSide, metalness: 0.3, roughness: 0.3 });
    const lampShadeMaterial = new THREE.MeshStandardMaterial({ color: 0xb6602d, side: THREE.DoubleSide, opacity: 0.91, transparent: true, roughness : 0.9 });


    //Base
    const geometryBase = new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 3.5);
    const base = new THREE.Mesh(geometryBase, baseMaterial);
    base.position.set(0, -0.5, 0);
    this.add(base);

    //Base Pole
    const geometryPole = new THREE.CylinderGeometry(0.08, 0.08, 6, 32);
    const pole = new THREE.Mesh(geometryPole, baseMaterial);
    pole.position.set(0, 3.29, 0);
    this.add(pole);

    //Support Base
    const geometrySupportBase = new THREE.TorusGeometry(0.08, 0.05, 16, 100);
    const supportBase = new THREE.Mesh(geometrySupportBase, supportMaterial);
    supportBase.rotation.x = Math.PI / 2;
    supportBase.position.set(0, 6.3, 0);
    this.add(supportBase);

    const geometrySupportBall = new THREE.SphereGeometry(0.2, 32, 32);
    const supportBall = new THREE.Mesh(geometrySupportBall, supportMaterial);
    supportBall.position.set(0, 6.5, 0);
    this.add(supportBall);

    //Curved Support
   
    class CustomCurve extends THREE.Curve {
      constructor(scale) {
          super();
          this.scale = scale; // Escala da curva
      }

      getPoint(t) {
        const x = t * (3 * Math.PI / 2); 
        const y = Math.sin(x) * this.scale; // Calcula o valor de y com base em sin(x)
        const z = 0; 
        return new THREE.Vector3(x, y, z);
    }
    }

    const path = new CustomCurve(1); // Ajuste a escala conforme necessário
    const tubeGeometry = new THREE.TubeGeometry(path, 64, 0.15, 20, false);
    const tube = new THREE.Mesh(tubeGeometry, supportMaterial);
    tube.position.set(-1.6, 7, 0);
    tube.scale.set(0.3, 0.5, 0.3); 
    this.add(tube);

    //Lamp Shade
   
    const points = [];
    points.push(new THREE.Vector2(0.5, 0)); 
    points.push(new THREE.Vector2(0.8, -1.3));  

    const latheGeometry = new THREE.LatheGeometry(points, 8);
    const abajur = new THREE.Mesh(latheGeometry, lampShadeMaterial);
    abajur.position.set(-1.5, 7.15, 0);
    abajur.rotation.z = -Math.PI / 12;
    this.add(abajur);
    
    //Lamp Shape Border

    const geometryBorder = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
    const border = new THREE.Mesh(geometryBorder, lampShadeMaterial);
    border.rotation.y = -Math.PI / 12;
    border.rotation.x = Math.PI / 2;
    border.position.set(-1.5, 7.15, 0);
    this.add(border);

    const materialBulb = new THREE.MeshPhongMaterial({
      color: 0xfff2d3,         // The main color of the bulb
      emissive: 0xfff2d3,      // The color it emits (a warm glow)
      emissiveIntensity: 1     // The strength of the emissive glow
    });
    //Light Bulb
    const geometryBulb = new THREE.SphereGeometry(0.15, 32, 32);
    const bulb = new THREE.Mesh(geometryBulb, materialBulb);
    bulb.position.set(-1.65, 6.9, 0);
    this.add(bulb);

    base.castShadow = true;
    base.receiveShadow = true;

    pole.castShadow = true;
    pole.receiveShadow = true;

    supportBase.castShadow = true;
    supportBase.receiveShadow = true;

    supportBall.castShadow = true;
    supportBall.receiveShadow = true;

    tube.castShadow = true;
    tube.receiveShadow = true;

    abajur.castShadow = true;
    abajur.receiveShadow = true;

    border.castShadow = true;
    border.receiveShadow = true;

    


    




  }
}

TallLamp.prototype.isGroup = true;

export { TallLamp };
