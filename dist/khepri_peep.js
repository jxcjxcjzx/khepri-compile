/*
 * THIS FILE IS AUTO GENERATED from 'lib/khepri_peep.kep'
 * DO NOT EDIT
*/define(["require", "exports", "bes/record", "neith/tree", "neith/zipper", "khepri-ast-zipper", "khepri-ast/node",
    "khepri-ast/declaration", "khepri-ast/statement", "khepri-ast/expression", "khepri-ast/pattern",
    "khepri-ast/value", "./fun"
], (function(require, exports, record, tree, zipper, __o, __o0, ast_declaration, ast_statement, ast_expression,
    ast_pattern, ast_value, fun) {
    "use strict";
    var modifyNode = tree["modifyNode"],
        khepriZipper = __o["khepriZipper"],
        Node = __o0["Node"],
        setUserData = __o0["setUserData"],
        setData = __o0["setData"],
        optimize, State = record.declare(null, ["ctx", "unique"]),
        run = (function(c, s, ok) {
            return c(s, ok);
        }),
        ok = (function(x) {
            return (function(s, ok, _) {
                return ok(x, s);
            });
        }),
        bind = (function(p, f) {
            return (function(s, ok, err) {
                return p(s, (function(x, s) {
                    return f(x)(s, ok);
                }));
            });
        }),
        binary = (function(a, b, f) {
            return bind(a, (function(x) {
                return bind(b, (function(y) {
                    return f(x, y);
                }));
            }));
        }),
        next = (function(p, c) {
            return bind(p, fun.constant(c));
        }),
        seqa = (function(arr) {
            return fun.reduce(arr, next);
        }),
        seq = (function() {
            var args = arguments;
            return seqa(args);
        }),
        extract = (function(s, ok) {
            return ok(s, s);
        }),
        setState = (function(s) {
            return (function(_, ok) {
                return ok(s, s);
            });
        }),
        examineState = bind.bind(null, extract),
        modifyState = (function(f) {
            return bind(extract, (function(s) {
                return setState(f(s));
            }));
        }),
        get = (function(op) {
            return examineState((function(s) {
                return ok(op(s.ctx));
            }));
        }),
        node = get(tree.node),
        move = (function(op) {
            return modifyState((function(s) {
                return State.setCtx(s, op(s.ctx));
            }));
        }),
        modify = (function(f) {
            return move(tree.modifyNode.bind(null, f));
        }),
        ctx = examineState((function(s) {
            return ok(s.ctx);
        })),
        unique = (function(s, ok, err) {
            return ok(s.unique, s.setUnique((s.unique + 1)));
        }),
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
    addPeephole(["ReturnStatement"], false, (function(node) {
        return (node.argument && (node.argument.type === "LetExpression"));
    }), modify((function(node) {
        return ast_statement.WithStatement.create(null, node.argument.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ReturnStatement.create(node.loc, node.argument.body)]));
    })));
    addPeephole(["FunctionExpression"], false, (function(node) {
        return (node.body.type === "LetExpression");
    }), modify((function(node) {
        return ast_expression.FunctionExpression.create(null, node.id, node.params, ast_statement.BlockStatement
            .create(null, [ast_statement.WithStatement.create(null, node.body.bindings,
                ast_statement.BlockStatement.create(null, [ast_statement.ReturnStatement.create(
                    node.loc, node.body.body)]))]));
    })));
    addPeephole(["ExpressionStatement"], true, (function(node) {
        return (node.expression && (node.expression.type === "LetExpression"));
    }), modify((function(node) {
        return ast_statement.WithStatement.create(null, node.expression.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ExpressionStatement.create(node.loc, node.expression.body)])
        );
    })));
    addPeephole(["ExpressionStatement"], true, (function(node) {
        return ((node.expression && (node.expression.type === "AssignmentExpression")) && (node.expression
            .right.type === "LetExpression"));
    }), modify((function(node) {
        return ast_statement.WithStatement.create(null, node.expression.right.bindings,
            ast_statement.BlockStatement.create(null, [ast_statement.ExpressionStatement.create(
                node.loc, ast_expression.AssignmentExpression.create(node.expression.loc,
                    node.expression.operator, node.expression.left, node.expression.right.body
                ))]));
    })));
    addPeephole(["LetExpression"], true, (function(node) {
        return (node.body.type === "LetExpression");
    }), modify((function(node) {
        return ast_expression.LetExpression.create(null, fun.concat(node.bindings, node.body.bindings),
            node.body.body);
    })));
    addPeephole(["CurryExpression"], true, (function(node) {
        return (node.base.type === "UnaryOperatorExpression");
    }), bind(unique, (function(xUid) {
        return modify((function(node) {
            var arg = setData(ast_value.Identifier.create(null, "x"), "uid", xUid);
            return ast_expression.LetExpression.create(null, [ast_declaration.Binding.create(
                null, ast_pattern.IdentifierPattern.create(null, arg), node.args[0]
            )], ast_expression.FunctionExpression.create(null, null, ast_pattern.ArgumentsPattern
                .create(null, null, []), ast_expression.UnaryExpression.create(null,
                    node.base.op, arg)));
        }));
    })));
    addPeephole(["CurryExpression"], true, (function(node) {
        return ((node.base.type === "FunctionExpression") && (!node.base.params.id));
    }), modify((function(node) {
        var first = node.base.params.elements[0],
            rest = node.base.params.elements.slice(1),
            body = ast_expression.FunctionExpression.create(null, null, ast_pattern.ArgumentsPattern
                .create(null, null, rest, node.base.params.self), node.base.body);
        return ((first && (((first.type === "IdentifierPattern") || (first.type === "AsPattern")) ||
            (first.type === "ObjectPattern"))) ? ast_expression.LetExpression.create(null, [
            ast_declaration.Binding.create(null, first, node.args[0])
        ], body) : body);
    })));
    addPeephole(["CurryExpression"], true, (function(node) {
        return (((node.base.type === "LetExpression") && (node.base.body.type === "FunctionExpression")) &&
            (!node.base.body.params.id));
    }), modify((function(node) {
        var first = node.base.body.params.elements[0],
            rest = node.base.body.params.elements.slice(1),
            body = ast_expression.FunctionExpression.create(null, null, ast_pattern.ArgumentsPattern
                .create(null, null, rest, node.base.body.params.self), node.base.body.body);
        return ((first && (((first.type === "IdentifierPattern") || (first.type === "AsPattern")) ||
            (first.type === "ObjectPattern"))) ? ast_expression.LetExpression.create(null, fun.concat(
                node.base.bindings, ast_declaration.Binding.create(null, first, node.args[0])),
            body) : ast_expression.LetExpression.create(null, node.base.bindings, body));
    })));
    addPeephole(["CurryExpression"], true, (function(node) {
        return ((node.base.type === "BinaryOperatorExpression") && (node.args.length === 1));
    }), binary(unique, unique, (function(xUid, yUid) {
        return modify((function(node) {
            var bound = setData(ast_value.Identifier.create(null, "x"), "uid", xUid),
                arg = setData(ast_value.Identifier.create(null, "y"), "uid", yUid);
            return ast_expression.LetExpression.create(null, [ast_declaration.Binding.create(
                null, ast_pattern.IdentifierPattern.create(null, bound), node.args[
                    0])], ast_expression.FunctionExpression.create(null, null,
                ast_pattern.ArgumentsPattern.create(null, null, [ast_pattern.IdentifierPattern
                    .create(null, arg)
                ]), ast_expression.BinaryExpression.create(null, node.base.op, bound,
                    arg)));
        }));
    })));
    addPeephole(["CurryExpression"], true, (function(node) {
        return (node.base.type === "CurryExpression");
    }), modify((function(node) {
        return ast_expression.CurryExpression.create(null, node.base.base, fun.concat(node.base.args,
            node.args));
    })));
    addPeephole(["BinaryExpression"], true, (function(node) {
        return ((node.operator === "|>") && (node.right.type === "CurryExpression"));
    }), modify((function(node) {
        return ast_expression.CallExpression.create(null, ((node.right.type === "CurryExpression") ?
            node.right.base : node.right), fun.concat((node.right.args || []), node.left));
    })));
    addPeephole(["BinaryExpression"], true, (function(__o) {
        var operator = __o["operator"],
            left = __o["left"];
        return ((operator === "<|") && (left.type === "CurryExpression"));
    }), modify((function(node) {
        return ast_expression.CallExpression.create(null, ((node.left.type === "CurryExpression") ?
            node.left.base : node.left), fun.concat((node.left.args || []), node.right));
    })));
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
        transform = (function(node, transforms) {
            return (transforms.length ? seqa(transforms.map((function(x) {
                return x.map;
            }))) : ok());
        }),
        walk = (function(pre, post) {
            return next(pre, bind(ctx, (function(t) {
                if (zipper.isLeaf(t)) {
                    var loop = next(post, bind(ctx, (function(t) {
                        if (zipper.isLast(t)) {
                            if (zipper.isRoot(t)) return ok();
                            return next(move(zipper.up), loop);
                        } else {
                            return next(move(zipper.right), walk(pre, post));
                        }
                    })));
                    return loop;
                }
                return next(move(zipper.down), walk(pre, post));
            })));
        }),
        _transform = bind(node, (function(node) {
            return transform(node, downTransforms(node));
        })),
        _transformPost = bind(node, (function(node) {
            return transform(node, upTransforms(node));
        })),
        opt = walk.bind(null, _transform, _transformPost);
    (optimize = (function(ast, data) {
        var s = State.create(khepriZipper(ast), data.unique);
        return next(walk(_transform, _transformPost), node)(s, (function(x) {
            return x;
        }));
    }));
    (exports["optimize"] = optimize);
}));