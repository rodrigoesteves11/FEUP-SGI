import * as THREE from 'three';

class MyObstacles {
  
  constructor(coordinates, scene) {
    this.coordinates = coordinates; 
    this.scene = scene; 
    this.obstacles = []; 
    this.boundingSpheres = []; 
  }

  generateObstacles() {
    this.coordinates.forEach((coord) => {
      
      const pyramidGroup = new THREE.Group();

      
      const pyramidGeometry = new THREE.ConeGeometry(
        2, 
        2, 
        4 
      );

      
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(1, 0, 0),
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

      const boundingBox = new THREE.Box3().setFromObject(pyramidGroup);
      const boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());

      boundingSphere.radius = 1.9;
      this.boundingSpheres.push(boundingSphere);

      // // Add a helper for the bounding sphere
      // const sphereHelper = new THREE.Mesh(
      //   new THREE.SphereGeometry(boundingSphere.radius, 16, 16),
      //   new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true })
      // );
      // sphereHelper.position.copy(boundingSphere.center);
      // this.scene.add(sphereHelper);

      this.scene.add(pyramidGroup);

      this.obstacles.push(pyramidGroup);
    });
  }
}

export { MyObstacles };
