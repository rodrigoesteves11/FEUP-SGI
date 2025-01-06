// FirstPersonBalloonCamera.js
import * as THREE from 'three';

class FirstPersonBalloonCamera {
    constructor(params) {
        this.camera = params.camera;
        this.target = params.target;

        this.idealOffset = params.offset || new THREE.Vector3(0, 0.6, 0.05);
        this.idealLookAt = params.lookAtOffset || new THREE.Vector3(0, 0, 10);
    }

    calculateOffset() {
        const offset = this.idealOffset.clone();
        offset.applyQuaternion(this.target.Rotation);
        offset.add(this.target.Position);
        return offset;
    }

    calculateLookAt() {
        const lookAt = this.idealLookAt.clone();
        lookAt.applyQuaternion(this.target.Rotation);
        lookAt.add(this.target.Position);
        return lookAt;
    }

    update(deltaTime) {
        if (!this.target) return;

        const idealOffset = this.calculateOffset();
        const idealLookAt = this.calculateLookAt();

        this.camera.position.copy(idealOffset);
        this.camera.quaternion.copy(this.target.Rotation);
        this.camera.lookAt(idealLookAt);
    }
}

export default FirstPersonBalloonCamera;
