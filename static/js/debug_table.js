window.selected_cell = -1;
window.state_json = {};

function get_unit(i, j){
    return window.state_json.map.board[i][j].unit;
}


function fill_table(some_json) {
    window.selected_cell = -1;
    window.state_json = some_json;
    update_table()
}
function update_table() {
    console.log("asdf");
	//body reference 
    var tableParent = document.getElementById("tempMap");

    // create elements <table> and a <tbody>
    var tbl     = document.createElement("table");
    var tblBody = document.createElement("tbody");
 
    // cells creation
    for (var i = 0; i < window.state_json.map.board.length; i++) {
        // table row creation
        var row = document.createElement("tr");

        for (var j = 0; j < window.state_json.map.board[0].length; j++) {
            // create element <td> and text node 
            //Make text node the contents of <td> element
            // put <td> at end of the table row
            var cell = document.createElement("td");    
            var cellText = document.createTextNode(JSON.stringify(window.state_json.map.board[i][j])
                .replace(/,/g, " ")
                .replace(/"/g, "")
                .replace(/:/g, ": ")
                .replace("unit: {}", "")); 

            cell.appendChild(cellText);
            var br = document.createElement("br");
            cell.appendChild(br);
            if(Object.keys(get_unit(i, j)).length != 0 &&
                get_unit(i, j).owner == window.player_id){
                function make_print_my_location(i, j) {      
    	            function print_my_location() {
            
    	                window.selected_cell = [i, j];
                        update_table();
    	            }
    	            return print_my_location;
    	        }

                var btn = document.createElement("BUTTON");   // Create a <button> element
                btn.innerHTML = "<b>SELECT</b>";
                btn.onclick = make_print_my_location(i, j);
                cell.appendChild(btn);
            }
            if(window.selected_cell != -1) {

                var can_queen_move = (
                    (window.selected_cell[0] == i) ||
                    (window.selected_cell[1] == j) ||
                    (window.selected_cell[0] - i == window.selected_cell[1] - j )||
                    (window.selected_cell[0] - i == -(window.selected_cell[1] - j))
                )
                if(can_queen_move) {
                    function make_move_my_location(i, j) {

                        function move_my_location() {
                            if(window.selected_cell == -1){
                                alert("nothing selected");
                                return
                            }
                            add_move(get_unit(window.selected_cell[0], 
                                window.selected_cell[1]).id,
                                window.selected_cell, [i, j]);
                        }
                        return move_my_location;
                    }

                    var btn = document.createElement("BUTTON");   // Create a <button> element
                    btn.innerHTML = "MOVE HERE";
                    btn.onclick = make_move_my_location(i, j);
                    cell.appendChild(btn);
                }

                var can_act = false;

                var unit = get_unit(window.selected_cell[0], 
                            window.selected_cell[1])

                if (unit.type === "treebuchet") {
                    can_act = true;
                }

                if (unit.attack_range >= Math.max(
                    Math.abs(window.selected_cell[0] - i),
                    Math.abs(window.selected_cell[1] - j)
                )) {
                    can_act = true;
                }

                if(can_act) {
                
                    function make_act_my_location(i, j) {   
                        function act_my_location() {
                            if(window.selected_cell == -1){
                                alert("nothing selected");
                                return
                            }
                            add_attack(get_unit(window.selected_cell[0], 
                                window.selected_cell[1]).id,
                                [i, j], get_unit(window.selected_cell[0], 
                                window.selected_cell[1]).attack);
                        }
                        return act_my_location;
                    }

                    var btn = document.createElement("BUTTON");   // Create a <button> element
                    btn.onclick = make_act_my_location(i, j);
                    btn.innerHTML = "HELP HERE";
                    cell.appendChild(btn);
                }
                
            }


            row.appendChild(cell);
        }

        //row added to end of table body
        tblBody.appendChild(row);
    }

    // append the <tbody> inside the <table>
    tbl.appendChild(tblBody);
    // put <table> in the <body>
    if (tableParent.hasChildNodes()) {
       tableParent.removeChild(tableParent.childNodes[0]);
    }
    if (tableParent.hasChildNodes()) {
       tableParent.removeChild(tableParent.childNodes[0]);
    }
    tableParent.appendChild(tbl);
    // tbl border attribute to 
    tbl.setAttribute("border", "2");
    actions_changed();
}

window.action_ready_json = {
    moves : [],
    attacks : []
}
window.action_set_handlers = [];
actions_changed = function() {
    for(var i = 0; i < window.action_set_handlers.length; i++){
        window.action_set_handlers[i]()
    }
}
register_action_set_handler = function(fn) {
    window.action_set_handlers.push(fn);
}

clear_actions = function() {
    window.action_ready_json = {
       moves : [],
       attacks : []
    }
    actions_changed();
}

add_move = function(id, start, end) {
    let isAnUpdate = false;
    window.action_ready_json.moves.forEach((move) => {
        if (move.id === id) {
            isAnUpdate = true;
            move.start = start;
            move.end = end;
        }
    });
    if (!isAnUpdate) {
        window.action_ready_json.moves.push(
            {id: id, start:start, end:end});
    }
    actions_changed();
}
add_attack = function(id, target, type) {
    let isAnUpdate = false;
    window.action_ready_json.attacks.forEach((move) => {
        if (move.id === id) {
            isAnUpdate = true;
            move.target = target;
            move.type = type;
        }
    });
    if (!isAnUpdate) {
        window.action_ready_json.attacks.push(
            {id: id, target, type});
    }
    actions_changed();
}

register_action_set_handler(function() {
    var tableParent = document.getElementById("inputAction");
    tableParent.value = JSON.stringify(window.action_ready_json);
})

