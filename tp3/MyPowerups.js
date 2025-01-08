import * as THREE from 'three';

class MyPowerups {
 
  constructor(coordinates, scene) {
    this.coordinates = coordinates; 
    this.scene = scene; 
    this.powerups = []; 
    this.boundingSpheres = []; 
  }

  generatePowerups() {
    this.coordinates.forEach((coord) => {
      
      const pyramidGroup = new THREE.Group();
      
      const pyramidGeometry = new THREE.ConeGeometry(
        2, 
        2, 
        4 
      );

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0, 1, 0),
        metalness: 0.5,
        roughness: 0.8,
      });

      const regularPyramid = new THREE.Mesh(pyramidGeometry, material);
      regularPyramid.position.set(0, 4, 0);
      regularPyramid.castShadow = true;
      regularPyramid.receiveShadow = true;

      const upsideDownPyramid = new THREE.Mesh(pyramidGeometry, material);
      upsideDownPyramid.position.set(0, 2, 0); 
      upsideDownPyramid.rotation.set(Math.PI, 0, 0); 
      upsideDownPyramid.castShadow = true;
      upsideDownPyramid.receiveShadow = true;

      pyramidGroup.add(regularPyramid);
      pyramidGroup.add(upsideDownPyramid);

      pyramidGroup.position.set(coord.x, coord.y, coord.z);

      regularPyramid.castShadow = true;
      regularPyramid.receiveShadow = true;
      upsideDownPyramid.castShadow = true;
      upsideDownPyramid.receiveShadow = true;

      const boundingBox = new THREE.Box3().setFromObject(pyramidGroup);
      const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());

      boundingSphere.radius = 1.9;
      this.boundingSpheres.push(boundingSphere);

      // Add a helper for the bounding sphere
      // const sphereHelper = new THREE.Mesh(
      //   new THREE.SphereGeometry(boundingSphere.radius, 16, 16),
      //   new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
      // );
      // sphereHelper.position.copy(boundingSphere.center);
      // this.scene.add(sphereHelper);

      // Add the group to the scene
      this.scene.add(pyramidGroup);

      // Store the group in the powerups array
      this.powerups.push(pyramidGroup);
    });
  }
}

export { MyPowerups };
