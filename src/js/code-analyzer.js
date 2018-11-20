// import * as esprima from 'esprima';
var esprima = require('esprima');

function table(line , type , name , condition , value)
{
    this.line = line;
    this.type = type;
    this.name = name;
    this.condition = condition;
    this.value = value;
}

var my_table = [];

const push = (line , type , name , condition , value) => {
    my_table.push(new table(line , type , name , condition , value ));
};

const parseCode = (codeToParse) => {
    let obj = JSON.parse(JSON.stringify(esprima.parseScript(codeToParse , {loc: true , range: true})));
    my_table = [];
    if(obj.body[0] != null)
        funcParsers[(obj.body[0].type)](codeToParse , obj.body[0]);

    return my_table;
};

const parseHelper = (str , parsed_code) => {
    funcParsers[(parsed_code.type)](str , parsed_code);
};

const blockStatementP = (str , parsed_code) => {
    parsed_code.body.map((param) => parseHelper(str , param) );
};

const functionDeclarationP = (str , parsed_code) => {
    push( parsed_code.loc.start.line , parsed_code.type , parsed_code.id.name , null , null);
    parsed_code.params.map((param) => { push(param.loc.start.line , 'VariableDeclarator' , param.name , null , null );});

    parseHelper(str , parsed_code.body);
};

const variableDeclarationP = (str , parsed_code) => {
    parsed_code.declarations.map((param) => {parseHelper(str , param);});
};

const variableDeclaratorP = (str , parsed_code) => {
    var value = 'null';
    if (parsed_code.init != null)
        value = str.substring(parsed_code.init.range[0] , parsed_code.init.range[1]);

    push(parsed_code.loc.start.line, parsed_code.type, parsed_code.id.name, null, value);
};

const expressionStatementP = (str , parsed_code) =>
    parseHelper(str , parsed_code.expression);

const assignmentExpressionP = (str , parsed_code) =>
    push(parsed_code.loc.start.line , parsed_code.type , parsed_code.left.name , null , str.substring(parsed_code.right.range[0], parsed_code.right.range[1])/*rsHelper(parsed_code.right)*/);

const whileStatementP = (str , parsed_code) => {
    push(parsed_code.loc.start.line , parsed_code.type , null , str.substring(parsed_code.test.range[0] , parsed_code.test.range[1]) , null );
    parseHelper(str , parsed_code.body);
};

const ifStatementP = (str , parsed_code) => {
    push(parsed_code.loc.start.line , parsed_code.type , null , str.substring(parsed_code.test.range[0] , parsed_code.test.range[1])  , null);
    parseHelper(str , parsed_code.consequent);
    if( parsed_code.alternate != null )
        parseHelper(str , parsed_code.alternate);
};

const returnStatementP = (str , parsed_code) => {
    push(parsed_code.loc.start.line , parsed_code.type , null , null , str.substring(parsed_code.argument.range[0] , parsed_code.argument.range[1]));
};

const forStatementP = (str , parsed_code) => {
    var init;
    if(parsed_code.init == null)
        init = '';
    else
        init = str.substring(parsed_code.init.range[0] , parsed_code.init.range[1]);
    var for_test = init + ' ; ' +  str.substring(parsed_code.test.range[0] , parsed_code.test.range[1]) + ' ; '  + str.substring(parsed_code.update.range[0] , parsed_code.update.range[1]);
    push(parsed_code.loc.start.line , parsed_code.type , null ,for_test , null);

    parseHelper(str , parsed_code.body);
};

const forInStatementP = (str , parsed_code) => {
    let forin_test = str.substring(parsed_code.left.range[0] , parsed_code.left.range[1]) + ' in ' + str.substring(parsed_code.right.range[0] , parsed_code.right.range[1]);
    push(parsed_code.loc.start.line , parsed_code.type , null ,forin_test , null);
    parseHelper(str , parsed_code.body);
};

const funcParsers  =  {
    'FunctionDeclaration': functionDeclarationP,
    'BlockStatement': blockStatementP,
    'VariableDeclaration': variableDeclarationP,
    'VariableDeclarator': variableDeclaratorP,
    'ExpressionStatement': expressionStatementP,
    'AssignmentExpression': assignmentExpressionP,
    'WhileStatement': whileStatementP,
    'IfStatement': ifStatementP,
    'ReturnStatement': returnStatementP,
    'ForStatement': forStatementP,
    'ForInStatement': forInStatementP
};

// export {parseCode};
module.exports = {parseCode};
