/*
 * THIS FILE IS AUTO GENERATED from 'lib/post_normalize.kep'
 * DO NOT EDIT
*/define(["require", "exports", "neith/tree", "neith/walk", "neith/zipper", "khepri-ast-zipper", "khepri-ast/node",
    "khepri-ast/declaration", "khepri-ast/statement", "khepri-ast/expression", "khepri-ast/pattern",
    "khepri-ast/package", "khepri-ast/value", "./fun", "./unpack"
], (function(require, exports, tree, __o, zipper, __o0, __o1, ast_declaration, ast_statement, ast_expression,
    ast_pattern, ast_package, ast_value, fun, innerPattern) {
    "use strict";
    var walk = __o["walk"],
        khepriZipper = __o0["khepriZipper"],
        setData = __o1["setData"],
        flattenr = fun["flattenr"],
        normalize, unpackParameters = (function(elements) {
            return fun.map((function(x) {
                switch (x.type) {
                    case "SinkPattern":
                    case "IdentifierPattern":
                        return [];
                    case "AsPattern":
                        return fun.flatten(innerPattern(x.id, x.target));
                    default:
                        return innerPattern(x, x);
                }
            }), elements);
        }),
        DOWN = false,
        UP = true,
        peepholes = ({}),
        addPeephole = (function(types, up, condition, f) {
            var entry = ({
                "condition": condition,
                "map": f,
                "up": up
            });
            types.forEach((function(type) {
                (peepholes[type] = (peepholes[type] ? fun.concat(peepholes[type], entry) : [entry]));
            }));
        });
    addPeephole(["LetExpression"], UP, (function(_) {
        return true;
    }), (function(node) {
        return ast_expression.LetExpression.create(node.loc, flattenr(node.bindings.map((function(x) {
            return innerPattern(x.value, x.pattern);
        }))), node.body);
    }));
    addPeephole(["FunctionExpression"], UP, (function(_) {
        return true;
    }), (function(node) {
        var params = fun.map((function(x) {
            switch (x.type) {
                case "IdentifierPattern":
                    return x;
                default:
                    return ast_pattern.IdentifierPattern.create(null, ((x.id && x.id.id) || x.ud
                        .id));
            }
        }), fun.filter((function(x) {
            return (x.type !== "EllipsisPattern");
        }), node.params.elements)),
            bindings = unpackParameters(node.params.elements),
            body = ((node.body.type === "BlockStatement") ? ast_statement.BlockStatement.create(null, [
                ast_statement.WithStatement.create(null, bindings, node.body)
            ]) : ast_expression.LetExpression.create(null, bindings, node.body));
        return ast_expression.FunctionExpression.create(null, node.id, ast_pattern.ArgumentsPattern.create(
            null, node.params.id, params, node.params.self), body);
    }));
    var upTransforms = (function(node) {
        return ((node && peepholes[node.type]) || [])
            .filter((function(x) {
                return (x.up && x.condition(node));
            }));
    }),
        downTransforms = (function(node) {
            return ((node && peepholes[node.type]) || [])
                .filter((function(x) {
                    return ((!x.up) && x.condition(node));
                }));
        }),
        transform = (function(ctx, transforms) {
            return (transforms.length ? tree.modifyNode((function(node) {
                return transforms.reduce((function(p, c) {
                    return c.map(p);
                }), node);
            }), ctx) : ctx);
        }),
        opt = walk.bind(null, (function(ctx) {
            var node = tree.node(ctx);
            return transform(ctx, downTransforms(node));
        }), (function(ctx) {
            var node = tree.node(ctx);
            return transform(ctx, upTransforms(node));
        }));
    (normalize = (function(ast) {
        return tree.node(zipper.root(opt(khepriZipper(ast))));
    }));
    (exports["normalize"] = normalize);
}));