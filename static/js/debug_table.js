window.selected_cell = -1;
window.state_json = {};

function get_unit(i, j){
    return window.state_json.map.board[i][j].unit;
}


function fill_table(some_json) {

    window.state_json = some_json;
    console.log("asdf");
	//body reference 
    var tableParent = document.getElementById("tempMap");

    // create elements <table> and a <tbody>
    var tbl     = document.createElement("table");
    var tblBody = document.createElement("tbody");
 
    // cells creation
    for (var j = 0; j <= 4; j++) {
        // table row creation
        var row = document.createElement("tr");

        for (var i = 0; i < 4; i++) {
            // create element <td> and text node 
            //Make text node the contents of <td> element
            // put <td> at end of the table row
            var cell = document.createElement("td");    
            var cellText = document.createTextNode(JSON.stringify(some_json.map.board[i][j])); 

            cell.appendChild(cellText);
            if(Object.keys(get_unit(i, j)).length != 0){
                function make_print_my_location(i, j) {      
    	            function print_my_location() {
            
    	                window.selected_cell = [i, j];
    	            }
    	            return print_my_location;
    	        }

                var btn = document.createElement("BUTTON");   // Create a <button> element
                btn.innerHTML = "<b>SELECT</b>";
                btn.onclick = make_print_my_location(i, j);
                cell.appendChild(btn);
            }

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
            
            function make_act_my_location(i, j) {   
                function act_my_location() {
                    if(window.selected_cell == -1){
                        alert("nothing selected");
                        return
                    }
                    add_attack(get_unit(window.selected_cell[0], 
                        window.selected_cell[1]).id,
                        [i, j], "tree_rocket");
                }
                return act_my_location;
            }

            var btn = document.createElement("BUTTON");   // Create a <button> element
            btn.onclick = make_act_my_location(i, j);
            btn.innerHTML = "HELP HERE";
            cell.appendChild(btn);


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
    window.action_ready_json.moves.push(
        {id: id, start:start, end:end});
    actions_changed();
}
add_attack = function(id, target, type) {
    window.action_ready_json.attacks.push(
        {id: id, target, type});
    actions_changed();
}

register_action_set_handler(function() {
    var tableParent = document.getElementById("inputAction");
    tableParent.value = JSON.stringify(window.action_ready_json);
})

