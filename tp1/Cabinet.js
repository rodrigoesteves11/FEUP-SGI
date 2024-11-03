import * as THREE from "three";
import { MyApp } from "./MyApp.js";

/**
 * A Cabinet is a 3D object that represents a cabinet.
 */
class Cabinet extends THREE.Object3D {
  /**
    
     */
  constructor(app) {
    super();
    this.app = app;
    this.type = "Group";
    this.gap = 0.03;
    const textureLoader = new THREE.TextureLoader();

    
    const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x528ebf, side: THREE.DoubleSide, roughness: 0.8 });
    const purpleMaterial = new THREE.MeshStandardMaterial({ color: 0x9b699e, side: THREE.DoubleSide, roughness: 0.8 });



    //Bottom, Left, Right, Back basic geometry atributtes
    this.baseWidth = 0.2;
    this.baseHeight = 1.6;
    this.baseDepth = 1.6;

    // Bottom
    this.bottomHeight = 1.8;
    const BottomGeometry = new THREE.BoxGeometry(
      this.baseWidth,
      this.bottomHeight,
      this.baseDepth
    );
    const Bottom = new THREE.Mesh(BottomGeometry, purpleMaterial);
    Bottom.rotateZ(Math.PI / 2);
    Bottom.position.set(0, 0, 0); // Ajustar posição do Bottom
    Bottom.castShadow = true;
    Bottom.receiveShadow = true;
    this.add(Bottom);

    // Left side
    const Left = new THREE.Mesh(
      new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth),
      purpleMaterial
    );
    Left.position.set(
      -this.bottomHeight / 2,
      this.baseHeight / 2 - this.baseWidth / 2,
      0
    );
    Left.rotation.y = Math.PI;
    Left.castShadow = true;
    Left.receiveShadow = true;
    this.add(Left);

    // Right side
    const Right = new THREE.Mesh(
      new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth),
      purpleMaterial
    );
    Right.position.set(
      this.bottomHeight / 2,
      this.baseHeight / 2 - this.baseWidth / 2,
      0
    );
    Right.rotation.y = Math.PI;
    Right.castShadow = true;
    Right.receiveShadow = true;
    this.add(Right);

    // Back side
    const Back = new THREE.Mesh(
      new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDepth),
      purpleMaterial
    );
    Back.position.set(
      0,
      this.baseHeight / 2 - this.baseWidth / 2,
      -this.baseDepth / 2 + this.baseWidth / 2
    );
    Back.rotateY(Math.PI / 2);
    Back.castShadow = true;
    Back.receiveShadow = true;
    this.add(Back);

    // Top side of the cabinet
    this.topWidth = 0.2;
    this.topHeight = 2.2;
    this.topDepth = 1.9;
    
    const TopGeometry = new THREE.BoxGeometry(
      this.topWidth,
      this.topHeight,
      this.topDepth
    );
    const Top = new THREE.Mesh(TopGeometry, purpleMaterial);
    Top.position.set(0, this.baseHeight, 0);
    Top.rotation.z = Math.PI / 2;
    Top.castShadow = true;
    Top.receiveShadow = true;
    
    this.add(Top);

    // Inside of the cabinet
    this.baseW = 0.2;
    this.baseH = this.bottomHeight - this.baseW ;
    this.baseD = 1.6;

    const dGeometry = new THREE.BoxGeometry(this.baseW, this.baseH, this.baseD);

    const d1 = new THREE.Mesh(dGeometry, purpleMaterial);
    d1.rotateZ(Math.PI / 2);
    d1.position.set(0, this.baseHeight / 2 + 0.2, 0);
    d1.castShadow = true;
    d1.receiveShadow = true;
    this.add(d1);
    
    const d2 = new THREE.Mesh(dGeometry, purpleMaterial);
    d2.rotateZ(Math.PI / 2);
    d2.position.set(0, this.baseHeight - 0.1, 0);
    d2.castShadow = true;
    d2.receiveShadow = true;
    this.add(d2);

    //Drawer
    this.drawerWidth = 0.29;
    this.drawerHeight = this.bottomHeight - this.baseW - 0.01;
    this.drawerDepth = 1.6;
    const DrawerGeometry = new THREE.BoxGeometry(
      this.drawerWidth,
      this.drawerHeight,
      this.drawerDepth
    );
    const Drawer = new THREE.Mesh(DrawerGeometry, purpleMaterial);
    Drawer.position.set(0, this.baseHeight - 0.35, 0);
    Drawer.rotation.z = Math.PI / 2;
    Drawer.castShadow = true;
    Drawer.receiveShadow = true;
    this.add(Drawer);

    //Handle
    const knobGeometry = new THREE.SphereGeometry(0.06, 32, 32);
    const knobMesh = new THREE.Mesh(knobGeometry, blueMaterial);
    knobMesh.position.set(0,this.baseHeight - 0.35 , 1.6 / 2); // Ajustar posição para a frente
    knobMesh.castShadow = true;
    knobMesh.receiveShadow = true;
    this.add(knobMesh);

    //Bottom Drawer Cover
    this.drawerCoverWidth = 1.6;
    this.drawerCoverHeight = 0.2;

    const DrawerCoverGeometry = new THREE.PlaneGeometry(
      this.drawerCoverWidth,
      this.drawerCoverHeight
    );
    const DrawerCover = new THREE.Mesh(DrawerCoverGeometry, blueMaterial);
    DrawerCover.position.set(0, (this.baseHeight / 2 ), 1.6/2);
    DrawerCover.castShadow = true;
    DrawerCover.receiveShadow = true;
    this.add(DrawerCover);

    //4 legs boxGeometry
    const legOffsetX = this.bottomHeight / 2; // metade da altura do bottom para definir os cantos no eixo X
    const legOffsetZ = this.baseDepth / 2; // metade da profundidade do bottom para o eixo Z

    // Geometria das pernas
    const legWidth = 0.2;
    const legHeight = 0.2;
    const legDepth = 0.2;
    const legGeometry = new THREE.BoxGeometry(legWidth, legHeight, legDepth);

    // Ajustar a posição das pernas para os cantos da base (Bottom)
    const leg1 = new THREE.Mesh(legGeometry, purpleMaterial);
    leg1.position.set(-legOffsetX, -legHeight , -legOffsetZ + legWidth / 2); // Canto inferior esquerdo
    leg1.castShadow = true;
    leg1.receiveShadow = true;
    this.add(leg1);

    const leg2 = new THREE.Mesh(legGeometry, purpleMaterial);
    leg2.position.set(-legOffsetX, -legHeight , legOffsetZ - legWidth / 2); // Canto superior esquerdo
    leg2.castShadow = true;
    leg2.receiveShadow = true;
    this.add(leg2);

    const leg3 = new THREE.Mesh(legGeometry, purpleMaterial);
    leg3.position.set(legOffsetX, -legHeight , -legOffsetZ + legWidth / 2); // Canto inferior direito
    leg3.castShadow = true;
    leg3.receiveShadow = true;
    this.add(leg3);

    const leg4 = new THREE.Mesh(legGeometry, purpleMaterial);
    leg4.position.set(legOffsetX, -legHeight , legOffsetZ - legWidth / 2); // Canto superior direito
    leg4.castShadow = true;
    leg4.receiveShadow = true;
    this.add(leg4);



    //Books (semi-circle cylinder and box)

    // Material para os livros
    const bookMaterial1 = new THREE.MeshStandardMaterial({ color: 0xf5872b }); 
    const bookMaterial2 = new THREE.MeshStandardMaterial({ color: 0xa5c4e9 }); 
    const bookMaterial3 = new THREE.MeshStandardMaterial({ color: 0xd9d3e8 }); 

    // Parâmetros dos livros
    const bookWidth = 0.25;  
    const bookHeight = 0.8; 
    const bookDepth = 0.6; 

    // Geometrias comuns para todos os livros
    const spineGeometry = new THREE.CylinderGeometry(bookWidth / 2, bookWidth / 2, bookHeight, 32, 1, false);
    const bodyGeometry = new THREE.BoxGeometry(bookWidth,bookHeight , bookDepth);

    // Criação do primeiro livro
    const spine1 = new THREE.Mesh(spineGeometry, bookMaterial1);
    spine1.rotation.z = -0.3 ; 
    spine1.position.set(0.5, 0.5, bookDepth / 2 + 0.1);
    spine1.castShadow = true;
    spine1.receiveShadow = true;
    this.add(spine1);

    const body1 = new THREE.Mesh(bodyGeometry, bookMaterial1);
    body1.position.set(0.5, 0.5, 0.1);
    body1.rotation.z = -0.3 ; 
    body1.castShadow = true;
    body1.receiveShadow = true;
    this.add(body1);

    // Criação do segundo livro
    const spine2 = new THREE.Mesh(spineGeometry, bookMaterial2);
    spine2.rotation.z = -0.3 ;
    spine2.position.set(0.25, 0.5, bookDepth / 2 + 0.15);
    spine2.castShadow = true;
    spine2.receiveShadow = true;
    this.add(spine2);

    const body2 = new THREE.Mesh(bodyGeometry, bookMaterial2);
    body2.position.set(0.25, 0.5, 0.15);
    body2.rotation.z = -0.3 ;
    body2.castShadow = true;
    body2.receiveShadow = true;
    this.add(body2);

    // Criação do terceiro livro
    const spine3 = new THREE.Mesh(spineGeometry, bookMaterial3);
    spine3.rotation.z = -0.3 ;
    spine3.position.set(0, 0.5, bookDepth / 2 + 0.2);
    spine3.castShadow = true;
    spine3.receiveShadow = true;
    this.add(spine3);

    const body3 = new THREE.Mesh(bodyGeometry, bookMaterial3);
    body3.position.set(0, 0.5, 0.2);
    body3.rotation.z = -0.3 ;
    body3.castShadow = true;
    body3.receiveShadow = true;
    this.add(body3);

    


  }
}

Cabinet.prototype.isGroup = true;

export { Cabinet };
