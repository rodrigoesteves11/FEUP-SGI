// MyBalloon.js
import * as THREE from 'three';

class MyBalloon {
  constructor(scene, modelLoader, modelUrl, position) {
    this.scene = scene;
    this.modelLoader = modelLoader;
    this.modelUrl = modelUrl;
    this.position = position;

    this.mesh = null;

    this.layerBases = [0.11, 3.11, 6.11, 9.11, 12.11];
    this.targetLayer = 0;    


    this.movingVertically = false;
    this.verticalTimer = 0;
    this.transitionDuration = 0.3; 

    this.windSpeed = 10;

    this.windDirections = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
    ];

    this.targetQuaternion = new THREE.Quaternion();

    this.keyDownHandler = this.handleKeyDown.bind(this);

    this.initKeyboard();

    this.loadModel();
    this.setInitialPosition(this.position);
  }

  loadModel() {
    this.mesh = this.modelLoader.getModel(this.modelUrl, 7);


    //this.mesh.position.set(0, this.layerBases[0], 0);

    this.mesh.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    this.scene.add(this.mesh);

    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);

    // this.boundingBoxHelper = new THREE.Box3Helper(this.boundingBox, 0xffff00);
    // this.scene.add(this.boundingBoxHelper);

    this.targetQuaternion.copy(this.mesh.quaternion);
  }

  setInitialPosition(position, layerIndex = 0) {
    if (this.mesh) {
      this.mesh.position.set(position, this.layerBases[layerIndex], 0);
      this.targetLayer = layerIndex;
    }
  }

  initKeyboard() {
    document.addEventListener('keydown', this.keyDownHandler);
  }

  removeKeyboard() {
    document.removeEventListener('keydown', this.keyDownHandler);
  }

  handleKeyDown(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.upOneLayer();
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.downOneLayer();
        break;
    }
  }

  upOneLayer() {
    if (this.targetLayer < 4) {
      this.targetLayer++;
      this.upOrDown();
    }
  }

  downOneLayer() {
    if (this.targetLayer > 0) {
      this.targetLayer--;
      this.upOrDown();
    }
  }

  // This method is called when the balloon is moving up or down
  upOrDown() {
    if (!this.mesh) return; 

    this.movingVertically = true;
    this.verticalTimer = 0;

    this.startY = this.mesh.position.y;               
    this.endY = this.layerBases[this.targetLayer];     
  }

  update(deltaTime) {

    if (this.movingVertically) {
      this.verticalTimer += deltaTime;
      const t = Math.min(this.verticalTimer / this.transitionDuration, 1.0);

      const newY = THREE.MathUtils.lerp(this.startY, this.endY, t);
      this.mesh.position.y = newY;

      if (t >= 1.0) {
        this.mesh.position.y = this.endY;
        this.movingVertically = false;
      }
    }
    
    this.boundingBox.setFromObject(this.mesh);
    const center = this.boundingBox.getCenter(new THREE.Vector3());
    const size = this.boundingBox.getSize(new THREE.Vector3());
    const reductionFactor = 0.8;
    size.multiplyScalar(reductionFactor);
    this.boundingBox.setFromCenterAndSize(center, size);
    
    //this.boundingBoxHelper.update();

    const windDir = this.windDirections[this.targetLayer].clone();
    windDir.multiplyScalar(this.windSpeed);

    this.mesh.position.x += windDir.x * deltaTime;
    this.mesh.position.z += windDir.z * deltaTime;

    if (windDir.lengthSq() > 0.0001) {
      const angle = Math.atan2(windDir.x, windDir.z);

      const targetEuler = new THREE.Euler(0, angle, 0);
      const targetQuat = new THREE.Quaternion().setFromEuler(targetEuler);

      this.targetQuaternion.copy(targetQuat);

      const rotationSpeed = 5;
      this.mesh.quaternion.slerp(this.targetQuaternion, rotationSpeed * deltaTime);
    }
  }

  get Position() {
    return this.mesh ? this.mesh.position : new THREE.Vector3();
  }

  get Rotation() {
    return this.mesh ? this.mesh.quaternion : new THREE.Quaternion();
  }

  getCurrentWindDir() {
    return this.windDirections[this.targetLayer].clone().multiplyScalar(this.windSpeed);
  }

  dispose() {
    this.removeKeyboard();

    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh = null;
    }

  }
}

export default MyBalloon;
