import * as THREE from "three";

/**
 * A DonutLight is a light used to highlight the donut on top of the table.
 */
class DonutLight extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;

    this.donutSpotLight = new THREE.SpotLight(0xfff2d3, 100, 15, Math.PI / 13, 0.1,1.5);
    this.donutSpotLight.target.position.set(0.1,0,-0.3);
		
    this.add(this.donutSpotLight.target);
    this.add(this.donutSpotLight);
    
    this.donutSpotLight.castShadow = true;
    this.donutSpotLight.shadow.mapSize.width = 4096;
    this.donutSpotLight.shadow.mapSize.height = 4096;
    this.donutSpotLight.shadow.bias = 0.00;
    this.donutSpotLight.shadow.camera.near = 0.3;
    this.donutSpotLight.shadow.camera.far = 10;
    this.donutSpotLight.shadow.camera.left = -15;
    this.donutSpotLight.shadow.camera.right = 15;
    this.donutSpotLight.shadow.camera.top = 15;
    this.donutSpotLight.shadow.camera.bottom = -15;

    this.helper = new THREE.SpotLightHelper(this.donutSpotLight.clone());
    this.helper.visible = false;
    this.add(this.helper);

    this.isLightOn = true;
  }
  turnOffLight() {
    this.isLightOn = !this.isLightOn;
    this.donutSpotLight.intensity = this.isLightOn ? 100 : 0;
  }
  toggleHelper() {
    this.helper.visible = !this.helper.visible;
  }
}
DonutLight.prototype.isGroup = true;

export { DonutLight };
