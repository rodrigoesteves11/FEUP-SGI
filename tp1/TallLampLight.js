import * as THREE from "three";

/**
 * A LampLight is an object that represents the lamp light.
 */
class TallLampLight extends THREE.Object3D {
  constructor(app, position) {
    super();
    this.app = app;

   //Spotlight for Tall Lamp 
   this.talllight = new THREE.SpotLight(0xfff2d3, 40, 10, Math.PI/4.5, 0.3, 1.5);
   this.talllight.target.position.set(-0.3, 0, 0);
   this.talllight.castShadow = true;
   this.add(this.talllight);
   this.add(this.talllight.target);

   

    // Configurações para melhorar a qualidade da sombra
    this.talllight.shadow.mapSize.width = 4096;
    this.talllight.shadow.mapSize.height = 4096;
    this.talllight.shadow.bias = 0.00;
    this.talllight.shadow.camera.near = 0.1;
    this.talllight.shadow.camera.far = 10;
    this.talllight.shadow.camera.left = -15;
    this.talllight.shadow.camera.right = 15;
    this.talllight.shadow.camera.top = 15;
    this.talllight.shadow.camera.bottom = -15;


    // Spotlight Helper
    this.helper = new THREE.SpotLightHelper(this.talllight.clone());
    this.helper.visible = false;
    this.add(this.helper);
    

    this.isLightOn = true;
  }

  turnOffLight() {
    this.isLightOn = !this.isLightOn;
    this.talllight.intensity = this.isLightOn ? 40 : 0;
  }
  toggleHelper() {
    this.helper.visible = !this.helper.visible;
  }


}

TallLampLight.prototype.isGroup = true;

export { TallLampLight };
