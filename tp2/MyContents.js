import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {GraphLoader} from './GraphLoader.js';
import {ObjectCreator} from './ObjectCreator.js';
import { MaterialsLoader } from './MaterialsLoader.js';

/**
 * This class contains the contents of our application.
 */
class MyContents {
    /**
     * Constructs the object.
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app; 
        this.axis = null; 

        this.sceneGraph = null; 
        this.objectCreator = null; 

        
        this.reader = new MyFileReader(this.onSceneLoaded.bind(this));
        this.reader.open("scenes/fcporto/scene.json");
    }

    /**
     * Initializes the contents.
     */
    init() {
        if (this.axis === null) {
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }
    }

    /**
     * Called when the scene JSON file load is completed.
     * @param {Object} data JSON com toda a estrutura da cena
     */
    onSceneLoaded(data) {
        console.info("YASF loaded. Processing scene graph...");
        if (data && data.yasf && data.yasf.graph) {
            const graphLoader = new GraphLoader(this.app);
            graphLoader.read(data.yasf.graph);
    
            const materialsLoader = new MaterialsLoader(data.yasf.materials, data.yasf.textures);
            console.log(materialsLoader);
            const objectCreator = new ObjectCreator(this.app, graphLoader, materialsLoader);
    
            objectCreator.createObjects();
            console.info("Scene successfully built.");
        } else {
            console.error("Estrutura inválida ou o grafo está ausente no arquivo carregado.");
        }
    }

    /**
     * Atualiza a cena a cada frame.
     */
    update() {
    }
}

export { MyContents };
