import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { GraphLoader } from './GraphLoader.js';
import { ObjectCreator } from './ObjectCreator.js';
import { MaterialsLoader } from './MaterialsLoader.js';
import { MyGuiInterface } from './MyGuiInterface.js';

class MyContents {
    constructor(app) {
        this.app = app;
        this.axis = null;
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/demo/SGI_TP2_JSON_T03_G03_V2.json");
        //this.reader.open("scenes/dressrosacolosseum/dressrosacolosseum.json");

        this.objectCreator = null;
    }

    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Load scene graph from JSON.
     */
    onSceneLoaded(data) {
        console.info("YASF loaded. Processing scene graph...");
        if (data && data.yasf) {
            const yasf = data.yasf;

            this.loadGlobals(yasf.globals);
            this.loadCameras(yasf.cameras);

            const graphLoader = new GraphLoader(this.app);
            graphLoader.read(yasf.graph);

            const materialsLoader = new MaterialsLoader(yasf.materials, yasf.textures);
            //console.log(materialsLoader);
            this.objectCreator = new ObjectCreator(this.app, graphLoader, materialsLoader);
            this.objectCreator.createObjects();
            console.log(materialsLoader);
            
            this.createGuiInterface();
            console.info("Scene successfully built.");
        } else {
            console.error("Estrutura inválida ou dados ausentes no arquivo carregado.");
        }
    }

    /**
     * Load globals from JSON.
     */
    loadGlobals(globals) {
        if (!globals) {
            console.warn("Bloco 'globals' ausente.");
            return;
        }
    
        if (globals.background) {
            const bgColor = new THREE.Color(globals.background.r, globals.background.g, globals.background.b);
            this.app.scene.background = bgColor;
        }
    
        if (globals.ambient) {
            const ambientLight = new THREE.AmbientLight(
                new THREE.Color(globals.ambient.r, globals.ambient.g, globals.ambient.b),
                globals.ambient.intensity || 1
            );
            this.app.scene.add(ambientLight);
        }
    
        if (globals.fog) {
            const fogColor = new THREE.Color(globals.fog.color.r, globals.fog.color.g, globals.fog.color.b);
            this.app.scene.fog = new THREE.Fog(fogColor, globals.fog.near, globals.fog.far);
        }
    
        if (globals.skybox) {
            const skybox = globals.skybox;
        
            const loader = new THREE.TextureLoader();
            const texturePaths = [
                skybox.right,
                skybox.left,
                skybox.up,
                skybox.down,
                skybox.front,
                skybox.back
            ];
        
            const materials = texturePaths.map((texturePath) => {
                const texture = loader.load(texturePath);
        
                return new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.BackSide,
                    emissive: new THREE.Color(skybox.emissive.r, skybox.emissive.g, skybox.emissive.b),
                    emissiveIntensity: skybox.intensity
                });
            });
        
            const skyboxSize = new THREE.Vector3(skybox.size.x, skybox.size.y, skybox.size.z);
            const skyboxGeometry = new THREE.BoxGeometry(skyboxSize.x, skyboxSize.y, skyboxSize.z);
            const skyboxMesh = new THREE.Mesh(skyboxGeometry, materials);
        
            skyboxMesh.position.set(skybox.center.x, skybox.center.y, skybox.center.z);
        
            this.app.scene.add(skyboxMesh);
        }
        
    }
    

    /**
     * Load cameras from JSON.
     */
    loadCameras(cameras) {
        const initialCamera = cameras.initial;
        this.app.cameras = {};

        Object.keys(cameras).forEach((cameraId) => {
            if (cameraId === "initial") return;

            const cameraData = cameras[cameraId];
            let camera = null;

            if (cameraData.type === "perspective") {
                camera = new THREE.PerspectiveCamera(
                    cameraData.angle,
                    window.innerWidth / window.innerHeight,
                    cameraData.near,
                    cameraData.far
                );
            } else if (cameraData.type === "orthogonal") {
                let aspect = window.innerWidth / window.innerHeight;
                camera = new THREE.OrthographicCamera(
                    cameraData.left * aspect,
                    cameraData.right * aspect,
                    cameraData.top,
                    cameraData.bottom,
                    cameraData.near,
                    cameraData.far
                );
            }
         
            camera.position.set(cameraData.location.x, cameraData.location.y, cameraData.location.z);
            camera.lookAt(new THREE.Vector3(cameraData.target.x, cameraData.target.y, cameraData.target.z));

            this.app.cameras[cameraId] = camera;

        });

        this.app.setActiveCamera(initialCamera);

        delete this.app.cameras["Perspective"];
    }

    createGuiInterface() {
        let gui = new MyGuiInterface(this.app);
        gui.setContents(this);
        this.app.setGui(gui);
        gui.init();
    }

    updatePolygonWireframe(wireframe) {
        this.objectCreator.polygons.forEach(polygon => {
            console.log(polygon);
            polygon.material.wireframe = wireframe;
        });
    }
    

    update() {}
}

export { MyContents };


