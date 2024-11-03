import * as THREE from "three";
import { MyApp } from './MyApp.js';
import { MyNurbsBuilder } from "./utils/MyNurbsBuilder.js";

/**
 * A TV is a 3D object that represents a photo of scene creator.
 */
class Vase extends THREE.Object3D {
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";
    
    this.nurbsBuilder = new MyNurbsBuilder();
    this.buildVase();
  }

  buildVase(){
    const controlPoints =
		[   
			[ 
				[ -0.5,  1.0, 0.0, 1 ],
				[ -0.1,  0.5, 0.0, 1 ],
				[ -1.8, -0.5, 0.0, 1 ],
				[ -0.2, -1.0, 0.0, 	1 ],
			],
			[ 
				[ -0.5,  1.0, 0.667, 1 ],
				[ -0.1,  0.5, 0.133, 1 ],
				[ -1.8, -0.5, 2.400, 1 ],
				[ -0.2, -1.0, 0.266, 1 ],
			],		
			[ 
				[ 0.5,  1.0, 0.667, 1 ],
				[ 0.1,  0.5, 0.133, 1 ],
				[ 1.8, -0.5, 2.400, 1 ],
				[ 0.2, -1.0, 0.266, 1 ],
			],
			[ 
				[ 0.5,  1.0, 0.0, 1 ],
				[ 0.1,  0.5, 0.0, 1 ],
				[ 1.8, -0.5, 0.0, 1 ],
				[ 0.2, -1.0, 0.0, 1 ],
			],
		];
  
    const material = new THREE.MeshStandardMaterial({ color: 0xedda76, side: THREE.DoubleSide,  metalness: 0.3, roughness: 0 });

    const geometry = this.nurbsBuilder.build(controlPoints, 3, 3, 32, 32, material);

    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);
    const mesh2 = new THREE.Mesh(geometry, material);
    mesh2.rotation.y = Math.PI;
    this.add(mesh2);

    //Bottom
    const geometryBottom = new THREE.CircleGeometry(0.22, 32);
    const bottom = new THREE.Mesh(geometryBottom, material);
    bottom.rotation.x = Math.PI / 2;
    bottom.position.set(0, -0.99, 0);
    this.add(bottom);

  }
}

Vase.prototype.isGroup = true;

export { Vase };
