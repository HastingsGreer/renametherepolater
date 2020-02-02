var sfx = new SFX();
var ambience = new BGM();

var bgm = new BGM();


////// Here, we initialize the pixi application
var pixiRoot = new PIXI.Application(800, 600, { backgroundColor : 0x6BACDE });
let boardXMax = 7;
let boardYMax = 5;

const DISABLED = -1;
const SELECT = 0;
const MOVE = 1;
const ACTION = 2;

var selectMode = SELECT;

// add the renderer view element to the DOM
let container = document.getElementById("pixiContainer");
container.appendChild(pixiRoot.view);

let activeObjects = [];
let yourObjects = [];

let healthObjects = [];

let actions = {
    "normie" : "encourage",
    "bench_boi" : "place_bench",
    "therapist" : "discuss_problems",
    "treebuchet" : "tree_rocket"
}
let optionHighlightObjs = [];
let confirmedMovesObjs = {};

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
        "/static/assets/ggj_ground_movelight.png",
        "/static/assets/ggj_ground_attacklight.png",
        "/static/assets/ggj_movearrow_1.png",
        "/static/assets/ggj_movearrow_2.png",
        "/static/assets/ggj_movearrow_3.png",
        "/static/assets/ggj_movearrow_4.png",
        "/static/assets/ggj_movearrow_5.png",
        "/static/assets/ggj_movearrow_6.png",
        "/static/assets/ggj_movearrow_7.png",
        "/static/assets/ggj_movearrow_8.png",
        "/static/assets/ggj_moveline_diagonal_1.png",
        "/static/assets/ggj_moveline_diagonal_2.png",
        "/static/assets/ggj_moveline_horiz.png",
        "/static/assets/ggj_moveline_vert.png",
        "/static/assets/ggj_attackarrow_1.png",
        "/static/assets/ggj_attackarrow_2.png",
        "/static/assets/ggj_attackarrow_3.png",
        "/static/assets/ggj_attackarrow_4.png",
        "/static/assets/ggj_attackarrow_5.png",
        "/static/assets/ggj_attackarrow_6.png",
        "/static/assets/ggj_attackarrow_7.png",
        "/static/assets/ggj_attackarrow_8.png",
        "/static/assets/ggj_attackline_diagonal_1.png",
        "/static/assets/ggj_attackline_diagonal_2.png",
        "/static/assets/ggj_attackline_horiz.png",
        "/static/assets/ggj_attackline_vert.png",
        "/static/assets/ggj_barofhealth_offset.png",
        "/static/assets/ggj_healthbar_01.png",
        "/static/assets/ggj_healthbar_02.png",
        "/static/assets/ggj_healthbar_03.png",
        "/static/assets/ggj_healthbar_04.png",
        "/static/assets/ggj_healthbar_05.png",
        "/static/assets/ggj_healthbar_06.png",
        "/static/assets/ggj_healthbar_07.png",
        "/static/assets/ggj_healthbar_08.png",
        "/static/assets/ggj_healthbar_09.png",
        "/static/assets/ggj_healthbar_10.png",
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

let highlightMovementTiles = (unit_x, unit_y, center_x, center_y, steps, isAttacking) => {
    console.log("Higlihging");
    let prefix = isAttacking ? "attack" : "move"

    let movementHighlight = revMapping[prefix + "_highlight"];

    let addHighlighTile = (step, dx, dy) => {
        if (center_x + step * dx >= 0 && center_x + step * dx < boardXMax &&
            center_y + step * dy >= 0 && center_y + step * dy < boardYMax) {
            optionHighlightObjs.push(
                engine.createAndAddObjectToLocation(movementHighlight, {'r':
                    center_x + step * dx, 'c': center_y + step * dy}))
        }

    }

    addHighlighTile(0, 0, 0);

    for (var i = 1 ; i <= steps ; i++) {
        console.log(i);
        for (var dx = -1 ; dx <= 1 ; dx++) {
            for (var dy = -1 ; dy <= 1 ; dy++) {
                if (!(dx === 0 && dy === 0))
                    addHighlighTile(i, dx, dy);
            }
        }
    }

    return;
}

let removeOptionHighlightsAndConfirm = (obj, initX, initY, newX, newY,
    isAttacking) => {
    console.log("Remove options");
    console.log(optionHighlightObjs);
    optionHighlightObjs.forEach((jkl) => {
        engine.removeObjectFromLocation(jkl);
    });
    optionHighlightObjs.length = 0;
    let unit = get_unit(obj.mapPos.r, obj.mapPos.c);
    console.log(obj.mapPos.r);
    console.log(obj.mapPos.c);
    console.log(initX);
    console.log(initY);

    let dx = Math.sign(newX - initX);
    let dy = Math.sign(newY - initY);
    let arrowObj = undefined;
    let lineObj = undefined;
    let steps = Math.abs(newX - initX);
    let prefix = isAttacking ? "attack" : "move" 

    if (dx === -1 && dy === -1) {
        arrowObj = revMapping[prefix + "arrow_W"];
        lineObj = revMapping[prefix + "line_horiz"];
    } else if (dx === -1 && dy === 0) {
        arrowObj = revMapping[prefix + "arrow_NW"];
        lineObj = revMapping[prefix + "line_diag_2"];
    } else if (dx === -1 && dy === 1) {
        arrowObj = revMapping[prefix + "arrow_N"];
        lineObj = revMapping[prefix + "line_vert"];
    } else if (dx === 0 && dy === -1) {
        arrowObj = revMapping[prefix + "arrow_SW"];
        lineObj = revMapping[prefix + "line_diag_1"];
    } else if (dx === 0 && dy === 0) {
        return;
    } else if (dx === 0 && dy === 1) {
        arrowObj = revMapping[prefix + "arrow_NE"];
        lineObj = revMapping[prefix + "line_diag_1"];
    } else if (dx === 1 && dy === -1) {
        arrowObj = revMapping[prefix + "arrow_S"];
        lineObj = revMapping[prefix + "line_vert"];
    } else if (dx === 1 && dy === 0) {
        arrowObj = revMapping[prefix + "arrow_SE"];
        lineObj = revMapping[prefix + "line_diag_2"];
    } else if (dx === 1 && dy === 1) {
        arrowObj = revMapping[prefix + "arrow_E"];
        lineObj = revMapping[prefix + "line_horiz"];
    }

    confirmedMovesObjs[unit.id] = [];
    for (var i = 1 ; i < steps ; i++) {
        confirmedMovesObjs[unit.id].push(
            engine.createAndAddObjectToLocation(
                lineObj,
                {
                    'r': initX + dx * i,
                    'c': initY + dy * i
                }));
    }
    confirmedMovesObjs[unit.id].push(
        engine.createAndAddObjectToLocation( arrowObj, {'r': newX, 'c': newY}));
}

let resetStateMachine = () => {
    window.selectMode = SELECT;
    deselectUnit();
    engine.setCurrentControllable(null);
}

function onObjectSelect(obj) {
    console.log("Selected obj", obj.type);
    if (selectMode === SELECT && obj.type > 0 && obj.type < 6) {
        var currentUnit = engine.getCurrentControllable();
        // window.selected_cell = [obj.mapPos.r, obj.mapPos.c];
        let unitData = get_unit(obj.mapPos.r, obj.mapPos.c);
        console.log(unitData);

        highlightMovementTiles(obj.mapPos.r, obj.mapPos.c,
            obj.mapPos.r, obj.mapPos.c, unitData.movement_range, false);

        selectMode = MOVE;

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
        } else if (selectMode === MOVE) {
            console.log("MOVINGGGG");
            selectMode = ACTION;

            var currentUnit = engine.getCurrentControllable();
            updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
            updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
            // console.log("RIGHT BEFORE UPDATE UNIT MOVE: ", obj.mapPos.r, obj.mapPos.c);
        } else if (selectMode === ACTION) {
            removeAttackHighlightsAndConfirm(obj);
            selectMode = DISABLED;
            var currentUnit = engine.getCurrentControllable();
            updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, obj.mapPos.r, obj.mapPos.c, false);
            setTimeout(function() {
                window.selectMode = SELECT;
                deselectUnit();
                engine.setCurrentControllable(null);
            }, 1000);
        }
        engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(true, false);
        engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor = 8443903;
        engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillAlpha = 0.8;
    } else if (window.selectMode === MOVE) {
        var currentUnit = engine.getCurrentControllable();
        if (get_unit(currentUnit.mapPos.r, currentUnit.mapPos.c).attack_range <= 0) 
        {
            resetStateMachine();
        } else {
            window.selectMode = ACTION;
        }
        updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
        // console.log("RIGHT BEFORE UPDATE UNIT MOVE: ", obj.mapPos.r, obj.mapPos.c);
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
    console.log(yourObjects);
    let objFound = false;
    let clickedObstacle = false;
    yourObjects.forEach(obj => {
        if(obj.mapPos.r === x && obj.mapPos.c === y) {
            if(obj.type > 0 && obj.type < 6) {
                console.log(obj);
                onObjectSelect(obj);
                objFound = true;
            }
            if(obj.type === revMapping["water"] || obj.type === revMapping["tree"]) {
                clickedObstacle = true;
            }
        };
    });
    if (!objFound) {
        if (window.selectMode === MOVE && engine.getTileAtRowAndColumn(x, y).type !== 3 && !clickedObstacle) {
            console.log("TILE MOVE");
            var currentUnit = engine.getCurrentControllable();
            if (get_unit(currentUnit.mapPos.r, currentUnit.mapPos.c).attack_range <= 0) {
                resetStateMachine();
            }
            else 
                window.selectMode = ACTION;
            removeOptionHighlightsAndConfirm(currentUnit,
                currentUnit.mapPos.r,
                currentUnit.mapPos.c,
                x, y, false);
            updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
            updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, -1, -1, true);
            // console.log("RIGHT BEFORE UPDATE UNIT MOVE: ", currentUnit.mapPos.r, currentUnit.mapPos.c);
            updateUnitMove(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y, false);
            let unitData = get_unit(currentUnit.mapPos.r, currentUnit.mapPos.c);
            highlightMovementTiles(currentUnit.mapPos.r,
                currentUnit.mapPos.c, x, y, unitData.attack_range, true);

        } else if (selectMode === ACTION) {
            console.log("TILE ACTION");
            var currentUnit = engine.getCurrentControllable();
            let cur_actions = unitActions[currentUnit.mapPos.r][currentUnit.mapPos.c].move;

            removeOptionHighlightsAndConfirm(currentUnit, 
                cur_actions.x, cur_actions.y,
                x, y, true);
            updateUnitAction(currentUnit.mapPos.r, currentUnit.mapPos.c, x, y, false);
            deselectUnit();
            engine.setCurrentControllable(null);
            window.selectMode = SELECT;
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
    // console.log("UPDATE UNIT MOVE: ", unitX, unitY);
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
        //engine.createAndAddObjectToLocation(10, {"r": existingAction.move.x, "c": existingAction.move.y});
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).setHighlighted(true, false);
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor = Math.floor(Math.random() * Math.floor(9999999999));
        // engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillAlpha = 0.5;
        // console.log(engine.getTileAtRowAndColumn(existingAction.move.x, existingAction.move.y).highlightedOverlay.currentPath.fillColor);
        console.log(unitX, unitY, get_unit(unitX, unitY).id);
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
        add_attack(get_unit(unitX, unitY).id, [actX, actY], actions[get_unit(unitX, unitY).type]);
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
    yourObjects.length = 0;

    healthObjects.forEach((obj) => {
        engine.removeObjectFromLocation(obj);
    });
    healthObjects.length = 0;

    toAddHealth = [];

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
                let unitView = engine.createAndAddObjectToLocation(unitObj,
                    {'r': i, 'c': j});
                console.log("HELLOjadkshfjkadshfjksadf");
                console.log(cell.unit.owner);
                console.log(window.player_id);
                activeObjects.push(unitView);
                if (cell.unit.owner === window.player_id) {
                    yourObjects.push(unitView);
                }
                toAddHealth.push({
                    'r': i,
                    'c': j,
                    "happiness": cell.unit.happiness
                });
            }
        }
    }

    toAddHealth.forEach((unit) => {
        healthObjects.push(engine.createAndAddObjectToLocation(revMapping["empty_healthbar"],
            {'r': unit.r, 'c': unit.c}));
        for(var k = 0; k < unit.happiness / 10; k++) {
            healthObjects.push(engine.createAndAddObjectToLocation(revMapping["health_segment_01"] + k,
            {'r': unit.r, 'c': unit.c}));
        }
    });

    engine.objectSelectCallback = onObjectSelect;
    window.selectMode = SELECT;
}
