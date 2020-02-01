////// Here, we initialize the pixi application
var pixiRoot = new PIXI.Application(800, 600, { backgroundColor : 0x6BACDE });

// add the renderer view element to the DOM
document.body.appendChild(pixiRoot.view);

////// Here, we create our traviso instance and add on top of pixi

// engine-instance configuration object
var instanceConfig = {
    mapDataPath: "/static/map/mapData.json", // the path to the json file that defines map data, required
    assetsToLoad: [ // array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
        "/static/assets/t1.png", 
        "/static/assets/grass.png", 
        "/static/assets/ground.png", 
        "/static/assets/box.png",
        "/static/assets/btn_zoomIn.png",
        "/static/assets/btn_zoomOut.png",
        "/static/assets/btn_centralize.png",
        "/static/assets/btn_centralizeToObject.png",
        "/static/assets/btn_focusToObject.png",
    ], 
    tileHeight: 33,
    isoAngle: 27.27676,
    engineInstanceReadyCallback : onEngineInstanceReady,
};

var engine = TRAVISO.getEngineInstance(instanceConfig);

// this method will be called when the engine is ready
function onEngineInstanceReady()
{
    pixiRoot.stage.addChild(engine);
    
    // create buttons
    var btnZoomIn = new PIXI.Sprite.fromFrame("/static/assets/btn_zoomIn.png");
    pixiRoot.stage.addChild(btnZoomIn);
    
    var btnZoomOut = new PIXI.Sprite.fromFrame("/static/assets/btn_zoomOut.png");
    pixiRoot.stage.addChild(btnZoomOut);
    
    var btnCentralize = new PIXI.Sprite.fromFrame("/static/assets/btn_centralize.png");
    pixiRoot.stage.addChild(btnCentralize);
    
    var btnCentralizeToObject = new PIXI.Sprite.fromFrame("/static/assets/btn_centralizeToObject.png");
    pixiRoot.stage.addChild(btnCentralizeToObject);
    
    var btnFocusMapToObject = new PIXI.Sprite.fromFrame("/static/assets/btn_focusToObject.png");
    pixiRoot.stage.addChild(btnFocusMapToObject);
    
    // set positions
    btnZoomIn.position.x = 8;
    btnZoomOut.position.x = btnZoomIn.position.x + btnZoomIn.width + 8;
    btnCentralize.position.x = btnZoomOut.position.x + btnZoomOut.width + 8;
    btnCentralizeToObject.position.x = btnCentralize.position.x + btnCentralize.width + 8;
    btnFocusMapToObject.position.x = btnCentralizeToObject.position.x + btnCentralizeToObject.width + 8;
    
    btnZoomIn.interactive = btnZoomIn.buttonMode = true;
    btnZoomOut.interactive = btnZoomOut.buttonMode = true;
    btnCentralize.interactive = btnCentralize.buttonMode = true;
    btnCentralizeToObject.interactive = btnCentralizeToObject.buttonMode = true;
    btnFocusMapToObject.interactive = btnFocusMapToObject.buttonMode = true;
    
    // add click callbacks
    btnZoomIn.click = btnZoomIn.tap = function(data)
    {
        engine.zoomIn();
    };
    
    btnZoomOut.click = btnZoomOut.tap = function(data)
    {
        engine.zoomOut();
    };
    
    btnCentralize.click = btnCentralize.tap = function(data)
    {
        engine.centralizeToCurrentExternalCenter();
    };
    
    btnCentralizeToObject.click = btnCentralizeToObject.tap = function(data)
    {
        engine.centralizeToObject(engine.getCurrentControllable());
    };
    
    btnFocusMapToObject.click = btnFocusMapToObject.tap = function(data)
    {
        engine.focusMapToObject(engine.getCurrentControllable());
    };
}
