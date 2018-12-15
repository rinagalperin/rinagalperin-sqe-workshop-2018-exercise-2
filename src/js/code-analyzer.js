/* eslint-disable semi */
import {SymbolicSubstitution} from './symbolicSubstitution.js';
import {PaintCodeRows} from './paintCodeRows.js';

const parseCode = (functionCode, parameters) => {
    let result = SymbolicSubstitution(functionCode);
    let substitutedCode = result.result;
    let conditions = result.conditions;
    let symbol_table = result.symbol_table;
    let args = result.args;

    // console.log(substitutedCode);
    // console.log(conditions);

    return PaintCodeRows(substitutedCode, conditions, symbol_table, parameters, args);
};

export {parseCode};