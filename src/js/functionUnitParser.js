/* --------- Global Variables --------- */

let entries = [];

/* --------- Exports --------- */

export {entries};
export {ParseFunctionUnit};

/* --------- Entry Point --------- */

function ParseFunctionUnit(functionUnit) {
    entries = [];
    RouteContent(functionUnit);
}

/* --------- Main Handlers (contain nested statements / expressions) --------- */

function RouteContent(content){
    switch(content.type) {
    case 'Program':
        FunctionDeclarationHandler(content);
        break;
    case 'BlockStatement':
        BlockStatementHandler(content);
        break;
    case 'ExpressionStatement':
        RouteContentExtension(content.expression);
        break;
    default:
        RouteContentExtension(content);
    }
}

function RouteContentExtension(statement) {
    let statementType = statement.type;

    switch(statementType) {
    case 'VariableDeclaration':
        VariableDeclarationHandler(statement.declarations);
        break;
    /*case 'VariableDeclarator':
        VariableDeclaratorHandler(statement);
        break;*/
    case 'AssignmentExpression':
        AssignmentExpressionStatementHandler(statement);
        break;
    default:
        StatementHandler(statement);
    }
}

function FunctionDeclarationHandler(functionUnit) {
    let functionDeclarationEntry = {};

    functionDeclarationEntry.Line = functionUnit.body[0].loc.start.line;
    functionDeclarationEntry.Type = 'function declaration';
    functionDeclarationEntry.Name = functionUnit.body[0].id.name;
    functionDeclarationEntry.Condition = '';
    functionDeclarationEntry.Value = '';

    entries.push(functionDeclarationEntry);

    ArgumentsHandler(functionUnit);

    let statements = functionUnit.body[0].body.body; // function's body: BlockStatement

    for(const statement in statements){
        RouteContent(statements[statement]);
    }
}

function ArgumentsHandler(functionUnit){
    for(let argument in functionUnit.body[0].params){
        let functionArgumentsEntry = {};

        functionArgumentsEntry.Line = functionUnit.body[0].params[argument].loc.start.line;
        functionArgumentsEntry.Type = 'variable declaration';
        functionArgumentsEntry.Name = functionUnit.body[0].params[argument].name;
        functionArgumentsEntry.Condition = '';
        functionArgumentsEntry.Value = '';

        entries.push(functionArgumentsEntry);
    }
}

function BlockStatementHandler(blockStatement){
    for(let i = 0; i < blockStatement.body.length; i++){
        RouteContent(blockStatement.body[i]);
    }
}

function StatementHandler(statement) {
    let statementType = statement.type;

    switch(statementType) {
    case 'WhileStatement':
        WhileStatementHandler(statement);
        break;
    case 'IfStatement':
        IfStatementHandler(statement, false);
        break;
    case 'ForStatement':
        ForStatementHandler(statement);
        break;
    case 'ReturnStatement':
        ReturnStatementHandler(statement);
        break;
    }
}

/* --------- Inner Handlers --------- */

function AssignmentExpressionStatementHandler(expressionStatement) {
    let expressionStatementEntry = {};

    expressionStatementEntry.Line = expressionStatement.loc.start.line;
    expressionStatementEntry.Type = 'assignment expression';
    expressionStatementEntry.Name = BasicExpressionExtractor(expressionStatement.left);
    expressionStatementEntry.Condition = '';
    expressionStatementEntry.Value = BasicExpressionExtractor(expressionStatement.right);

    entries.push(expressionStatementEntry);
}

function VariableDeclarationHandler(declarations){
    for(let declaration in declarations){
        let declarator = declarations[declaration];
        entries.push(VariableDeclaratorHandler(declarator));
    }
}

function VariableDeclaratorHandler(declarator){
    let variableDeclaratorEntry = {};

    variableDeclaratorEntry.Line = declarator.loc.start.line;
    variableDeclaratorEntry.Type = 'variable declaration';
    variableDeclaratorEntry.Name = declarator.id.name;
    variableDeclaratorEntry.Condition = '';
    variableDeclaratorEntry.Value = declarator.init != null ? declarator.init.value : '';

    return variableDeclaratorEntry;
}

function WhileStatementHandler(whileStatement){
    let whileStatementEntry = {};

    whileStatementEntry.Line = whileStatement.loc.start.line;

    whileStatementEntry.Type = 'while statement';
    whileStatementEntry.Name = '';
    whileStatementEntry.Condition = BasicExpressionExtractor(whileStatement.test);
    whileStatementEntry.Value = '';

    entries.push(whileStatementEntry);

    RouteContent(whileStatement.body);
}

function IfStatementHandler(ifStatement, isElseIf){
    let ifStatementEntry = {};
    ifStatementEntry.Line = ifStatement.loc.start.line;
    ifStatementEntry.Type = isElseIf === true ? 'else if statement' : 'if statement';
    ifStatementEntry.Name = '';
    ifStatementEntry.Condition = BasicExpressionExtractor(ifStatement.test);
    ifStatementEntry.Value = '';

    entries.push(ifStatementEntry);

    RouteContent(ifStatement.consequent); // handle if body

    if(ifStatement.alternate != null){ // handle 'else' or 'else if', if exists
        if(ifStatement.alternate.test != null){ // if this has a condition - then it's an 'else if' statement
            IfStatementHandler(ifStatement.alternate, true);
        }else{ // otherwise - handle else statement's body
            RouteContent(ifStatement.alternate);
        }
    }
}

function ForStatementHandler(forStatement){
    let forStatementEntry = {};

    forStatementEntry.Line = forStatement.loc.start.line;
    forStatementEntry.Type = 'for statement';
    forStatementEntry.Name = '';
    forStatementEntry.Condition = ForConditionExtractor(forStatement);
    forStatementEntry.Value = '';

    entries.push(forStatementEntry);

    RouteContent(forStatement.body);
}

function ReturnStatementHandler(returnStatement){
    let returnStatementEntry = {};

    returnStatementEntry.Line = returnStatement.loc.start.line;
    returnStatementEntry.Type = 'return statement';
    returnStatementEntry.Name = '';
    returnStatementEntry.Condition = '';
    returnStatementEntry.Value = BasicExpressionExtractor(returnStatement.argument);

    entries.push(returnStatementEntry);
}

/* --------- Expression Extractors --------- */

/**
 * @return {string}
 */
function BasicExpressionExtractor(expression){
    let expressionType = expression.type;

    switch(expressionType) {
    case 'Identifier':
        return expression.name + '';
    case 'Literal':
        return expression.value + '';
    case 'MemberExpression':
        return BasicExpressionExtractor(expression.object) + '[' + BasicExpressionExtractor(expression.property) + ']';
    case 'UnaryExpression':
        return expression.operator + '' + BasicExpressionExtractor(expression.argument);
    default:
        return BasicExpressionExtractor(expression.left) + ' ' + expression.operator + ' ' + BasicExpressionExtractor(expression.right);
    }
}

/**
 * @return {string}
 */
function ForConditionExtractor(forStatement){
    let init = forStatement.init.declarations[0].id.name + ' = ' +forStatement.init.declarations[0].init.value;
    let test = forStatement.test.left.name + ' ' + forStatement.test.operator + ' ' + BasicExpressionExtractor(forStatement.test.right);
    let update =
        forStatement.update.argument == null ?
            forStatement.update.left.name + ' ' + forStatement.update.operator + ' ' + BasicExpressionExtractor(forStatement.update.right) :
            forStatement.update.argument.name + forStatement.update.operator; // x++

    return init + '; ' + test + '; ' + update;
}