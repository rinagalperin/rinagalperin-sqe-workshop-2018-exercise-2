import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let functionCode = $('#codePlaceholder').val();
        let parameters = $('#parametersPlaceholder').val();

        let parsedCode = parseCode(functionCode, parameters);

        $('#parsedCode').html(parsedCode);
    });
});