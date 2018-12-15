import * as esprima from 'esprima';
import {ParseFunctionUnit} from './functionUnitParser';
import {entries} from './functionUnitParser';

export {SymbolicSubstitution}

let result;
let router;
let parsed_code;
let lines;
let conditions;
let args;

// TODO:  ************** handle arrays and strings. **************

function SymbolicSubstitution(functionCode){
    result = []; // final function to be displayed
    let symbol_table = {}; // final parameters values to populate the arguments and check conditions
    router = InitRouter();
    parsed_code = esprima.parseScript(functionCode, {loc:true});
    lines = functionCode.split('\n');
    conditions = {};
    args = [];

    let function_globals_indexes = GlobalVariablesHandler(symbol_table, parsed_code); // returns: [function index in parsed_code.body, global variables indexes in parsed_code.body]
    ParseFunctionUnit(parsed_code.body[function_globals_indexes.function]);
    parsed_code = parsed_code.body[function_globals_indexes.function];

    Route(symbol_table, parsed_code);

    result.push({value: "}"});
    return {result: result, conditions: conditions, symbol_table: symbol_table, args: args};
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
        if(declaration.init != null){
            if(declaration.init.value != null){
                symbol_table[declaration.id.name] = declaration.init.value;
            }else{
                let ans = '[';
                let arr = declaration.init.elements;
                for(let elem of declaration.init.elements){
                    ans += elem.value + ', ';
                }
                symbol_table[declaration.id.name] = ans.substring(0, ans.length-2) + ']';
            }
        }else{
            symbol_table[declaration.id.name] = '';
        }

        let result_entry = {};
        result_entry.line = parsed_code.loc.start.line;
        result_entry.offset = parsed_code.loc.start.column;
        result_entry.value = 'let ' + declaration.id.name + ' = ' + symbol_table[declaration.id.name] + ';';

        result.push(result_entry);
    }
}

function Route(symbol_table, parsed_code, isElse = false){
    if(isElse && parsed_code.type === 'BlockStatement'){
        ElseHandler(symbol_table, parsed_code);
    }

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
        symbol_table[parameter.name] = parameter.name;
        args.push(parameter.name);

        result_entry.value += parameters_count < parsed_code.params.length ? parameter.name + ', ' : parameter.name + '){';
        parameters_count += 1;
    }

    result.push(result_entry);
    BlockStatementHandler(symbol_table, function_body);
}

function BlockStatementHandler(symbol_table, parsed_code){
    for(let i = 0; i < parsed_code.body.length; i++){
        let parsed_code_statement = parsed_code.body[i];
        //console.log(parsed_code_statement.type);
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
    SetEntryValue(symbol_table, parsed_code, param);
}

function ExpressionStatementHandler(symbol_table, expression_statement){
    router[expression_statement.expression.type](symbol_table, expression_statement.expression);
}

function UpdateExpressionHandler(symbol_table, parsed_code){
    let param = parsed_code.argument.name;
    SetEntryValue(symbol_table, parsed_code, param);
}

function AssignmentExpressionHandler(symbol_table, parsed_code){
    let param = parsed_code.left.name;
    SetEntryValue(symbol_table, parsed_code, param);
}

function IfStatementHandler(symbol_table, parsed_code){
    let i = 1;
    let result_entry = CreateResultEntry(symbol_table, parsed_code);
    result.push(result_entry);

    if(parsed_code.consequent){
        i = i + 1;
        let symbol_table_cpy = CopySymbolTable(symbol_table);
        Route(symbol_table_cpy, parsed_code.consequent);
        CheckUpdatedSymbolTable(symbol_table, symbol_table_cpy, result_entry.value);
    }

    if(parsed_code.alternate){
        let symbol_table_cpy = CopySymbolTable(symbol_table);
        Route(symbol_table_cpy, parsed_code.alternate, true);

        if(parsed_code.alternate.type === 'BlockStatement') {
            CheckUpdatedSymbolTable(symbol_table, symbol_table_cpy, i.toString() + ' else');
            result.push({offset : result_entry.offset, value: "}"});
        }
    }else{
        result.push({offset : result_entry.offset, value: "}"});
    }
}

function ElseHandler(symbol_table, parsed_code){
    let result_entry = {};
    result_entry.line = parsed_code.loc.start.line;
    result_entry.offset = parsed_code.loc.start.column;
    result_entry.value = "}else {";

    result.push(result_entry);
}

function WhileStatementHandler(symbol_table, parsed_code){
    let symbol_table_cpy = CopySymbolTable(symbol_table);

    let result_entry = CreateResultEntry(symbol_table, parsed_code);
    result.push(result_entry);

    Route(CopySymbolTable(symbol_table), parsed_code.body);
    result.push({offset : result_entry.offset, value: "}"});
    CheckUpdatedSymbolTable(symbol_table, symbol_table_cpy, result_entry.value)
}

function ReturnStatementHandler(symbol_table, parsed_code){
    let result_entry = CreateResultEntry(symbol_table, parsed_code);
    result.push(result_entry);
}

function ExtractUpdatedValue(symbol_table, param, new_assigned_value){
    // if(param in symbol_table){
        let drill_down = SplitByRegex(new_assigned_value.toString());
        for(let d of drill_down){

            if(d !== "" && d in symbol_table){
                new_assigned_value = new_assigned_value.replace(d, '('+ symbol_table[d] + ')');
            }
        }
    // }

    return new_assigned_value;
}

function SetEntryValue(symbol_table, parsed_code, param){
    for(let e of entries){
        if(e['Line'] === parsed_code.loc.start.line && e['Name'] === param){
            symbol_table[param] = ExtractUpdatedValue(symbol_table, param, e['Value']);
        }
    }
}

function CopySymbolTable(symbol_table){
    let symbol_table_tmp = {};

    Object.keys(symbol_table).forEach(function(symbol) {
        symbol_table_tmp[symbol] = symbol_table[symbol];
    });

    return symbol_table_tmp;
}

function SplitByRegex(line){
    return line.split('*').join('$').split('-').join('$').split('+').join('$').split('/').join('$').split(' ').join('$').split('(').join('$').split(')').join('$').split(';').join('$').split('$');
}

function CheckUpdatedSymbolTable(symbol_table, symbol_table_tmp, condition){
    let new_symbol_table = CopySymbolTable(symbol_table);

    Object.keys(symbol_table).forEach(function(symbol) {
        if(symbol_table_tmp[symbol] !== symbol_table[symbol]){
            new_symbol_table[symbol] = symbol_table_tmp[symbol];
        }
    });

    conditions[condition] = new_symbol_table;
}

function CreateResultEntry(symbol_table, parsed_code){
    let result_entry = {};
    result_entry.line = parsed_code.loc.start.line;
    result_entry.offset = parsed_code.loc.start.column;

    let code_line = lines[result_entry.line - 1];

    let drill_down = SplitByRegex(code_line);
    for(let d of drill_down){
        if(d !== "" && d in symbol_table){
            code_line = code_line.replace(d, '('+ symbol_table[d] + ')');
        }
    }

    result_entry.value = code_line;
    return result_entry;
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