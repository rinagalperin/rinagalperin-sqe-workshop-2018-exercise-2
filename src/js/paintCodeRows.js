export {PaintCodeRows};
export {extractParameters};

let parameters;

function PaintCodeRows(substitutedCode, parameters_string) {
    parameters = [];
    extractParameters(parameters_string);
    console.log(parameters);
}

function extractParameters(parameters_string){
    let i = 0;

    while(i < parameters_string.length){
        // ARRAY
        if(i < parameters_string.length && parameters_string.charAt(i) === '['){
            let j = i + 1;
            while(j < parameters_string.length && parameters_string.charAt(j) !== ']'){
                j += 1;
            }

            j += 1;

            let arrayParameter = parameters_string.substring(i, j);
            parameters.push(arrayParameter);

            i = j;
        }
        // WHITE SPACE
        else if(i < parameters_string.length && (parameters_string.charAt(i) === ' ' || parameters_string.charAt(i) === ',')){
            i += 1;
        }
        // STRING
        else if(i < parameters_string.length && parameters_string.charAt(i) === '\''){
            let j = i + 1;
            while(j < parameters_string.length && parameters_string.charAt(j) !== '\''){
                j += 1;
            }
            j += 1;

            let stringParameter = parameters_string.substring(i, j);

            parameters.push(stringParameter);
            i = j;
        }
        // REGULAR PARAMETER
        else{
            let j = i + 1;
            while(j < parameters_string.length && parameters_string.charAt(j) !== ','){
                j += 1;
            }

            let regularParameter = parameters_string.substring(i, j);

            parameters.push(regularParameter);
            i = j;
        }
    }
}