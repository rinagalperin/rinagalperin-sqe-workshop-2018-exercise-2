import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {ParseFunctionUnit} from './functionUnitParser';
import {CreateResultTable} from './functionUnitParserView';
import {ClearTable} from './functionUnitParserView';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        ClearTable();

        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));

        ParseFunctionUnit(parsedCode);
        CreateResultTable(true);
    });
});