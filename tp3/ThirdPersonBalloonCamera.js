// ThirdPersonBalloonCamera.js
import * as THREE from 'three';

class ThirdPersonBalloonCamera {
    constructor(params) {
        this.params = params;
        this.camera = params.camera;
        this.target = params.target;

        this.idealOffset = params.offset || new THREE.Vector3(0, 10, -12);
        this.idealLookAt = params.lookAtOffset || new THREE.Vector3(0, 4, 10);

        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();

        this.currentQuaternion = new THREE.Quaternion();
        this.targetQuaternion = new THREE.Quaternion();

        this.camera.quaternion.copy(this.currentQuaternion);
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

        const t = 1.0 - Math.pow(0.001, deltaTime);

        this.currentPosition.lerp(idealOffset, t);
        this.currentLookAt.lerp(idealLookAt, t);

        this.camera.position.copy(this.currentPosition);

        const direction = new THREE.Vector3().subVectors(this.currentLookAt, this.currentPosition).normalize();

        this.targetQuaternion.setFromRotationMatrix(
            new THREE.Matrix4().lookAt(this.currentPosition, this.currentLookAt, this.camera.up)
        );

        this.currentQuaternion.slerp(this.targetQuaternion, t);
        this.camera.quaternion.copy(this.currentQuaternion);
    }
}

export default ThirdPersonBalloonCamera;
