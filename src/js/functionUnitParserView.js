/* --------- Global Variables --------- */

let rows;

/* --------- Exports --------- */

export {CreateResultTable};
export {ClearTable};

/* --------- Imports --------- */

import {entries} from './functionUnitParser';

/* --------- Display Results --------- */

function CreateResultTable(isTable) {
    rows = 1;

    if(isTable){
        let table = window.document.getElementById('table');

        // create table header
        let header = table.insertRow(0);
        header.insertCell(0).outerHTML = '<th>Line</th>';
        header.insertCell(1).outerHTML = '<th>Type</th>';
        header.insertCell(2).outerHTML = '<th>Name</th>';
        header.insertCell(3).outerHTML = '<th>Condition</th>';
        header.insertCell(4).outerHTML = '<th>Value</th>';

        // insert all entries to table
        PopulateTable(table);
    }
}

function PopulateTable(table){
    for(let entry in entries){
        let row = table.insertRow(rows);
        let cell0 = row.insertCell(0); // Line
        cell0.innerHTML = entries[entry].Line;

        let cell1 = row.insertCell(1); // Type
        cell1.innerHTML = entries[entry].Type;

        let cell2 = row.insertCell(2); // Name
        cell2.innerHTML = entries[entry].Name;

        let cell3 = row.insertCell(3); // Condition
        cell3.innerHTML = entries[entry].Condition;

        let cell4 = row.insertCell(4); // Value
        cell4.innerHTML = entries[entry].Value;
        rows = rows + 1;
    }
}

function ClearTable(){
    let table = window.document.getElementById('table');
    table.innerHTML = '';
}