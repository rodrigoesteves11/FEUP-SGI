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

        // Folder for Lamp controls
        const tallLampFolder = this.datgui.addFolder('Tall Lamp Controls');
        tallLampFolder.add(this.app.tallLamp, 'turnOffLight').name('Toggle Lamp');
        tallLampFolder.add(this.app.tallLamp, 'toggleHelper').name('Toggle Helper');
        tallLampFolder.open();

        // Folder for Lamp controls
        const lampFolder = this.datgui.addFolder('Lamp Controls');
        lampFolder.add(this.app.lampLight, 'turnOffLight').name('Toggle Lamp');
        lampFolder.add(this.app.lampLight, 'toggleHelper').name('Toggle Helper');
        lampFolder.open();

        // Folder for Lamp controls
        const donutLightFolder = this.datgui.addFolder('Donut Light Controls');
        donutLightFolder.add(this.app.donutLight, 'turnOffLight').name('Toggle Spot Light');
        donutLightFolder.add(this.app.donutLight, 'toggleHelper').name('Toggle Helper');
        donutLightFolder.open();

        // Folder for Curtain controls
        const curtainFolder = this.datgui.addFolder('Curtain Controls');
        curtainFolder.add(this.app.openCloseCurtains, 'toggleCurtains').name('Open/Close Curtains');
        curtainFolder.open();
    }
}

export { MyGuiInterface };