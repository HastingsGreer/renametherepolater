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
        "/static/assets/ggj_flowergirl_forward.png",
        "/static/assets/ggj_flowergirl_backward.png",
        "/static/assets/ggj_lumberjack_forward.png",
        "/static/assets/ggj_lumberjack_backward.png",
        "/static/assets/ggj_therapist_forward.png",
        "/static/assets/ggj_therapist_backward.png",
    ], 
    tileHeight: 33,
    isoAngle: 27.27676,
    engineInstanceReadyCallback : onEngineInstanceReady,
    objectSelectCallback: onObjectSelect,
    tileSelectCallback : onTileSelect,
    dontAutoMoveToTile : true,
    highlightTargetTile : false,
};

var engine = TRAVISO.getEngineInstance(instanceConfig);

var unitActions = [
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}]
];

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

function onObjectSelect(obj) {
    if(obj.type > 0 && obj.type < 4) {
        var prevUnit = engine.getCurrentControllable();
        if(prevUnit !== obj) {
            if(prevUnit) {
                var prevAction = unitActions[prevUnit.mapPos.r][prevUnit.mapPos.c];
                if (Object.entries(prevAction).length !== 0 && prevAction.constructor === Object) {
                    if(prevAction.move) {
                        engine.getTileAtRowAndColumn(prevAction.move.x, prevAction.move.y).setHighlighted(false, false);
                    }
                }
            }

            engine.setCurrentControllable(obj);
            console.log(obj.mapPos);
            var existingAction = unitActions[obj.mapPos.r][obj.mapPos.c];
            console.log(existingAction);
            if (Object.entries(existingAction).length !== 0 && existingAction.constructor === Object) {
            } else {
                console.log("New action");
                existingAction = {
                    "move" : {
                        "x": obj.mapPos.r,
                        "y": obj.mapPos.c,
                    },
                    "action" : {},
                }
                unitActions[obj.mapPos.r][obj.mapPos.c] = existingAction;
                
            }
            
            console.log(engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y));
            engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(true, false);
            engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor = 8443903;
            engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillAlpha = 0.8;
        } else {
            updateUnitMove(prevUnit.mapPos.r, prevUnit.mapPos.c, prevUnit.mapPos.r, prevUnit.mapPos.c);
        }
    }
}

function onTileSelect(x, y) {
    console.log(x, y);

    var currentUnit = engine.getCurrentControllable();
    
    console.log(currentUnit);
    if(currentUnit) {
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y);
    }

    console.log(unitActions);

    // engine.getTileAtRowAndColumn(x, y).setHighlighted(true, false);
    // setTimeout(function() {engine.getTileAtRowAndColumn(x, y).setHighlighted(false, false);}, 1000);

    // engine.getTileAtRowAndColumn(x, y).type = 1;
    // console.log(engine.getTileAtRowAndColumn(x, y).type);
    // console.log(engine.mapSizeC)
    // engine.mapSizeC += 1;
    // console.log(engine.mapSizeC)
    // engine.getTileAtRowAndColumn(0, engine.mapSizeC - 1);
    // console.log(engine.getTileAtRowAndColumn(0, engine.mapSizeC - 1));
    // engine.mapSizeC -= 1;
    // console.log(engine.mapSizeC)
    // engine.showHideGroundLayer(false);
    // engine.showHideGroundLayer(true);

    // engine.getTileAtRowAndColumn(x, y);
}

function updateUnitMove(unitX, unitY, moveX, moveY) {
    var existingAction = unitActions[unitX][unitY];
        if (existingAction && Object.entries(existingAction).length !== 0 && existingAction.constructor === Object 
            && existingAction.move && (existingAction.move.x != moveX || existingAction.move.y != moveY)) {
            engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(false, false);
        }
        if (!existingAction) existingAction = {};
        existingAction.move = {
            "x" : moveX,
            "y" : moveY,
        }
        unitActions[unitX][unitY] = existingAction;
        engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(true, false);
}