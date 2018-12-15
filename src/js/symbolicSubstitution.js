import * as esprima from 'esprima';
import {ParseFunctionUnit} from './functionUnitParser';
import {entries} from './functionUnitParser';

export {SymbolicSubstitution}

let result;

let router;
let symbol_table;
let parsed_code;
let lines;

function SymbolicSubstitution(functionCode){
    result = []; // final function to be displayed
    symbol_table = {}; // final parameters values to populate the arguments and check conditions

    router = InitRouter();
    parsed_code = esprima.parseScript(functionCode, {loc:true});
    lines = functionCode.split('\n');

    let function_globals_indexes = GlobalVariablesHandler(symbol_table, parsed_code);
    ParseFunctionUnit(parsed_code.body[function_globals_indexes.function]);
    parsed_code = parsed_code.body[function_globals_indexes.function];

    Route(symbol_table, parsed_code);

    return result;
}

function GlobalVariablesHandler(symbol_table, parsed_code){
    let ans = {};
    ans.globals = [];
    ans.function = 0;

    for(let i in parsed_code.body){
        let unit = parsed_code.body[i];
        unit.type === 'FunctionDeclaration' ? ans.function = i : ans.globals.push(i);
    }

    for(let global_index in ans.globals){
        let global_declaration = parsed_code.body[global_index];
        GlobalDeclarationHandler(symbol_table, global_declaration);
    }

    return ans;
}

function GlobalDeclarationHandler(symbol_table, parsed_code){
    for(let declaration of parsed_code.declarations){
        symbol_table[declaration.id.name] = declaration.init != null ? declaration.init.value : '';
    }
}

function Route(symbol_table, parsed_code){
    router[parsed_code.type](symbol_table, parsed_code);
}

function FunctionDeclarationHandler(symbol_table, parsed_code){
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
    BlockStatementHandler(symbol_table, function_body);
}

function BlockStatementHandler(symbol_table, parsed_code){
    for(let i = 0; i < parsed_code.body.length; i++){
        let parsed_code_statement = parsed_code.body[i];
        console.log(parsed_code_statement.type);
        router[parsed_code_statement.type](symbol_table, parsed_code_statement);
    }
}

function VariableDeclarationHandler(symbol_table, parsed_code){
    for(let declaration of parsed_code.declarations){
        VariableDeclaratorHandler(symbol_table, declaration);
    }
}

function VariableDeclaratorHandler(symbol_table, parsed_code){
    let param = parsed_code.id.name;
    SetEntryValue(parsed_code, param);
}

function ExpressionStatementHandler(symbol_table, expression_statement){
    router[expression_statement.expression.type](symbol_table, expression_statement.expression);
}

function UpdateExpressionHandler(symbol_table, parsed_code){
    let param = parsed_code.argument.name;
    SetEntryValue(parsed_code, param);
}

function AssignmentExpressionHandler(symbol_table, parsed_code){
    let param = parsed_code.left.name;
    SetEntryValue(parsed_code, param);
}

// TODO:
function IfStatementHandler(symbol_table, parsed_code){
    let symbol_table_tmp = {};

    Object.keys(symbol_table).forEach(function(symbol) {
        symbol_table_tmp[symbol] = symbol_table[symbol];
    });
}

// TODO:
function WhileStatementHandler(symbol_table, parsed_code){

}

// TODO:
function ReturnStatementHandler(symbol_table, parsed_code){

}

function ExtractUpdatedValue(symbol_table, param, new_assigned_value){
    if(param in symbol_table){
        let drill_down = new_assigned_value.split('*').join(',').split('-').join(',').split('+').join(',').split('/').join(',').split(' ').join(',').split(',');
        for(let d of drill_down){
            if(d !== "" && d in symbol_table){
                new_assigned_value = new_assigned_value.replace(d, '('+ symbol_table[d] + ')');
            }
        }
    }

    return new_assigned_value;
}

function SetEntryValue(parsed_code, param){
    for(let e of entries){
        if(e['Line'] === parsed_code.loc.start.line && e['Name'] === param){
            symbol_table[param] = ExtractUpdatedValue(symbol_table, param, e['Value']);
        }
    }
}

function InitRouter(){
    return {
        'FunctionDeclaration': FunctionDeclarationHandler,
        'BlockStatement': BlockStatementHandler,
        'VariableDeclaration': VariableDeclarationHandler,
        'ExpressionStatement': ExpressionStatementHandler,
        'AssignmentExpression': AssignmentExpressionHandler,
        'UpdateExpression' : UpdateExpressionHandler,
        'IfStatement': IfStatementHandler,
        'WhileStatement': WhileStatementHandler,
        'ReturnStatement': ReturnStatementHandler
    };
}