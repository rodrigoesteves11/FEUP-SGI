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
        //this.datgui = new GUI();
        this.contents = null;
    }

    setContents(contents) {
        this.contents = contents;
    }


    init() {
        const cameraFolder = this.datgui.addFolder('Camera');
        cameraFolder.add(this.app, 'activeCameraName', Object.keys(this.app.cameras)).name("Active Camera");
        cameraFolder.open()

        const polygonFolder = this.datgui.addFolder('Polygons');
        polygonFolder.add(this.app.contents.objectCreator, 'wireframe').name('Wireframe Mode').onChange((value) => {
                this.contents.updatePolygonWireframe(value);
            });
        polygonFolder.open();
    }

}

export { MyGuiInterface };
