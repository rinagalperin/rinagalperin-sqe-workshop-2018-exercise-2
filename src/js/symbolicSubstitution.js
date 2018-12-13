import * as esprima from 'esprima';
import {ParseFunctionUnit} from './functionUnitParser';
import {entries} from './functionUnitParser';

export {SymbolicSubstitution}

let result;
let router;
let symbol_table;
let input_vector;
let parsed_code;
let original_lines;

function SymbolicSubstitution(functionCode){
    result = [];
    input_vector = [];

    router = InitRouter();

    symbol_table = {};
    parsed_code = esprima.parseScript(functionCode, {loc:true});
    ParseFunctionUnit(parsed_code);
    parsed_code = parsed_code.body[0];
    original_lines = functionCode.split('\n');

    Route(symbol_table, parsed_code, original_lines);

    return result;
}

function Route(symbol_table, parsed_code, lines){
    router[parsed_code.type](symbol_table, parsed_code, lines);
}

function FunctionDeclarationHandler(symbol_table, parsed_code, lines){
    let function_parameters = parsed_code.params;
    let function_body = parsed_code.body;
    let parameters_count = 1;

    let result_entry = {};
    result_entry.line = parsed_code.loc.start.line;
    result_entry.offset = parsed_code.loc.start.column;
    result_entry.value = 'function ' + parsed_code.id.name + '(';

    for(let i in function_parameters){
        let parameter = function_parameters[i];
        symbol_table[parameter.name] = '';

        result_entry.value += parameters_count < parsed_code.params.length ? parameter.name + ', ' : parameter.name + '){';
        parameters_count += 1;
    }

    result.push(result_entry);
    BlockStatementHandler(symbol_table, function_body, lines);
}

function BlockStatementHandler(symbol_table, parsed_code, lines){
    for(let i = 0; i < parsed_code.body.length; i++){
        let parsed_code_statement = parsed_code.body[i];
        console.log(parsed_code_statement.type);
        router[parsed_code_statement.type](symbol_table, parsed_code_statement, lines);
    }
}

function VariableDeclarationHandler(symbol_table, parsed_code, lines){
    for(let i in parsed_code.declarations){
        VariableDeclaratorHandler(symbol_table, parsed_code.declarations[i], lines);
    }
}

function VariableDeclaratorHandler(symbol_table, declarator, lines){
    for(let i in entries){
        let e = entries[i];

        if(e['Line'] === declarator.loc.start.line && e['Name'] === declarator.id.name){
            symbol_table[declarator.id.name] = e['Value'];
        }
    }
}

function AssignmentExpressionHandler(symbol_table, parsed_code, lines){

}

function ExpressionStatementHandler(symbol_table, parsed_code, lines){

}

function UpdateExpressionHandler(symbol_table, parsed_code, lines){

}

function IfStatementHandler(symbol_table, parsed_code, lines){

}

function WhileStatementHandler(symbol_table, parsed_code, lines){

}

function ReturnStatementHandler(symbol_table, parsed_code, lines){

}

function InitRouter(){
    return {
        'FunctionDeclaration': FunctionDeclarationHandler,
        'BlockStatement': BlockStatementHandler,
        'VariableDeclaration': VariableDeclarationHandler,
        'AssignmentExpression': AssignmentExpressionHandler,
        'ExpressionStatement': ExpressionStatementHandler,
        'UpdateExpression' : UpdateExpressionHandler,
        'IfStatement': IfStatementHandler,
        'WhileStatement': WhileStatementHandler,
        'ReturnStatement': ReturnStatementHandler
    };
}