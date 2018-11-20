import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing a function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(){\n' +
                '    return -1;\n' +
                '\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":null,"value":null},' +
            '{"line":2,"type":"ReturnStatement","name":null,"condition":null,"value":"-1"}]'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '[{"line":1,"type":"VariableDeclarator","name":"a","condition":null,"value":"1"}]'
        );
    });

    it('is parsing an empty code', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing a while and if statement', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(n){\n' +
                '    while (low <= high) {\n' +
                '        mid = (low + high)/2;\n' +
                '        if (X < V[mid])\n' +
                '            high = mid - 1;\n' +
                '        else if (X > V[mid])\n' +
                '            low = mid + 1;\n' +
                '        else\n' +
                '            return mid;\n' +
                '    }\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"binarySearch","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"WhileStatement","name":null,"condition":"low <= high","value":null},' +
            '{"line":3,"type":"AssignmentExpression","name":"mid","condition":null,"value":"(low + high)/2"},' +
            '{"line":4,"type":"IfStatement","name":null,"condition":"X < V[mid]","value":null},' +
            '{"line":5,"type":"AssignmentExpression","name":"high","condition":null,"value":"mid - 1"},' +
            '{"line":6,"type":"IfStatement","name":null,"condition":"X > V[mid]","value":null},' +
            '{"line":7,"type":"AssignmentExpression","name":"low","condition":null,"value":"mid + 1"},' +
            '{"line":9,"type":"ReturnStatement","name":null,"condition":null,"value":"mid"}]'
        );
    });

    it('is parsing a for loop', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(n){\n' +
                '   let a = 5;\n' +
                '   for(let i = 2; i < a; i++){\n' +
                '\n' +
                '   }\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"VariableDeclarator","name":"a","condition":null,"value":"5"},' +
            '{"line":3,"type":"ForStatement","name":null,"condition":"let i = 2; ; i < a ; i++","value":null}]'
        );
    });

    it('is parsing a for loop without init', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(n){\n' +
                '   let a = 5;\n' +
                '   for(; i < a; i++){\n' +
                '\n' +
                '   }\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"VariableDeclarator","name":"a","condition":null,"value":"5"},' +
            '{"line":3,"type":"ForStatement","name":null,"condition":" ; i < a ; i++","value":null}]'
        );
    });

    it('is parsing a for loop without init', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(n){\n' +
                '   let a = 5;\n' +
                '   for(; i < a; i++){\n' +
                '      let b = 1;\n' +
                '   }\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"VariableDeclarator","name":"a","condition":null,"value":"5"},' +
            '{"line":3,"type":"ForStatement","name":null,"condition":" ; i < a ; i++","value":null},' +
            '{"line":4,"type":"VariableDeclarator","name":"b","condition":null,"value":"1"}]'
        );
    });

    it('is parsing let and array', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(n){\n' +
                '   let a = 5;\n' +
                '   let b = [1 , 2];\n' +
                '   a = b[1];\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"VariableDeclarator","name":"a","condition":null,"value":"5"},' +
            '{"line":3,"type":"VariableDeclarator","name":"b","condition":null,"value":"[1 , 2]"},' +
            '{"line":4,"type":"AssignmentExpression","name":"a","condition":null,"value":"b[1]"}]'
        );
    });

    it('is parsing a for in loop', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(n){\n' +
                '  let a , b = [1 , 2, 3];\n' +
                '  a = 3;\n' +
                '  for(a in b){\n' +
                '   a = i;\n' +
                '}\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"VariableDeclarator","name":"a","condition":null,"value":"null"},' +
            '{"line":2,"type":"VariableDeclarator","name":"b","condition":null,"value":"[1 , 2, 3]"},' +
            '{"line":3,"type":"AssignmentExpression","name":"a","condition":null,"value":"3"},' +
            '{"line":4,"type":"ForInStatement","name":null,"condition":"a in b","value":null},' +
            '{"line":5,"type":"AssignmentExpression","name":"a","condition":null,"value":"i"}]'
        );
    });

    it('is parsing if without else', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(n){\n' +
                '  let a = 1;\n' +
                '  if(a == 1){\n' +
                '     let b = 2;\n' +
                '  }\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"VariableDeclarator","name":"a","condition":null,"value":"1"},' +
            '{"line":3,"type":"IfStatement","name":null,"condition":"a == 1","value":null},' +
            '{"line":4,"type":"VariableDeclarator","name":"b","condition":null,"value":"2"}]'
        );
    });

    it('is parsing binary expression', () => {
        assert.equal(
            JSON.stringify(parseCode('function test(n){\n' +
                '  let b = 2;\n' +
                '  let a = 1+b*5;\n' +
                '\n' +
                '  return b;\n' +
                '}')),
            '[{"line":1,"type":"FunctionDeclaration","name":"test","condition":null,"value":null},' +
            '{"line":1,"type":"VariableDeclarator","name":"n","condition":null,"value":null},' +
            '{"line":2,"type":"VariableDeclarator","name":"b","condition":null,"value":"2"},' +
            '{"line":3,"type":"VariableDeclarator","name":"a","condition":null,"value":"1+b*5"},' +
            '{"line":5,"type":"ReturnStatement","name":null,"condition":null,"value":"b"}]'
        );
    });
});
