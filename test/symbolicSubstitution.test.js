/* eslint-disable */

import assert from 'assert';
import {SymbolicSubstitution} from '../src/js/symbolicSubstitution';

describe('The symbolic substitution parser', () => {
    it('is parsing an empty function body correctly', () => {
        // arrange
        let symbol_table = {"x": "x", "y": "y", "z": "z"};

        // act
        let actual = SymbolicSubstitution('function f(x, y, z){' + '\n' + '}');
        let expected = {result: [
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 1,
                    "offset": 0,
                    "value": "function f(x, y, z){"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: ["x", "y", "z"]};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing empty args correctly', () => {
        // arrange
        let symbol_table = {};

        // act
        let actual = SymbolicSubstitution('function f(){' + '\n' + '}');
        let expected = {result: [
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 1,
                    "offset": 0,
                    "value": "function f(){"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: []};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a basic global variable correctly', () => {
        // arrange
        let symbol_table = {x: "10"};

        // act
        let actual = SymbolicSubstitution('let x = 0;' + '\n' + 'function f(){' + '\n' + 'x = 10;' + '\n' + '}');
        let expected = {result: [
                {
                    "line": 1,
                    "offset": 0,
                    "value": "let x = 0;"
                },
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 2,
                    "offset": 0,
                    "value": "function f(){"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: []};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a simple if statement correctly', () => {
        // arrange
        let symbol_table = {x: "(0) + 1"};

        // act
        let actual = SymbolicSubstitution(
            'let x = 0;' + '\n' +
            'function f(){' + '\n' +
            'if(x > 1){' + '\n' +
            'x = 0;' + '\n' +
            '}' + '\n' +
            'x = x + 1;' + '\n' +
            '}');

        let expected = {result: [
                {
                    "line": 1,
                    "offset": 0,
                    "value": "let x = 0;"
                },
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 2,
                    "offset": 0,
                    "value": "function f(){"
                },
                {
                    "line": 3,
                    "offset": 0,
                    "value": "if((0) > 1){"
                },
                {
                    "offset": 0,
                    "value": "}"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: []};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a function with arguments correctly', () => {
        // arrange
        let symbol_table = {x: "(x) + 1"};

        // act
        let actual = SymbolicSubstitution(
            'function f(x){' + '\n' +
            'if(x > 1){' + '\n' +
            'x = 0;' + '\n' +
            '}' + '\n' +
            'x = x + 1;' + '\n' +
            '}');

        let expected = {result: [
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 1,
                    "offset": 0,
                    "value": "function f(x){"
                },
                {
                    "line": 2,
                    "offset": 0,
                    "value": "if((x) > 1){"
                },
                {
                    "offset": 0,
                    "value": "}"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: ["x"]};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a function with several arguments correctly', () => {
        // arrange
        let symbol_table = {x: "(x) + 1", y: "y", z: "z"};

        // act
        let actual = SymbolicSubstitution(
            'function f(x, y, z){' + '\n' +
            'if(x > 1){' + '\n' +
            'x = 0;' + '\n' +
            '}' + '\n' +
            'x = x + 1;' + '\n' +
            '}');

        let expected = {result: [
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 1,
                    "offset": 0,
                    "value": "function f(x, y, z){"
                },
                {
                    "line": 2,
                    "offset": 0,
                    "value": "if((x) > 1){"
                },
                {
                    "offset": 0,
                    "value": "}"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: ["x", "y", "z"]};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a function with array argument correctly', () => {
        // arrange
        let symbol_table = {x: "x", y: "x[0]", z: "z"};

        // act
        let actual = SymbolicSubstitution(
            'function f(x, y, z){' + '\n' +
            'y = x[0];' + '\n' +
            'if(y > 1){' + '\n' +
            '}' + '\n' +
            '}');

        let expected = {result: [
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 1,
                    "offset": 0,
                    "value": "function f(x, y, z){"
                },
                {
                    "line": 3,
                    "offset": 0,
                    "value": "if((x[0]) > 1){"
                },
                {
                    "offset": 0,
                    "value": "}"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: ["x", "y", "z"]};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a function with else-if correctly', () => {
        // arrange
        let symbol_table = {a: "10 + 1", c: "6 + 1", d: "[5, 6, 7]", p: "[10, 3]", x: "x", y: "y", z: "z"};

        // act
        let actual = SymbolicSubstitution('let p = [10,3];\n' +
            'function foo(x, y, z){\n' +
            '    let a = p[0] + 1;\n' +
            '    let d = [5,6,7];\n' +
            '    let c = d[1]+1;\n' +
            '\n' +
            '    if (d > c) {\n' +
            '            if(x>=0){\n' +
            '                 c = c + 5;\n' +
            '            }\n' +
            '    } else if (d < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        return x + y + z + c;\n' +
            '    }\n' +
            '}');

        let expected = {result: [
                {
                    "line": 1,
                    "offset": 0,
                    "value": "let p = [10, 3];"
                },
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 2,
                    "offset": 0,
                    "value": "function foo(x, y, z){"
                },
                {
                    "line": 7,
                    "offset": 4,
                    "value": "if (([5, 6, 7]) > (6 + 1)) {"
                },
                {
                    "line": 8,
                    "offset": 12,
                    "value": "if(x>=0){"
                },
                {
                    "offset": 12,
                    "value": "}"
                },
                {
                    "line": 11,
                    "offset": 11,
                    "value": "} else if (([5, 6, 7]) < (z) * 2) {"
                },
                {
                    "line": 13,
                    "offset": 11,
                    "value": "}else {"
                },
                {
                    "line": 15,
                    "offset": 8,
                    "value": "return (x) + (y) + (z) + (((6 + 1) + (z)) + 5);"
                },
                {
                    "offset": 11,
                    "value": "}"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: ["x", "y", "z"]};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a function with update expression no init correctly', () => {
        // arrange
        let symbol_table = {x: "x", y: "x[0]", z: "z", d: "++(4)"};

        // act
        let actual = SymbolicSubstitution(
            'function f(x, y, z){' + '\n' +
            'y = x[0];' + '\n' +
            'let d = 4;' + '\n' +
            '++d;' + '\n' +
            '}');

        let expected = {result: [
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 1,
                    "offset": 0,
                    "value": "function f(x, y, z){"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: ["x", "y", "z"]};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a basic global variable no init correctly', () => {
        // arrange
        let symbol_table = {x: ""};

        // act
        let actual = SymbolicSubstitution('let x;' + '\n' + 'function f(){' + '\n' + '}');
        let expected = {result: [
                {
                    "line": 1,
                    "offset": 0,
                    "value": "let x;"
                },
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 2,
                    "offset": 0,
                    "value": "function f(){"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: []};

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a while statement correctly', () => {
        // arrange
        let symbol_table = {x: "x"};

        // act
        let actual = SymbolicSubstitution(
            'function f(x){\n' +
            'while(x > 10){\n' +
            '}\n' +
            '}');

        let expected = {result: [
                {
                    "offset": 0,
                    "value": ""
                },
                {
                    "line": 1,
                    "offset": 0,
                    "value": "function f(x){"
                },
                {
                    "line": 2,
                    "offset": 0,
                    "value": "while((x) > 10){"
                },
                {
                    "offset": 0,
                    "value": "}"
                },
                {
                    "value": "}"
                }
            ], symbol_table: symbol_table, args: ["x"]};

        // assert
        assert.deepEqual(actual, expected);
    });


});