// AIBalloon.js
import * as THREE from 'three';

class AIBalloon {

    constructor(scene, modelLoader, modelUrl, initialPosition) {
        this.scene = scene;
        this.modelUrl = modelUrl;
        this.modelLoader = modelLoader;
        this.position = initialPosition;
        this.currentWaypoint = 0;
        this.speed = 10;

        this.layerBases = [0.11, 3.11, 6.11, 9.11, 12.11];
        this.targetLayer = 0;
        this.movingVertically = false;
        this.verticalTimer = 0;
        this.transitionDuration = 0.3;

        this.customPoints = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(initialPosition, 0, 0),      
                    new THREE.Vector3(initialPosition/2, 0, 35),
                    new THREE.Vector3(10, 0, 55),
                    new THREE.Vector3(20, 0, 62.5), 
                    new THREE.Vector3(35, 0, 70), 
                    new THREE.Vector3(50, 0, 75), 
                    new THREE.Vector3(65, 0, 75), 
                    new THREE.Vector3(90, 0, 60), 
                    new THREE.Vector3(95, 0, 45), 
                    new THREE.Vector3(80, 0, 35),
                    new THREE.Vector3(60, 0, 30),  
                    new THREE.Vector3(35, 0, 25),
                    new THREE.Vector3(25, 0, 0), // U Middle
                    new THREE.Vector3(40, 0, -20),
                    new THREE.Vector3(60, 0, -25),
                    new THREE.Vector3(75, 0, -35),
                    new THREE.Vector3(85, 0, -50),
                    new THREE.Vector3(70, 0, -70),
                    new THREE.Vector3(50, 0, -70),
                    new THREE.Vector3(0, 0, -50),
                    new THREE.Vector3(initialPosition, 0, -35),
                    new THREE.Vector3(initialPosition, 0, 0) 
                ], this.closedCurve);

        this.waypoints = this.customPoints.getPoints(200);

        this.mesh = null;

        this.movementActive = false;

        this.loadModel();
        this.setInitialPosition(this.position);
    }

    async loadModel() {
        this.mesh = this.modelLoader.getModel(this.modelUrl, 7);

        this.mesh.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });

        this.scene.add(this.mesh);

        this.boundingBox = new THREE.Box3().setFromObject(this.mesh);

        this.targetQuaternion = new THREE.Quaternion().copy(this.mesh.quaternion);
    }

    setInitialPosition(position, layerIndex = 0) {
      if (this.mesh) {
        this.mesh.position.set(position, this.layerBases[layerIndex], 0);
        this.targetLayer = layerIndex;
      }
    }


    startMovement() {
        if (!this.movementActive) {
            this.upOneLayer();
            this.movementActive = true;
        }
    }

    stopMovement() {
      if (this.movementActive) {
        this.downOneLayer();  
        this.movementActive = false;
      }
    }

    upOneLayer() {
        if (this.targetLayer < this.layerBases.length - 1) {
            this.targetLayer++;
            this.movingVertically = true;
            this.verticalTimer = 0;
            this.startY = this.mesh.position.y;
            this.endY = this.layerBases[this.targetLayer];
        }
    }

    downOneLayer() {
      if (this.targetLayer > 0) {
          this.targetLayer--;
          this.movingVertically = true;
          this.verticalTimer = 0;
          this.startY = this.mesh.position.y;
          this.endY = this.layerBases[this.targetLayer];
      }
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
        }else if (!this.movementActive){ return; 
        }else {
            if (this.waypoints.length === 0) return;

            

            const target = this.waypoints[this.currentWaypoint];
            const direction = new THREE.Vector3().subVectors(target, this.mesh.position);
            direction.y = 0; 
            const distance = direction.length();

            if (distance < 1) { 
                this.currentWaypoint = (this.currentWaypoint + 1) % this.waypoints.length;
                return;
            }

            direction.normalize();
            this.mesh.position.addScaledVector(direction, this.speed * deltaTime);

            if (direction.lengthSq() > 0.0001) {
                const angle = Math.atan2(direction.z, direction.x);
                const targetEuler = new THREE.Euler(0, angle, 0);
                const targetQuat = new THREE.Quaternion().setFromEuler(targetEuler);
                this.mesh.quaternion.slerp(targetQuat, 0.1); 
            }
        }

        this.boundingBox.setFromObject(this.mesh);
        const center = this.boundingBox.getCenter(new THREE.Vector3());
        const size = this.boundingBox.getSize(new THREE.Vector3());
        const reductionFactor = 0.8;
        size.multiplyScalar(reductionFactor);
        this.boundingBox.setFromCenterAndSize(center, size);
    }

    get Position() {
        return this.mesh ? this.mesh.position.clone() : new THREE.Vector3();
    }

    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh = null;
        }
    }
}

export default AIBalloon;
