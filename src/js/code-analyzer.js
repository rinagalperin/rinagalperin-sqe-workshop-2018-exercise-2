/* eslint-disable semi */
import {SymbolicSubstitution} from './symbolicSubstitution.js';
import {PaintCodeRows} from './paintCodeRows.js';

const parseCode = (functionCode, parameters) => {
    let substitutedCode = SymbolicSubstitution(functionCode);
    return PaintCodeRows(substitutedCode, parameters);
};

export {parseCode};