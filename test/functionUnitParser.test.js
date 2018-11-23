import assert from 'assert';
import {ParseFunctionUnit} from '../src/js/functionUnitParser';
import {parseCode} from '../src/js/code-analyzer';
import {entries} from '../src/js/functionUnitParser';

/* --------- If Statement Tests --------- */

describe('The if statement parser', () => {
    it('is parsing a simple condition correctly', () => {
        // arrange
        let codeToTest = 'function f(){if(x > 10){x = 9}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'if statement', Name: '', Condition: 'x > 10', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '9'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing an empty action correctly', () => {
        // arrange
        let codeToTest = 'function f(){if(x > 10){}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'if statement', Name: '', Condition: 'x > 10', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing an else portion correctly', () => {
        // arrange
        let codeToTest = 'function f(){if(x > 10){x = 9}else{x = 8}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'if statement', Name: '', Condition: 'x > 10', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '9'},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '8'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing an \'else if\' portion correctly', () => {
        // arrange
        let codeToTest = 'function f(){if(x > 10){x = 9}else if(x < 5){x = 8}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'if statement', Name: '', Condition: 'x > 10', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '9'},
            {Line: 1, Type: 'else if statement', Name: '', Condition: 'x < 5', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '8'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing an \'else if\' and \'else\' portions correctly', () => {
        // arrange
        let codeToTest = 'function f(x, y){if(x > 10){x = 9}else if(x < 5){x = 8}else{x = x - y; return x;}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'y', Condition: '', Value: ''},
            {Line: 1, Type: 'if statement', Name: '', Condition: 'x > 10', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '9'},
            {Line: 1, Type: 'else if statement', Name: '', Condition: 'x < 5', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '8'},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: 'x - y'},
            {Line: 1, Type: 'return statement', Name: '', Condition: '', Value: 'x'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });
});

/* --------- For Statement Tests --------- */

describe('The for statement parser', () => {
    it('is parsing a simple condition correctly', () => {
        // arrange
        let codeToTest = 'function f(){for(let x = 0; x < 10; x = x + 1){}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'for statement', Name: '', Condition: 'x = 0; x < 10; x = x + 1', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a simple condition correctly', () => {
        // arrange
        let codeToTest = 'function f(){for(x = -y; x < 10; ++x){}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'for statement', Name: '', Condition: 'x = -y; x < 10; ++x', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a simple condition correctly', () => {
        // arrange
        let codeToTest = 'function f(){for(let x = x-y; x < 10; ++x){}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'for statement', Name: '', Condition: 'x = x - y; x < 10; ++x', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a simple assignment correctly', () => {
        // arrange
        let codeToTest = 'function f(){for(let x = 0; x < 10; x = x + 1){x = x - 1;}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'for statement', Name: '', Condition: 'x = 0; x < 10; x = x + 1', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: 'x - 1'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a \'++\' update expression correctly', () => {
        // arrange
        let codeToTest = 'function f(){for(let x = 0; x < 10; x++){}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'for statement', Name: '', Condition: 'x = 0; x < 10; x++', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });
});

/* --------- While Statement Tests --------- */

describe('The while statement parser', () => {
    it('is parsing a simple condition correctly', () => {
        // arrange
        let codeToTest = 'function f(){while(x > 10){}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'while statement', Name: '', Condition: 'x > 10', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a simple assignment correctly', () => {
        // arrange
        let codeToTest = 'function f(){while(x > 10){x = x - 1}}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'while statement', Name: '', Condition: 'x > 10', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: 'x - 1'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });
});

/* --------- Return Statement Test --------- */

describe('The return statement parser', () => {
    it('is parsing a simple return statement correctly', () => {
        // arrange
        let codeToTest = 'function f(x){return x;}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'return statement', Name: '', Condition: '', Value: 'x'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing a simple return statement correctly', () => {
        // arrange
        let codeToTest = 'function f(x){return;}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'return statement', Name: '', Condition: '', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });
});

/* --------- Variable Declaration Test --------- */

describe('The variable declarator parser', () => {
    it('is parsing a simple variable declaration correctly', () => {
        // arrange
        let codeToTest = 'function f(){let x = 10;}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: '10'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });
});

describe('The variable declarations parser', () => {
    it('is parsing simple variable declarations correctly', () => {
        // arrange
        let codeToTest = 'function f(){let x, y, z;}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'y', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'z', Condition: '', Value: ''}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });
});

/* ---------  Assignment Expression Test --------- */

describe('The assignment expression parser', () => {
    it('is parsing simple assignment expression correctly', () => {
        // arrange
        let codeToTest = 'function f(x, y){x = y[x];}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'y', Condition: '', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: 'y[x]'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing simple unary expression correctly', () => {
        // arrange
        let codeToTest = 'function f(x, y){x = -y;}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'y', Condition: '', Value: ''},
            {Line: 1, Type: 'assignment expression', Name: 'x', Condition: '', Value: '-y'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing simple update expression with prefix correctly', () => {
        // arrange
        let codeToTest = 'function f(x){--x;}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'update expression', Name: 'x', Condition: '', Value: '--x'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });

    it('is parsing simple update expression without correctly', () => {
        // arrange
        let codeToTest = 'function f(x){x++;}';

        // act
        ParseFunctionUnit(parseCode(codeToTest));
        let actual = entries;
        let expected = [
            {Line: 1, Type: 'function declaration', Name: 'f', Condition: '', Value: ''},
            {Line: 1, Type: 'variable declaration', Name: 'x', Condition: '', Value: ''},
            {Line: 1, Type: 'update expression', Name: 'x', Condition: '', Value: 'x++'}
        ];

        // assert
        assert.deepEqual(actual, expected);
    });
});