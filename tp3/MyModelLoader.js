import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class MyModelLoader {
    constructor() {
        this.modelUrls = [
            'models/blue.glb',
            'models/pink.glb',
        ];
        this.loadedModels = new Map();

        
        this.loadModels();
    }

    async loadModels() {
        const loader = new GLTFLoader();
        const loadPromises = this.modelUrls.map(async (url) => {
            try {
                const model = await loader.loadAsync(url);
                this.loadedModels.set(url, model.scene);
            } catch (err) {
                console.error(`Erro ao carregar o modelo: ${url}`, err);
            }
        });

        try {
            await Promise.all(loadPromises); 
        } catch (err) {
            console.error('Erro ao carregar os modelos:', err);
        }
    }

    getModel(url, targetSize = 1) {
        if (!this.loadedModels.has(url)) {
            console.error(`Modelo não encontrado: ${url}`);
            return null;
        }

        const model = this.loadedModels.get(url).clone(); 
        this.resizeModel(model, targetSize);
        return model;
    }

    resizeModel(model, targetSize) {
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);

        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = targetSize / maxDimension;

        model.scale.set(scale, scale, scale);
    }

    getAllModelsresized(targetSize) {
        const models = [];
        this.loadedModels.forEach((model) => {
            const modelClone = model.clone();
            this.resizeModel(modelClone, targetSize);
            models.push(modelClone);
        });

        return models;

        //verificar
    }
}

export default MyModelLoader;
