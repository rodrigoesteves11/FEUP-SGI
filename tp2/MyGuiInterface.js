import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';
/**
 * This class customizes the GUI interface for the app
 */
class MyGuiInterface {
    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app;
        this.app.gui = this; 
        this.datgui = new GUI();
        this.contents = null;

        this.guiParams = {
            camera: null
        };

        this.cameraController = null;
    }

    setContents(contents) {
        this.contents = contents;
    }


    init() {
    }

    /**
     * Updates the camera list in the GUI.
     */
    updateCameraList() {
        const cameraNames = Object.keys(this.app.cameras);

        if (cameraNames.length > 0) {
            this.guiParams.camera = this.app.activeCameraName;

            this.cameraController = this.datgui.add(this.guiParams, 'camera', cameraNames)
                .name('Câmera')
                .onChange((value) => {
                    this.app.setActiveCamera(value);
                });
        } else {
            console.warn("Nenhuma câmera disponível para adicionar ao GUI.");
        }
    }
}

export { MyGuiInterface };
