export {PaintCodeRows};
export {extractParameters};

let parameters;

function PaintCodeRows(substitutedCode, parameters_string) {
    // extract the given function's parameters
    parameters = extractParameters(parameters_string);

    // apply to symbol table

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