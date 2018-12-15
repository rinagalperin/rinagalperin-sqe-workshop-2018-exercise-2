export {PaintCodeRows};
export {extractParameters};

let parameters;

function subInExpr(func_args, expr){
    let sub_expr = expr;
    Object.keys(func_args).forEach(function (arg) {
        if (expr.includes(arg)) {
            sub_expr = sub_expr.replace(arg, func_args[arg])
        }
    });
    return sub_expr
}

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

    let ifStack = [];

    let str = "";
    let isIf = false;

    for(let line of substitutedCode){
        let sub_expr = "";
        let color = false;
        if(line.value.includes('else if')){
            let expr = line.value.split("else if")[1].replace("{","");
            sub_expr = subInExpr(func_args, expr);
            color = eval(sub_expr) && !isIf;
            isIf = !color;
            ifStack.pop();
            ifStack.push(color);
        }
        else if(line.value.includes('if')) {
            let expr = line.value.split("if")[1].replace("{", "");
            sub_expr = subInExpr(func_args, expr);
            color = eval(sub_expr);
            isIf = color;
            ifStack.push(color);
        }else if(line.value.includes('else')) {
            color = !isIf;
            sub_expr = "true";
        }else if(line.value.includes('while')) {
            let expr = line.value.split("while")[1].replace("{", "");
            sub_expr = subInExpr(func_args, expr);
            color = eval(sub_expr);
        }else if(line.value === "}") {
            ifStack.pop();
            isIf = ifStack.pop();
        }

        if(sub_expr != "") {
            if(eval(sub_expr) && color)
                str += '<div style="background-color: #90EE90">' + GetSpaces(line.offset) +  line.value + '</div> <br>';
            else
                str += '<div style="background-color: #ff5442">' + GetSpaces(line.offset) + line.value + '</div> <br>';
        }else{
            str += GetSpaces(line.offset) + line.value + '<br>';
        }
    }

    document.getElementById("parsedCode").innerHTML = str;
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

function GetSpaces(offset){
    let i = 1;
    let ans = '';

    while(i <= offset){
        ans += '&nbsp;';
        i++;
    }

    return ans;
}