import * as THREE from "three";
import { MyApp } from './MyApp.js';
import { MyNurbsBuilder } from "./utils/MyNurbsBuilder.js";

/**
 * A TV is a 3D object that represents a photo of scene creator.
 */
class Newspaper extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";
    
    this.nurbsBuilder = new MyNurbsBuilder();
    this.buildNewspaper();
  }

  buildNewspaper(){
    const controlPoints = [
		[
		  [0, 0.1, 0, 1],         
		  [0.5, 0.1, 0, 1],       
		  [1, 0.1, 0, 1],         
		  [1.5, 0.1, 0, 1]        
		],
		[
		  [0, 0.3, 0.5, 1],       
		  [0.5, 0.3, 0.5, 1],     
		  [1, 0.3, 0.5, 1],		  
		  [1.5, 0.3, 0.5, 1]      
		],
		[
		  [0, 0.1, 0.7, 1],        
		  [0.5, 0.1, 0.7, 1],      
		  [1, 0.1, 0.7, 1],        
		  [1.5, 0.1, 0.7, 1]       
		]
	  ];
	
	const textureLoader = new THREE.TextureLoader();
	const lefttexture = textureLoader.load('./textures/newspaper/page1.1.jpg');
	lefttexture.center.set(0.5, 0.5);
	lefttexture.rotation = Math.PI;
  
	const leftSideMaterial = new THREE.MeshStandardMaterial({
		map: lefttexture,               
		side: THREE.DoubleSide,
		metalness: 0.3,
		roughness: 0.8
	});

	const righttexture = textureLoader.load('./textures/newspaper/page2.jpg'); 
	const rightSideMaterial = new THREE.MeshStandardMaterial({
		map: righttexture,
		side: THREE.DoubleSide,
		metalness: 0.3,
		roughness: 0.8
	});
	  
    const geometry = this.nurbsBuilder.build(controlPoints, 2, 2, 32, 32, leftSideMaterial);

	const numPages = 5; 
    const pageSpacing = 0.01; 
    const pageRotation = 0.01; 

    // Left side
    for (let i = 0; i < numPages; i++) {
      const leftPage = new THREE.Mesh(geometry, leftSideMaterial);
      leftPage.position.set(0, pageRotation * i, i * pageSpacing);
	  leftPage.castShadow = true;
	  leftPage.receiveShadow = true;
      this.add(leftPage);
    }

    // Right side
    for (let i = 0; i < numPages; i++) {
      const rightPage = new THREE.Mesh(geometry, rightSideMaterial);
      rightPage.position.set(1, pageRotation * i, i * pageSpacing);
	  rightPage.rotation.y = Math.PI
	  rightPage.castShadow = true;
	  rightPage.receiveShadow = true;
      this.add(rightPage);
    }
  }
}

Newspaper.prototype.isGroup = true;

export { Newspaper };
