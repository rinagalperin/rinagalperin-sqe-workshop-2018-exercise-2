import {SymbolicSubstitution} from './symbolicSubstitution.js';

export {parseCode};

const parseCode = (functionCode) => {
    let substitution_result = SymbolicSubstitution(functionCode);

    let substitutedCode = substitution_result.result;
    let symbol_table = substitution_result.symbol_table;
    let args = substitution_result.args;

    return [substitutedCode, symbol_table, args];
};