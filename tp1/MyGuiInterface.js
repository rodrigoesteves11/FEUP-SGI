import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective','Perspective2', 'Left', 'Top', 'Front', 'Back', 'Right'] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.open()

         // Folder for TV controls
         const tvFolder = this.datgui.addFolder('TV Controls');
         tvFolder.add(this.app.tv, 'changeChannel').name('Change Channel');
         tvFolder.open();
    }
}

export { MyGuiInterface };