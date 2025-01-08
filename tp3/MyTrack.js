// MyTrack.js
import * as THREE from 'three';

class MyTrack extends THREE.Group {
    constructor(scene) {
        super();

        // Atribuições iniciais
        this.scene = scene;
        this.segments = 50;
        this.width = 15;
        this.textureRepeat = 5;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = false;
        this.closedCurve = true; 

        
        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),      
            new THREE.Vector3(0, 0, 60),
            new THREE.Vector3(0, 0, 65),
            new THREE.Vector3(80, 0, 65),
            new THREE.Vector3(80, 0, 25),
            new THREE.Vector3(40, 0, 20),
            new THREE.Vector3(40, 0, -20),
            new THREE.Vector3(80, 0, -25),
            new THREE.Vector3(80, 0, -65),
            new THREE.Vector3(0, 0, -65),
            new THREE.Vector3(0, 0, -60),
            new THREE.Vector3(0, 0, 0) 
        ], this.closedCurve);

        this.trackGroup = new THREE.Group();
    }

    /**
     * Inicializa o conteúdo
     */
    init() {
        this.buildCurve();
        this.scene.add(this.trackGroup);
    }

    /**
     * Cria os materiais e texturas para a curva
     */
    createCurveMaterialsTextures() {
        const texture = new THREE.TextureLoader().load("./scenes/demo/textures/road.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(this.textureRepeat, this.textureRepeat);

        this.material = new THREE.MeshPhongMaterial({ 
            map: texture,
            //shininess: 0,
         });
        this.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            opacity: 0.3,
            wireframe: true,
            transparent: true,
        });

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    /**
     * Cria os objetos da curva: mesh, wireframe e linha
     */
    createCurveObjects() {
        let geometry = new THREE.TubeGeometry(
            this.path,
            this.segments,
            this.width,
            200,
            this.closedCurve
        );
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.castShadow = true; 
        this.mesh.receiveShadow = true; 

        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        let points = this.path.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);

        this.line = new THREE.Line(bGeometry, this.lineMaterial);

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;

        this.trackGroup.add(this.mesh);

        this.trackGroup.scale.set(1, 0.001, 1);
        this.trackGroup.position.set(0, 0.1, 0);
        
    }

    test()  {
        const initialPosition = 7.5;
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
    
        const points = this.customPoints.getPoints(1000);
        const points2 = this.customPoints.getPoints(22);
        
        const sphereGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        points2.forEach(point => {
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.copy(point);
            sphere.position.y = 0.5; 
            this.scene.add(sphere);
        });
    
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const curveObject = new THREE.Line(geometry, material);
        curveObject.position.y = 0.5;
        this.scene.add(curveObject);
    }
    
    /**
     * Constrói a curva da pista
     */
    buildCurve() {
        this.createCurveMaterialsTextures();
        this.createCurveObjects();
        //this.test();
    }
}

export { MyTrack };
