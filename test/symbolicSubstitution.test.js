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

    it('is parsing an empty args function correctly', () => {
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

    it('is parsing an empty args function correctly', () => {
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

    it('is parsing an empty args function correctly', () => {
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
});