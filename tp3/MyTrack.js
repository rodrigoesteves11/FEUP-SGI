import * as THREE from 'three';

class MyTrack extends THREE.Group
{
    constructor(scene) {
      super();
    
        //Curve related attributes
        this.scene = scene;
        this.segments = 100;
        this.width = 15;
        this.textureRepeat = 1;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = false;
        this.closedCurve = false;
    
        this.path = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-7, 0, 0),
          new THREE.Vector3(-4, 0, 76),
          new THREE.Vector3(0, 0, 80),
          new THREE.Vector3(60, 0, 40),
          new THREE.Vector3(40, 0, 0),
          new THREE.Vector3(60, 0, -40),
          new THREE.Vector3(0, 0, -80),
          new THREE.Vector3(-8, 0, -76),
          new THREE.Vector3(-7, 0, 0)
        ]);

        this.trackGroup = new THREE.Group();
      }

       /**
   * initializes the contents
   */
  init() {
    this.buildCurve();
    this.scene.add(this.trackGroup);
  }

  /**
   * Creates the necessary elements for the curve
   */
  buildCurve() {
    this.createCurveMaterialsTextures();
    this.createCurveObjects();
  }

  /**
   * Create materials for the curve elements: the mesh, the line and the wireframe
   */
  createCurveMaterialsTextures() {
    const texture = new THREE.TextureLoader().load("./images/track_texture.jpg");
    texture.wrapS = THREE.RepeatWrapping;

    this.material = new THREE.MeshBasicMaterial({ map: texture });
    this.material.map.repeat.set(3, 3);
    this.material.map.wrapS = THREE.RepeatWrapping;
    this.material.map.wrapT = THREE.RepeatWrapping;

    this.wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      opacity: 0.3,
      wireframe: true,
      transparent: true,
    });

    this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  }

  /**
   * Creates the mesh, the line and the wireframe used to visualize the curve
   */
  createCurveObjects() {
    let geometry = new THREE.TubeGeometry(
      this.path,
      this.segments,
      this.width,
      3 ,
      this.closedCurve
    );
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

    let points = this.path.getPoints(this.segments);
    let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

    // Create the final object to add to the scene
    this.line = new THREE.Line(bGeometry, this.lineMaterial);

    this.mesh.visible = this.showMesh;
    this.wireframe.visible = this.showWireframe;
    this.line.visible = this.showLine;

    this.trackGroup.add(this.mesh);
    this.trackGroup.add(this.wireframe);
    this.trackGroup.add(this.line);

    this.trackGroup.rotateZ(Math.PI);
    this.trackGroup.scale.set(1, 0.2, 1);
    this.trackGroup.position.set(40, 0.2, 1);
  }
}

export { MyTrack };