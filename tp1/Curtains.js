import * as THREE from "three";
import { MyNurbsBuilder } from "./utils/MyNurbsBuilder.js"; // Assuming you have the MyNurbsBuilder class here

class Curtains extends THREE.Object3D {
    constructor(app) {
        super();
        this.app = app;
        this.type = "Group";
        this.init();
    }

    init() {
        const controlPoints = this.createControlPoints();
        const degree1 = 3; // Degree in U direction
        const degree2 = 3; // Degree in V direction
        const samples1 = 50; // Sample points in U direction
        const samples2 = 50; // Sample points in V direction
        const material = new THREE.MeshBasicMaterial({
            color: 0xE3EC62,
            side: THREE.DoubleSide,
            opacity: 0.80,
            transparent: true // Allow transparency to see the wave effect better
        });
        // Dimensions
        const rodRadius = 0.1;
        const rodLength = 9;
        const curtainHeight = 8.5;

        // Right Curtain
        const nurbsBuilder = new MyNurbsBuilder(this.app);
        const geometry = nurbsBuilder.build(controlPoints, degree1, degree2, samples1, samples2, material);
        const rightCurtain = new THREE.Mesh(geometry, material);
        rightCurtain.rotation.z = -Math.PI / 2;
        rightCurtain.scale.set(2.5, 1, 0.7);
        rightCurtain.position.set(0, curtainHeight, rodLength / 4 - 0.25);
        this.add(rightCurtain);

        // Left Curtain
        const leftCurtain = new THREE.Mesh(geometry, material);
        leftCurtain.rotation.z = -Math.PI / 2;
        leftCurtain.rotation.y = Math.PI;
        leftCurtain.scale.set(2.5, 1, 0.7);
        leftCurtain.position.set(0, curtainHeight, -rodLength / 2 + 2.7);
        this.add(leftCurtain);

        // Curtain rod
        const rodGeometry = new THREE.CylinderGeometry(rodRadius, rodRadius, rodLength, 32);
        const rodMaterial = new THREE.MeshStandardMaterial({ color: 0x800080 });
        const rod = new THREE.Mesh(rodGeometry, rodMaterial);
        rod.rotation.x = Math.PI / 2; // Rotate to make it horizontal along the X-axis
        rod.position.set(0, curtainHeight, 0.05); // Place at the top of the curtains
        this.add(rod);

        // Rod finishers
        const finisherRadius = 0.2;
        const finisherGeometry = new THREE.SphereGeometry(finisherRadius, 16, 16);
        const finisherMaterial = new THREE.MeshStandardMaterial({ color: 0x800080 });

        const leftFinisher = new THREE.Mesh(finisherGeometry, finisherMaterial);
        leftFinisher.position.set(0, curtainHeight, -rodLength / 2);
        this.add(leftFinisher);

        const rightFinisher = new THREE.Mesh(finisherGeometry, finisherMaterial);
        rightFinisher.position.set(0, curtainHeight, rodLength / 2);
        this.add(rightFinisher);

        // Connectors to the wall
        const connectorRadius = 0.05;
        const connectorLength = 0.5;
        const connectorGeometry = new THREE.CylinderGeometry(connectorRadius, connectorRadius, connectorLength, 16);
        const connectorMaterial = new THREE.MeshStandardMaterial({ color: 0x800080 });

        const leftConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        leftConnector.rotation.z = Math.PI / 2; // Rotate to align with the rod
        leftConnector.position.set(-connectorLength/2, curtainHeight, -rodLength / 2);
        this.add(leftConnector);

        const rightConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        rightConnector.rotation.z = Math.PI / 2; // Rotate to align with the rod
        rightConnector.position.set(-connectorLength/2, curtainHeight, rodLength / 2);
        this.add(rightConnector);
    }

    createControlPoints() {
        const points = [];
        const numPointsX = 10; // Number of points along the X axis
        const numPointsZ = 10; // Number of points along the Z axis
        const amplitude = 1; // Amplitude of the wave
        const frequencyX = 5; // Frequency of the wave in X direction
        const frequencyZ = 2; // Frequency of the wave in Z direction

        for (let i = 0; i < numPointsX; i++) {
            const row = [];
            for (let j = 0; j < numPointsZ; j++) {
                const x = (i / (numPointsX - 1)) * 10; // Scale X position
                const z = (j / (numPointsZ - 1)) * 10; // Scale Z position
                // Combine sine waves for harmonic effect
                const y = amplitude * Math.sin(frequencyX * x) * Math.sin(frequencyZ * z); // Wave function
                row.push([x, y, z, 1]); // Control point in homogeneous coordinates
            }
            points.push(row);
        }

        return points;
    }
}

Curtains.prototype.isGroup = true;

export { Curtains };
