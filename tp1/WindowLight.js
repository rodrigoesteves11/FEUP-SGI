import * as THREE from "three";

/**
 * A WindowLight is a light used to simulate a window light.
 */
class WindowLight extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;

    this.windowLight = new THREE.SpotLight(0xfff2d3, 100, 40, Math.PI / 12, 0.1,1.5);
    this.windowLight.target.position.set(1,0,0);
		
    this.add(this.windowLight.target);
    this.add(this.windowLight);
    
    this.windowLight.castShadow = true;
    this.windowLight.shadow.mapSize.width = 4096;
    this.windowLight.shadow.mapSize.height = 4096;
    this.windowLight.shadow.bias = 0.00;
    this.windowLight.shadow.camera.near = 0.1;
    this.windowLight.shadow.camera.far = 10;
    this.windowLight.shadow.camera.left = -15;
    this.windowLight.shadow.camera.right = 15;
    this.windowLight.shadow.camera.top = 15;
    this.windowLight.shadow.camera.bottom = -15;

    this.helper = new THREE.SpotLightHelper(this.windowLight.clone());
    this.helper.visible = false;
    this.add(this.helper);

    this.isLightOn = true;
  }
  turnOffLight() {
    this.isLightOn = !this.isLightOn;
    this.windowLight.intensity = this.isLightOn ? 100 : 0;
  }
  toggleHelper() {
    this.helper.visible = !this.helper.visible;
  }
}
WindowLight.prototype.isGroup = true;

export { WindowLight };
