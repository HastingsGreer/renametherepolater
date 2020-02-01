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

const DISABLED = -1;
const SELECT = 0;
const MOVE = 1;
const ACTION = 2;

var selectMode = SELECT;

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
        if (engine.getCurrentControllable()) engine.centralizeToObject(engine.getCurrentControllable());
    };
    
    btnFocusMapToObject.click = btnFocusMapToObject.tap = function(data)
    {
        if (engine.getCurrentControllable()) engine.focusMapToObject(engine.getCurrentControllable());
    };
}

function onObjectSelect(obj) {
    if (selectMode === SELECT && obj.type > 0 && obj.type < 4) {
        var currentUnit = engine.getCurrentControllable();
        selectMode = MOVE;
        if (!currentUnit) {
            engine.setCurrentControllable(obj);
            var existingAction = unitActions[obj.mapPos.r][obj.mapPos.c];
            if (Object.entries(existingAction).length !== 0 && existingAction.constructor === Object) {
                if(Object.entries(existingAction.move).length !== 0 && existingAction.move.constructor === Object) {
                    updateUnitMove(obj.mapPos.r, obj.mapPos.c, existingAction.move.x, existingAction.move.y, false);
                }
                if(Object.entries(existingAction.action).length !== 0 && existingAction.action.constructor === Object) {
                    updateUnitAction(obj.mapPos.r, obj.mapPos.c, existingAction.action.x, existingAction.action.y, false);
                }
            } else {
                existingAction = {
                    "move" : {
                        "x": obj.mapPos.r,
                        "y": obj.mapPos.c,
                    },
                    "action" : {},
                }
                unitActions[obj.mapPos.r][obj.mapPos.c] = existingAction;
            }
            
            engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(true, false);
            engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor = 8443903;
            engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillAlpha = 0.8;
        }
    } else if (selectMode === MOVE) {
        selectMode = ACTION;
        var currentUnit = engine.getCurrentControllable();
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, obj.mapPos.r, obj.mapPos.c, false);
    } else if (selectMode === ACTION) {
        selectMode = DISABLED;
        var currentUnit = engine.getCurrentControllable();
        updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, obj.mapPos.r, obj.mapPos.c, false);
        setTimeout(function() {
            selectMode = SELECT;
            deselectUnit();
            engine.setCurrentControllable(null);
        }, 1000);
    }
}

function deselectUnit() {
    var currentUnit = engine.getCurrentControllable();
    if(currentUnit) {
        var currentAction = unitActions[currentUnit.mapPos.r][currentUnit.mapPos.c];
        if (Object.entries(currentAction).length !== 0 && currentAction.constructor === Object) {
            if (Object.entries(currentAction.move).length !== 0 && currentAction.move.constructor === Object) {
                engine.getTileAtRowAndColumn(currentAction.move.x, currentAction.move.y).setHighlighted(false, false);
            }
            if (Object.entries(currentAction.action).length !== 0 && currentAction.action.constructor === Object) {
                engine.getTileAtRowAndColumn(currentAction.action.x, currentAction.action.y).setHighlighted(false, false);
            }
        }
        engine.setCurrentControllable(null);
    }
}

function onTileSelect(x, y) {
    if (selectMode === MOVE) {
        console.log("MOVE");
        var currentUnit = engine.getCurrentControllable();
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y, false);
        selectMode = ACTION;
    } else if (selectMode === ACTION) {
        console.log("ACTION");
        var currentUnit = engine.getCurrentControllable();
        updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y, false);
        selectMode = DISABLED;
        setTimeout(function() {
            selectMode = SELECT;
            deselectUnit();
            engine.setCurrentControllable(null);
        }, 1000);
    }
    // console.log(x, y);

    // var currentUnit = engine.getCurrentControllable();
    
    // console.log(currentUnit);
    // if(currentUnit) {
    //     updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y);
    // }

    // console.log(unitActions);

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

function updateUnitMove(unitX, unitY, moveX, moveY, instant) {
    var existingAction = unitActions[unitX][unitY];
    if (existingAction && Object.entries(existingAction).length !== 0 && existingAction.constructor === Object 
        && Object.entries(existingAction.move).length !== 0 && existingAction.move.constructor === Object 
        && (existingAction.move.x != moveX || existingAction.move.y != moveY)) {
        engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(false, instant);
    }
    if(moveX >= 0 && moveY >= 0) {
        if (!existingAction) existingAction = {};
        existingAction.move = {
            "x" : moveX,
            "y" : moveY,
        }
        unitActions[unitX][unitY] = existingAction;
        engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(true, false);
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor = Math.floor(Math.random() * Math.floor(9999999999));
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillAlpha = 0.5;
        // console.log(engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor);
    } else {
        unitActions[unitX][unitY].move = {};
    }
}

function updateUnitAction(unitX, unitY, actX, actY, instant) {
    var existingAction = unitActions[unitX][unitY];
    if (existingAction && Object.entries(existingAction).length !== 0 && existingAction.constructor === Object 
        && Object.entries(existingAction.action).length !== 0 && existingAction.action.constructor === Object 
        && (existingAction.action.x != actX || existingAction.action.y != actY)) {
        engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).setHighlighted(false, instant);
    }
    if(actX >= 0 && actY >= 0) {
        if (!existingAction) existingAction = {};
        existingAction.action = {
            "x" : actX,
            "y" : actY,
        }
        unitActions[unitX][unitY] = existingAction;
        engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).setHighlighted(true, false);
        // engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).highlightedOverlay.currentPath.fillColor = Math.floor(Math.random() * Math.floor(9999999999));
        // engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).highlightedOverlay.currentPath.fillAlpha = 0.5;
        // console.log(engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).highlightedOverlay.currentPath.fillColor);
    } else {
        unitActions[unitX][unitY].action = {};
    }
}