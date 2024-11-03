import * as THREE from "three";

/**
 * A LampLight is an object that represents the lamp light.
 */
class LampLight extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;

    // Cria uma SpotLight com cor, intensidade, distância, ângulo e penumbra ajustados
    this.spotLight = new THREE.SpotLight(0xfff2d3, 10, 10, Math.PI / 3 , 0.3, 2); // Cor, intensidade, distância, ângulo, penumbra, decaimento
    this.spotLight.position.set(0, 1.4, 0);
    this.spotLight.castShadow = true;

    // Configurações para melhorar a qualidade da sombra
    this.spotLight.shadow.mapSize.width = 4096;
    this.spotLight.shadow.mapSize.height = 4096;
    this.spotLight.shadow.bias = -0.005;
    this.spotLight.shadow.camera.near = 0.5;
    this.spotLight.shadow.camera.far = 10;
    this.spotLight.shadow.camera.left = -15;
    this.spotLight.shadow.camera.right = 15;
    this.spotLight.shadow.camera.top = 15;
    this.spotLight.shadow.camera.bottom = -15;



    this.add(this.spotLight);
    this.spotLight.target.position.set(0, 0, 0);
    this.add(this.spotLight.target); 
    
    // Spotlight Helper
    this.helper = new THREE.SpotLightHelper(this.spotLight.clone());
    this.helper.visible = false;
    this.add(this.helper);
    

    this.isLightOn = true;

    
    
  }
  turnOffLight() {
    this.isLightOn = !this.isLightOn;
    this.spotLight.intensity = this.isLightOn ? 10 : 0;
  }
  toggleHelper() {
    this.helper.visible = !this.helper.visible;
  }

}

LampLight.prototype.isGroup = true;

export { LampLight };
