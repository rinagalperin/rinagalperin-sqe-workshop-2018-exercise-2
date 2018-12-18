import {SymbolicSubstitution} from './symbolicSubstitution.js';

export {parseCode};

const parseCode = (functionCode, parameters) => {
    let params = ExtractParameters(parameters);
    let substitution_result = SymbolicSubstitution(functionCode);
    console.log(substitution_result)

    let substitutedCode = substitution_result.result;
    //let conditions = substitution_result.conditions;
    let symbol_table = substitution_result.symbol_table;
    let args = substitution_result.args;

    return [substitutedCode, symbol_table, params, args];
};

function ExtractParameters(parameters_string){
    let parameters = [];
    let i = 0;

    while(parameters_string !== undefined && i < parameters_string.length){
        // ARRAY
        if(i < parameters_string.length && parameters_string.charAt(i) === '['){
            let ans = compareParameter(parameters_string, i, ']', true);

            parameters.push(ans.parameter);
            i = ans.i;
        }
        // WHITE SPACE
        else if(i < parameters_string.length && (parameters_string.charAt(i) === ' ' || parameters_string.charAt(i) === ',')){
            i += 1;
        }
        // STRING
        else if(i < parameters_string.length && parameters_string.charAt(i) === '\''){
            let ans = compareParameter(parameters_string, i, '\'', true);

            parameters.push(ans.parameter);
            i = ans.i;
        }
        // REGULAR PARAMETER
        else{
            let ans = compareParameter(parameters_string, i, ',', false);

            parameters.push(ans.parameter);
            i = ans.i;
        }
    }

    return parameters;
}

function compareParameter(parameters_string, i, notEqual, extra){
    let j = i + 1;
    while(j < parameters_string.length && parameters_string.charAt(j) !== notEqual.toString()){
        j += 1;
    }

    let parameter = parameters_string.substring(i, extra ? j + 1 : j);

    let ans = [];

    ans.i = extra ? j + 1 : j;
    ans.parameter = parameter;

    return ans;
}