function fill_table(some_json) {
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
