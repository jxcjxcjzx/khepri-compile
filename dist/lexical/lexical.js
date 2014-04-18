/*
 * THIS FILE IS AUTO GENERATED from 'lib/lexical/lexical.kep'
 * DO NOT EDIT
*/define(["require", "exports", "khepri-ast/node", "akh/base", "akh/trans/statei", "akh/error", "akh/trans/error",
    "akh/unique", "zipper-m/trans/tree", "../ast", "../fun", "./scope"
], (function(require, exports, __o, __o0, StateT, Error, ErrorT, Unique, TreeZipperT, __o1, __o2, scope) {
    "use strict";
    var setData = __o["setData"],
        getData = __o["getData"],
        next = __o0["next"],
        seq = __o0["sequence"],
        seqa = __o0["sequencea"],
        type = __o1["type"],
        isIdentifier = __o1["isIdentifier"],
        foldl = __o2["foldl"],
        Scope = scope["Scope"],
        check, x, y, x0, y0, x1, y1, x2, y2, x3, consequent, alternate, bind, consequent0, alternate0,
            consequent1, alternate1, consequent2, reserved = (function(node) {
                return getData(node, "reserved");
            }),
        _check, M = ErrorT(TreeZipperT(StateT(Unique))),
        run = (function(p, s, ctx, ok, err) {
            var y, y0;
            return Unique.runUnique(StateT.evalStateT(TreeZipperT.runTreeZipperT(ErrorT.runErrorT(p, ((y =
                M.inner.of), (function(x) {
                return y(ok(x));
            })), ((y0 = M.inner.of), (function(x) {
                return y0(err(x));
            }))), ctx), s), 1000);
        }),
        error = M.fail,
        lift = M.lift,
        unique = M.chain.bind(null, M.liftInner.liftInner(Unique.unique)),
        extractScope = M.liftInner(M.inner.inner.get),
        examineScope = M.chain.bind(null, extractScope),
        modifyScope = ((x = M.liftInner), (y = M.inner.inner.modify), (function(x0) {
            return x(y(x0));
        })),
        push = modifyScope(scope.push),
        pop = modifyScope(scope.pop),
        getClosure = M.chain.bind(null, extractScope.map(scope.getClosure)),
        extractCtx = lift(M.inner.get),
        extract = lift(M.inner.node),
        inspect = M.chain.bind(null, extract),
        up = lift(M.inner.up),
        down = lift(M.inner.down),
        right = lift(M.inner.right),
        root = lift(M.inner.root),
        moveChild = ((x0 = lift), (y0 = M.inner.child), (function(x1) {
            return x0(y0(x1));
        })),
        modifyNode = ((x1 = lift), (y1 = M.inner.modifyNode), (function(x2) {
            return x1(y1(x2));
        })),
        setNode = ((x2 = lift), (y2 = M.inner.setNode), (function(x3) {
            return x2(y2(x3));
        })),
        checkTop = inspect((function(x3) {
            return _check(x3);
        })),
        child = (function(edge) {
            var __args = arguments,
                actions = [].slice.call(__args, 1);
            return seq(moveChild(edge), seqa(actions), up);
        }),
        checkChild = (function(edge) {
            return child(edge, checkTop);
        }),
        pass = M.of(),
        when = (function(test, consequent, alternate) {
            return inspect((function(node) {
                return (test(node) ? consequent : (alternate || pass));
            }));
        }),
        block = (function() {
            var body = arguments;
            return seq(push, seqa(body), pop);
        }),
        addUid = (function(id) {
            return unique((function(uid) {
                return modifyScope((function(s) {
                    return scope.addUid(s, id, uid);
                }));
            }));
        }),
        checkHasBinding = (function(id, loc) {
            return examineScope((function(s) {
                return (s.hasBinding(id) ? pass : error(((("Undeclared identifier:'" + id) +
                    "' at:") + loc)));
            }));
        }),
        checkCanAddBinding = (function(id, loc) {
            return examineScope((function(s) {
                var start, binding, end;
                return (s.hasOwnBinding(id) ? ((start = (loc && loc.start)), (binding = s.getBinding(
                    id)), (end = (binding.loc && binding.loc.start)), error(((((("'" + id) +
                    "' at:") + start) + " already bound for scope from:") + end))) : pass);
            }));
        }),
        checkCanAssign = (function(id, loc) {
            return examineScope((function(s) {
                return (s.hasMutableBinding(id) ? pass : error(((("Assign to immutable variable:'" +
                    id) + "' at:") + loc.start)));
            }));
        }),
        markBindingImmutable = (function(id, loc) {
            return examineScope((function(s) {
                return (s.hasOwnBinding(id) ? modifyScope((function(s0) {
                    return scope.setBindingMutability(s0, id, false);
                })) : error((((("Cannot mark variable:'" + id) + "' at:") + loc.start) +
                    " immutable in enclosed scope")));
            }));
        }),
        addMutableBinding = (function(id, loc) {
            return seq(modifyScope((function(s) {
                return scope.addMutableBinding(s, id, loc);
            })), addUid(id));
        }),
        addStaticBinding = (function(id, loc) {
            return modifyScope((function(s) {
                return scope.addImmutableBinding(s, id, loc);
            }));
        }),
        addImmutableBinding = (function(id, loc) {
            return seq(modifyScope((function(s) {
                return scope.addImmutableBinding(s, id, loc);
            })), addUid(id));
        }),
        addMutableBindingChecked = (function(id, loc) {
            return seq(checkCanAddBinding(id, loc), addMutableBinding(id, loc));
        }),
        addImmutableBindingChecked = (function(id, loc) {
            return seq(checkCanAddBinding(id, loc), addImmutableBinding(id, loc));
        }),
        addStaticBindingChecked = (function(id, loc) {
            return seq(checkCanAddBinding(id, loc), addStaticBinding(id, loc));
        }),
        checks = ({}),
        addCheck = (function(type0, check) {
            if (Array.isArray(type0)) type0.forEach((function(x3) {
                return addCheck(x3, check);
            }));
            else {
                (checks[type0] = check);
            }
        });
    addCheck("Program", block(child("body", checkTop)));
    addCheck("PackageExports", child("exports", checkTop));
    addCheck("PackageExport", seq(inspect((function(__o3) {
        var id = __o3["id"];
        return addMutableBindingChecked(id.name, id.loc);
    })), child("id", checkTop)));
    addCheck("Package", block(child("exports", checkTop), child("body", ((x3 = type), (consequent = seq(child(
        "bindings", checkTop), child("body", child("body", checkTop)))), (alternate = child(
        "body", checkTop)), inspect((function(node) {
        var y3;
        return (((y3 = x3(node)), ("WithStatement" === y3)) ? consequent : (alternate ||
            pass));
    }))))));
    addCheck(["StaticDeclaration", "VariableDeclaration"], child("declarations", checkTop));
    addCheck("StaticDeclarator", inspect((function(__o3) {
        var id = __o3["id"];
        return addStaticBindingChecked(id.name, id.loc);
    })));
    addCheck("VariableDeclarator", ((bind = (function(node) {
        return (node.immutable ? addImmutableBindingChecked(node.id.name, node.loc) :
            addMutableBindingChecked(node.id.name, node.loc));
    })), (consequent0 = seq(inspect(bind), child("id", checkTop), child("init", checkTop))), (
        alternate0 = seq(child("init", checkTop), inspect(bind), child("id", checkTop))), inspect((
        function(node) {
            return (node.recursive ? consequent0 : (alternate0 || pass));
        }))));
    addCheck("Binding", ((consequent1 = seq(child("pattern", checkTop), child("value", checkTop))), (alternate1 =
        seq(child("value", checkTop), child("pattern", checkTop))), inspect((function(node) {
        return (node.recursive ? consequent1 : (alternate1 || pass));
    }))));
    addCheck("BlockStatement", block(child("body", checkTop)));
    addCheck("ExpressionStatement", child("expression", checkTop));
    addCheck("IfStatement", seq(child("test", checkTop), block(child("consequent", checkTop)), block(child(
        "alternate", checkTop))));
    addCheck("WithStatement", block(child("bindings", checkTop), child("body", child("body", checkTop))));
    addCheck("SwitchStatement", block(child("discriminant", checkTop), child("cases", checkTop)));
    addCheck("SwitchCase", seq(child("test", checkTop), child("consequent", checkTop)));
    addCheck(["ReturnStatement", "ThrowStatement"], child("argument", checkTop));
    addCheck("TryStatement", seq(child("block", checkTop), block(child("handler", checkTop)), block(child(
        "finalizer", checkTop))));
    addCheck("CatchClause", block(inspect((function(__o3) {
        var param = __o3["param"];
        return addImmutableBindingChecked(param.name, param.loc);
    })), child("param", checkTop), child("body", child("body", checkTop))));
    addCheck("WhileStatement", seq(child("test", checkTop), block(child("body", checkTop))));
    addCheck("DoWhileStatement", seq(block(child("body", checkTop)), child("test", checkTop)));
    addCheck("ForStatement", block(child("init", checkTop), child("test", checkTop), child("update", checkTop),
        block(child("body", checkTop))));
    addCheck("FunctionExpression", block(inspect((function(__o3) {
        var id = __o3["id"];
        return (id ? addImmutableBinding(id.name, id.loc) : pass);
    })), child("id", checkTop), getClosure((function(closure) {
        var x4;
        return seq(checkChild("params"), child("body", when(((x4 = type), (function(x5) {
            var y3 = x4(x5);
            return ("BlockStatement" === y3);
        })), checkChild("body"), checkTop)), getClosure((function(locals) {
            return modifyNode((function(node) {
                return setData(node, "locals", locals.filter((function(x5) {
                    return (closure.indexOf(x5) < 0);
                })));
            }));
        })));
    }))));
    addCheck("UnaryExpression", child("argument", checkTop));
    addCheck("AssignmentExpression", seq(child("left", checkTop), inspect((function(__o3) {
        var operator = __o3["operator"],
            left = __o3["left"];
        return (isIdentifier(left) ? seq(checkCanAssign(left.name, left.loc), ((operator ===
            ":=") ? markBindingImmutable(left.name, left.loc) : pass)) : pass);
    })), child("right", checkTop)));
    addCheck(["LogicalExpression", "BinaryExpression"], seq(child("left", checkTop), child("right", checkTop)));
    addCheck("ConditionalExpression", seq(child("test", checkTop), child("consequent", checkTop), child(
        "alternate", checkTop)));
    addCheck(["CallExpression", "NewExpression"], seq(child("callee", checkTop), child("args", checkTop)));
    addCheck("MemberExpression", seq(child("object", checkTop), ((consequent2 = child("property", checkTop)),
        inspect((function(node) {
            return (node.computed ? consequent2 : (undefined || pass));
        })))));
    addCheck("ArrayExpression", child("elements", checkTop));
    addCheck("ObjectExpression", child("properties", checkTop));
    addCheck("LetExpression", block(child("bindings", checkTop), child("body", checkTop)));
    addCheck("CurryExpression", seq(child("base", checkTop), child("args", checkTop)));
    addCheck("EllipsisPattern", child("id", checkTop));
    addCheck(["SliceUnpack", "RelativeUnpack", "ImportPattern"], child("pattern", checkTop));
    addCheck("IdentifierPattern", seq(inspect((function(node) {
        var loc = node["loc"],
            id = node["id"];
        return (reserved(node) ? addImmutableBinding(id.name, loc) : addImmutableBindingChecked(
            id.name, loc));
    })), child("id", checkTop)));
    addCheck("AsPattern", seq(child("id", checkTop), inspect((function(node) {
        return child("target", modifyNode((function(target) {
            return setData(target, "id", node.id);
        })), checkTop);
    }))));
    addCheck("ObjectPattern", child("elements", checkTop));
    addCheck("ObjectPatternElement", seq(child("target", checkTop), child("key", checkTop)));
    addCheck("ArgumentsPattern", seq(child("id", checkTop), child("elements", checkTop), child("self", checkTop)));
    addCheck("ObjectValue", child("value", checkTop));
    addCheck("Identifier", inspect((function(node) {
        var loc = node["loc"],
            name = node["name"];
        return seq(examineScope((function(s) {
            return setNode(setData(node, "uid", s.getUid(name)));
        })), checkHasBinding(name, loc));
    })));
    (_check = (function(node) {
        if (Array.isArray(node)) {
            if ((!node.length)) return pass;
            return seq(down, seqa(node.map((function(_, i) {
                return ((i === (node.length - 1)) ? checkTop : next(checkTop, right));
            }))), up);
        }
        return (checks[type(node)] || pass);
    }));
    var addBindings = foldl.bind(null, scope.addImmutableBinding, Scope.empty);
    (check = (function(ast, globals, seed) {
        return run(seq(checkTop, root, extractCtx.chain((function(x4) {
            return unique((function(unique0) {
                return extractScope.map((function(s) {
                    return ({
                        "tree": x4,
                        "data": ({
                            "unique": unique0
                        })
                    });
                }));
            }));
        }))), addBindings((globals || [])), ast, Error.of, Error.fail, seed);
    }));
    (exports["check"] = check);
}));