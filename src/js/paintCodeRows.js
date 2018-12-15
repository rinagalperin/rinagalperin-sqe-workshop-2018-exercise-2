export {PaintCodeRows};
export {extractParameters};

let parameters;

function PaintCodeRows(substitutedCode, conditions, symbol_table, input_vector_string, args) {
    // extract the given function's parameters
    parameters = extractParameters(input_vector_string);

    // apply to symbol table
    let func_args = {};
    let i = 0;
    for(let arg of args){
        func_args[arg] = parameters[i];
        i++;
    }

    let str = "";
    for(let line of substitutedCode){
        str += line.value + '<br>';
    }

    document.getElementById("parsedCode").innerHTML = str;

    //console.log(func_args);


    //
    // Object.keys(symbol_table).forEach(function(symbol) {
    //     Object.keys(func_args).forEach(function(arg) {
    //         console.log(symbol_table[symbol])
    //         console.log(arg)
    //         // if(arg in symbol_table[symbol]){
    //         //     symbol_table[symbol].replace(arg, func_args[arg]);
    //         // }
    //     });
    // });
    //
    // console.log(symbol_table);

    // check if-else conditions and paint rows accordingly
}

function extractParameters(parameters_string){
    parameters = [];
    let i = 0;

    while(i < parameters_string.length){
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