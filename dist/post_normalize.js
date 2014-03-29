/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/post_normalize.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri-ast-zipper", "khepri-ast/statement", "khepri-ast/expression",
    "khepri-ast/pattern", "khepri-ast/value", "./ast", "./fun", "./unpack", "./builtin", "./rewritter"
], (function(require, exports, __o, ast_statement, ast_expression, ast_pattern, ast_value, __o0, __o1, __o2, __o3,
    __o4) {
    "use strict";
    var khepriZipper = __o["khepriZipper"],
        isBlockFunction = __o0["isBlockFunction"],
        concat = __o1["concat"],
        flattenr = __o1["flattenr"],
        filter = __o1["filter"],
        map = __o1["map"],
        innerPattern = __o2["innerPattern"],
        unpackParameters = __o2["unpackParameters"],
        builtins = __o3["builtins"],
        definitions = __o3["definitions"],
        UP = __o4["UP"],
        DOWN = __o4["DOWN"],
        Rewritter = __o4["Rewritter"],
        rewrite = __o4["rewrite"],
        normalize, expandBinding, always = (function(_) {
            return true;
        }),
        peepholes = new(Rewritter)();
    peepholes.add(["LetExpression"], UP, always, ((expandBinding = (function(binding) {
        return innerPattern(binding.value, binding.pattern, binding.recursive);
    })), (function(node) {
        return ast_expression.LetExpression.create(node.loc, flattenr(map(expandBinding, node.bindings)),
            node.body);
    })));
    peepholes.add(["FunctionExpression"], UP, always, (function(node) {
        var params = map((function(x) {
            switch (x.type) {
                case "IdentifierPattern":
                    return x;
                default:
                    return ast_pattern.IdentifierPattern.create(null, ((x.id && x.id.id) || x.ud
                        .id));
            }
        }), filter((function(x) {
            return (x.type !== "EllipsisPattern");
        }), node.params.elements)),
            bindings = unpackParameters(node.params.elements),
            body = (isBlockFunction(node) ? ast_statement.BlockStatement.create(null, [ast_statement.WithStatement
                .create(null, bindings, node.body)
            ]) : ast_expression.LetExpression.create(null, bindings, node.body));
        return ast_expression.FunctionExpression.create(null, node.id, ast_pattern.ArgumentsPattern.create(
            null, node.params.id, params, node.params.self), body);
    }));
    var expandAssignment = (function(node) {
        var right;
        return ((node.right.type === "AssignmentExpression") ? ((right = expandAssignment(node.right)),
            concat(right, ast_expression.AssignmentExpression.create(null, "=", node.left, right[(right
                .length - 1)].left))) : [node]);
    });
    peepholes.add(["ExpressionStatement"], UP, (function(__o5) {
        var expression = __o5["expression"];
        return (expression.type === "AssignmentExpression");
    }), (function(node) {
        return ast_statement.BlockStatement.create(null, map(ast_statement.ExpressionStatement.create.bind(
            null, null), flattenr(expandAssignment(node.expression))));
    }));
    peepholes.add(["BinaryExpression"], UP, (function(node) {
        return (node.operator === "|>");
    }), (function(__o5) {
        var left = __o5["left"],
            right = __o5["right"];
        return ast_expression.CallExpression.create(null, right, [left]);
    }));
    peepholes.add(["BinaryExpression"], UP, (function(node) {
        return (node.operator === "<|");
    }), (function(__o5) {
        var left = __o5["left"],
            right = __o5["right"];
        return ast_expression.CallExpression.create(null, left, [right]);
    }));
    peepholes.add(["BinaryExpression"], UP, (function(node) {
        return ((((node.operator === "\\>") || (node.operator === "\\>>")) || (node.operator === "<\\")) ||
            (node.operator === "<<\\"));
    }), (function(__o5) {
        var operator = __o5["operator"],
            left = __o5["left"],
            right = __o5["right"];
        return ast_expression.CallExpression.create(null, definitions[operator], [left, right]);
    }));
    var x = khepriZipper,
        y = rewrite.bind(null, peepholes);
    (normalize = (function(x0) {
        return y(x(x0));
    }));
    (exports["normalize"] = normalize);
}));