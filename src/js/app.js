import $ from 'jquery';
import {parseCode} from './code-analyzer';

const make_table = (parsedCode) => {
    let table = document.getElementById('myTable');
    table.innerHTML = '';
    var tr = table.insertRow(-1);

    let col = ['line' , 'type' , 'name' , 'condition' , 'value'];
    for(let i = 0; i < col.length ; i++){
        let th = document.createElement('th');
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    for(let i = 0; i < parsedCode.length ; i++){
        let tr = table.insertRow(-1);
        for (let j = 0; j < col.length; j++) {
            let tabCell = tr.insertCell(-1);
            tabCell.innerHTML = parsedCode[i][col[j]];
        }
    }
};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        make_table(parsedCode);

    });
});
