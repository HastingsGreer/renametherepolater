////// Here, we initialize the pixi application
var pixiRoot = new PIXI.Application(800, 600, { backgroundColor : 0x6BACDE });

// add the renderer view element to the DOM
let container = document.getElementById("pixiContainer");
container.appendChild(pixiRoot.view);

let activeObjects = [];

let serverGameState = undefined;

////// Here, we create our traviso instance and add on top of pixi

// engine-instance configuration object
var instanceConfig = {
    mapDataPath: "/static/map/mapData.json", // the path to the json file that defines map data, required
    assetsToLoad: [ // array of paths to the assets that are desired to be loaded by traviso, no need to use if assets are already loaded to PIXI cache, default null
        "/static/assets/t1.png", 
        "/static/assets/ggj_ground_alive.png", 
        "/static/assets/ggj_ground_dead.png", 
        "/static/assets/ggj_ground_flower.png",
        "/static/assets/ggj_ground_flower_shadow.png",
        "/static/assets/ggj_ground_water.png",
        "/static/assets/box.png",
        "/static/assets/btn_zoomIn.png",
        "/static/assets/btn_zoomOut.png",
        "/static/assets/btn_centralize.png",
        "/static/assets/btn_centralizeToObject.png",
        "/static/assets/btn_focusToObject.png",
        "/static/assets/ggj_austin_forward.png",
        "/static/assets/ggj_austin_backward.png",
        "/static/assets/ggj_bench.png",
        "/static/assets/ggj_benchboi_forward.png",
        "/static/assets/ggj_benchboi_backward.png",
        "/static/assets/ggj_blankbenchboi_forward.png",
        "/static/assets/ggj_blankbenchboi_backward.png",
        "/static/assets/ggj_flowergirl_forward.png",
        "/static/assets/ggj_flowergirl_backward.png",
        "/static/assets/ggj_lumberjack_forward.png",
        "/static/assets/ggj_lumberjack_backward.png",
        "/static/assets/ggj_therapist_forward.png",
        "/static/assets/ggj_therapist_backward.png",
        "/static/assets/ggj_projectile.png",
        "/static/assets/ggj_tree.png",
        "/static/assets/ggj_treebuchet.png",
        "/static/assets/TreeBuchet_Frame_1.png",
        "/static/assets/TreeBuchet_Frame_2.png",
        "/static/assets/TreeBuchet_Frame_3.png",
        "/static/assets/TreeBuchet_Frame_4.png",
        "/static/assets/TreeBuchet_Frame_5.png",
        "/static/assets/TreeBuchet_Frame_6.png",
        "/static/assets/Logo_Big.png",
        "/static/assets/Logo_Medium.png",
        "/static/assets/Logo_Small.png",
    ], 
    tileHeight: 33,
    isoAngle: 27.27676,
    maxScale : 4,
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

window.selectMode = SELECT;

var unitActions = [
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}],
    [{},{},{},{},{}]
];

function objIsNotEmpty(obj) {
    return Object.entries(obj).length !== 0 && obj.constructor === Object
}

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

    renderServerReply(serverGameState);
}

function onObjectSelect(obj) {
    console.log("Selected obj", obj.type);
    if (window.selectMode === SELECT && obj.type > 0 && obj.type < 6) {
        var currentUnit = engine.getCurrentControllable();
        // window.selected_cell = [obj.mapPos.r, obj.mapPos.c];
        window.selectMode = MOVE;
        if (!currentUnit) {
            engine.setCurrentControllable(obj);
            var existingAction = unitActions[obj.mapPos.r][obj.mapPos.c];
            if (objIsNotEmpty(existingAction)) {
                if(objIsNotEmpty(existingAction.move)) {
                    updateUnitMove(obj.mapPos.r, obj.mapPos.c, existingAction.move.x, existingAction.move.y, false);
                }
                if(objIsNotEmpty(existingAction.action)) {
                    setTimeout(function() {
                        updateUnitAction(obj.mapPos.r, obj.mapPos.c, existingAction.action.x, existingAction.action.y, false)
                    }, 500);
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
    } else if (window.selectMode === MOVE) {
        window.selectMode = ACTION;
        var currentUnit = engine.getCurrentControllable();
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, obj.mapPos.r, obj.mapPos.c, false);
    } else if (window.selectMode === ACTION) {
        window.selectMode = DISABLED;
        var currentUnit = engine.getCurrentControllable();
        updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, obj.mapPos.r, obj.mapPos.c, false);
        setTimeout(function() {
            window.selectMode = SELECT;
            deselectUnit();
            engine.setCurrentControllable(null);
        }, 1000);
    }
}

function deselectUnit() {
    var currentUnit = engine.getCurrentControllable();
    if(currentUnit) {
        var currentAction = unitActions[currentUnit.mapPos.r][currentUnit.mapPos.c];
        if (objIsNotEmpty(currentAction)) {
            if (objIsNotEmpty(currentAction.move)) {
                engine.getTileAtRowAndColumn(currentAction.move.x, currentAction.move.y).setHighlighted(false, false);
            }
            if (objIsNotEmpty(currentAction.action)) {
                engine.getTileAtRowAndColumn(currentAction.action.x, currentAction.action.y).setHighlighted(false, false);
            }
        }
        engine.setCurrentControllable(null);
    }
}

function onTileSelect(x, y) {
    console.log("Selected tile", x, y);
    console.log(activeObjects);
    let objFound = false;
    activeObjects.forEach(obj => {
        if(obj.mapPos.r === x && obj.mapPos.c === y
            && obj.type > 0 && obj.type < 6) {
            console.log(obj);
            onObjectSelect(obj);
            objFound = true;
        }
    });
    if (!objFound) {
        if (window.selectMode === MOVE && engine.getTileAtRowAndColumn(x, y).type !== 3) {
            console.log("TILE MOVE");
            window.selectMode = ACTION;
            var currentUnit = engine.getCurrentControllable();
            updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
            updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
            updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y, false);
        } else if (window.selectMode === ACTION) {
            console.log("TILE ACTION");
            var currentUnit = engine.getCurrentControllable();
            updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y, false);
            window.selectMode = DISABLED;
            setTimeout(function() {
                window.selectMode = SELECT;
                deselectUnit();
                engine.setCurrentControllable(null);
            }, 1000);
        }
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
    if (objIsNotEmpty(existingAction) && objIsNotEmpty(existingAction.move)
        && (existingAction.move.x != moveX || existingAction.move.y != moveY)) {
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(false, instant);
        // engine.getObjectsAtRowAndColumn(existingAction.move.x, existingAction.move.y)
    }
    if(moveX >= 0 && moveY >= 0) {
        if (!existingAction) existingAction = {};
        existingAction.move = {
            "x" : moveX,
            "y" : moveY,
        }
        unitActions[unitX][unitY] = existingAction;
        engine.createAndAddObjectToLocation(10, {"r": existingAction.move.x, "c": existingAction.move.y});
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(true, false);
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor = Math.floor(Math.random() * Math.floor(9999999999));
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillAlpha = 0.5;
        // console.log(engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor);
        add_move(get_unit(unitX, unitY).id, [unitX, unitY], [moveX, moveY]);
    } else {
        unitActions[unitX][unitY].move = {};
    }
}

function updateUnitAction(unitX, unitY, actX, actY, instant) {
    var existingAction = unitActions[unitX][unitY];
    if (existingAction && objIsNotEmpty(existingAction)
        && objIsNotEmpty(existingAction.action)
        && (existingAction.action.x != actX || existingAction.action.y != actY)) {
        // engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).setHighlighted(false, instant);
    }
    if(actX >= 0 && actY >= 0) {
        if (!existingAction) existingAction = {};
        existingAction.action = {
            "x" : actX,
            "y" : actY,
        }
        unitActions[unitX][unitY] = existingAction;
        engine.createAndAddObjectToLocation(10, {"r": existingAction.action.x, "c": existingAction.action.y});
        // engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).setHighlighted(true, false);
        // engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).highlightedOverlay.currentPath.fillColor = Math.floor(Math.random() * Math.floor(9999999999));
        // engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).highlightedOverlay.currentPath.fillAlpha = 0.5;
        // console.log(engine.getTileAtRowAndColumn(existingAction.action.x, existingAction.action.y).highlightedOverlay.currentPath.fillColor);
        add_attack(get_unit(unitX, unitY).id, [actX, actY], "tree_rocket");
    } else {
        unitActions[unitX][unitY].action = {};
    }
}

let improvements = ["tree", "bench"];

function establishReverseUnitToTravObjMapping(travConfig) {
    let revMapping = {}
    let objects = travConfig.objects;
    for (var key in objects) {
        if (objects.hasOwnProperty(key)) {
            revMapping[objects[key]["key"]] = parseInt(key, 10);
        }
    }
    return revMapping;
}

let revMapping = establishReverseUnitToTravObjMapping(travConfig);
let defaultBackGround = revMapping["grass"];

console.log("Rev mapping");
console.log(revMapping);

function renderServerReply(data) {
    serverGameState = data;
    // destroy everything
    activeObjects.forEach((obj) => {
        engine.removeObjectFromLocation(obj);
    });
    activeObjects.length = 0;

    console.log("trying to render to engine");
    console.log(data);
    for (var i = 0 ; i < data.map.board.length ; i++) {
        for (var j = 0 ; j < data.map.board[0].length ; j++) {
            let cell = data.map.board[i][j];
            let backgroundObj = revMapping[cell.background];
            console.log(cell.background);
            console.log(backgroundObj);
            if (improvements.includes(cell.background)) {
                // this is not actually background
                activeObjects.push(
                    engine.createAndAddObjectToLocation(defaultBackGround, 
                    {'r': i, 'c': j}));
            }
            activeObjects.push(engine.createAndAddObjectToLocation(backgroundObj, 
                {'r': i, 'c': j}));


            if (objIsNotEmpty(cell.unit)) {
                let unitObj = revMapping[cell.unit.type];
                console.log(unitObj);
                activeObjects.push(engine.createAndAddObjectToLocation(unitObj,
                    {'r': i, 'c': j}));
            }
        }
    }
    engine.objectSelectCallback = onObjectSelect;
}
