/*
 * THIS FILE IS AUTO GENERATED from 'lib/lexical.kep'
 * DO NOT EDIT
*/"use strict";
var ast_node = require("khepri-ast")["node"],
    setData = ast_node["setData"],
    setUserData = ast_node["setUserData"],
    ast_expression = require("khepri-ast")["expression"],
    ast_pattern = require("khepri-ast")["pattern"],
    ast_value = require("khepri-ast")["value"],
    zipper = require("neith")["zipper"],
    tree = require("neith")["tree"],
    __o = require("khepri-ast-zipper"),
    khepriZipper = __o["khepriZipper"],
    record = require("bes")["record"],
    scope = require("./scope"),
    Scope = scope["Scope"],
    __o0 = require("./tail"),
    Tail = __o0["Tail"],
    trampoline = __o0["trampoline"],
    fun = require("./fun"),
    __o1 = require("./control/base"),
    next = __o1["next"],
    seq = __o1["seq"],
    seqa = __o1["seqa"],
    binary = __o1["binary"],
    check, _check, State = record.declare(null, ["ctx", "scope", "unique"]),
    M = (function(run) {
        var self = this;
        (self.run = run);
    }),
    un = (function(p, s, ok, err) {
        return new(Tail)(p.run, s, ok, err);
    }),
    run = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(trampoline, un),
    ok = (function(x) {
        return new(M)((function(s, ok, _) {
            return ok(x, s);
        }));
    }),
    error = (function(x) {
        return new(M)((function(s, _, err) {
            return err(x, s);
        }));
    }),
    bind = (function(p, f) {
        return new(M)((function(s, ok, err) {
            return un(p, s, (function(x, s) {
                return un(f(x), s, ok, err);
            }), err);
        }));
    });
(M.of = ok);
(M.prototype.of = ok);
(M.chain = bind);
(M.prototype.chain = (function(f) {
    var self = this;
    return bind(self, f);
}));
var extract = new(M)((function(s, ok, _) {
    return ok(s, s);
})),
    setState = (function(s) {
        return new(M)((function(_, ok, _0) {
            return ok(s, s);
        }));
    }),
    examineState = bind.bind(null, extract),
    modifyState = (function(f) {
        return bind(extract, (function(s) {
            return setState(f(s));
        }));
    }),
    unique = new(M)((function(s, ok, err) {
        return ok(s.unique, s.setUnique((s.unique + 1)));
    })),
    examineScope = (function(f) {
        return examineState((function(s) {
            return f(s.scope);
        }));
    }),
    modifyScope = (function(f) {
        return modifyState((function(s) {
            return State.setScope(s, f(s.scope));
        }));
    }),
    push = modifyScope(scope.push),
    pop = modifyScope(scope.pop),
    inspect = (function(f) {
        return examineState((function(s) {
            return f(tree.node(s.ctx));
        }));
    }),
    extractNode = inspect(ok),
    move = (function(op) {
        return modifyState((function(s) {
            return State.setCtx(s, op(s.ctx));
        }));
    }),
    up = move(zipper.up),
    down = move(zipper.down),
    left = move(zipper.left),
    right = move(zipper.right),
    child = (function(edge) {
        var args = arguments;
        return seq(move(tree.child.bind(null, edge)), seqa([].slice.call(args, 1)), up);
    }),
    modifyNode = (function(f) {
        return move(tree.modifyNode.bind(null, f));
    }),
    setNode = (function(x) {
        return move(tree.setNode.bind(null, x));
    }),
    checkTop = inspect((function(x) {
        return _check(x);
    })),
    checkChild = (function(edge) {
        return child(edge, checkTop);
    }),
    pass = ok(),
    block = (function() {
        var body = arguments;
        return seq(push, seqa(body), pop);
    }),
    checkHasBinding = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasBinding(id) ? pass : error(((("Undeclared identifier:'" + id) + "' at:") + loc)));
        }));
    }),
    checkCanAddOwnBinding = (function(id, loc) {
        return examineScope((function(s) {
            var start, binding, end;
            return (s.hasOwnBinding(id) ? ((start = (loc && loc.start)), (binding = s.getBinding(id)), (end =
                (binding.loc && binding.loc.start)), error(((((("'" + id) + "' at:") + start) +
                " already bound for scope from:") + end))) : pass);
        }));
    }),
    checkCanAssign = (function(id, loc) {
        return examineScope((function(s) {
            var b;
            return (s.hasBinding(id) ? ((b = s.getBinding(id)), (b.mutable ? pass : error((((
                "Assign to immutable variable:'" + id) + "' at:") + loc)))) : pass);
        }));
    }),
    addUid = (function(id) {
        return bind(unique, (function(uid) {
            return modifyScope((function(s) {
                return Scope.addUid(s, id, uid);
            }));
        }));
    }),
    addMutableBinding = (function(id, loc) {
        return seq(modifyScope((function(s) {
            return Scope.addMutableBinding(s, id, loc);
        })), addUid(id));
    }),
    addImmutableBinding = (function(id, loc) {
        return seq(modifyScope((function(s) {
            return Scope.addImmutableBinding(s, id, loc);
        })), addUid(id));
    }),
    addMutableBindingChecked = (function(id, loc) {
        return seq(checkCanAddOwnBinding(id, loc), addMutableBinding(id, loc));
    }),
    addImmutableBindingChecked = (function(id, loc) {
        return seq(checkCanAddOwnBinding(id, loc), addImmutableBinding(id, loc));
    }),
    checks = ({}),
    addCheck = (function(type, check) {
        if (Array.isArray(type)) type.forEach((function(x) {
            return addCheck(x, check);
        }));
        else(checks[type] = check);
    });
addCheck("Program", block(checkChild("body")));
addCheck("PackageExports", checkChild("exports"));
addCheck("PackageExport", inspect((function(node) {
    return addMutableBindingChecked(node.id.name, node.loc);
})));
addCheck("Package", block(addImmutableBindingChecked("require", null), addImmutableBindingChecked("exports", null),
    addImmutableBindingChecked("module", null), checkChild("exports"), child("body", inspect((function(node) {
        return ((node.type === "WithStatement") ? seq(checkChild("bindings"), child("body", checkChild(
            "body"))) : checkChild("body"));
    })))));
addCheck("SwitchCase", seq(checkChild("test"), checkChild("consequent")));
addCheck("CatchClause", block(inspect((function(node) {
    return addImmutableBindingChecked(node.param.name, node.param.loc);
})), checkChild("param"), child("body", checkChild("body"))));
addCheck(["StaticDeclaration", "VariableDeclaration"], checkChild("declarations"));
addCheck("StaticDeclarator", inspect((function(node) {
    return addImmutableBindingChecked(node.id.name, node.loc);
})));
addCheck("VariableDeclarator", inspect((function(node) {
    var bind = (node.immutable ? addImmutableBindingChecked(node.id.name, node.loc) :
        addMutableBindingChecked(node.id.name, node.loc));
    return (node.recursive ? seq(bind, checkChild("id"), checkChild("init")) : seq(checkChild("init"), bind,
        checkChild("id")));
})));
addCheck("Binding", inspect((function(node) {
    return (node.recursive ? seq(checkChild("pattern"), checkChild("value")) : seq(checkChild("value"),
        checkChild("pattern")));
})));
addCheck("BlockStatement", block(checkChild("body")));
addCheck("ExpressionStatement", checkChild("expression"));
addCheck("IfStatement", seq(checkChild("test"), block(checkChild("consequent")), block(checkChild("alternate"))));
addCheck("WithStatement", block(checkChild("bindings"), child("body", checkChild("body"))));
addCheck("SwitchStatement", block(checkChild("discriminant"), checkChild("cases")));
addCheck(["ReturnStatement", "ThrowStatement"], checkChild("argument"));
addCheck("TryStatement", seq(checkChild("block"), block(checkChild("handler")), block(checkChild("finalizer"))));
addCheck("WhileStatement", seq(checkChild("test"), block(checkChild("body"))));
addCheck("DoWhileStatement", seq(block(checkChild("body")), checkChild("test")));
addCheck("ForStatement", block(checkChild("init"), checkChild("test"), checkChild("update"), block(checkChild("body"))));
addCheck("FunctionExpression", block(inspect((function(node) {
    return (node.id ? addImmutableBinding(node.id.name, node.loc) : pass);
})), checkChild("params"), inspect((function(node) {
    return ((node.body.type === "BlockStatement") ? child("body", checkChild("body")) : checkChild(
        "body"));
}))));
addCheck("UnaryExpression", checkChild("argument"));
addCheck("AssignmentExpression", seq(child("left", checkTop, inspect((function(left) {
    return ((left.type === "Identifier") ? checkCanAssign(left.name, left.loc) : pass);
}))), checkChild("right")));
addCheck(["LogicalExpression", "BinaryExpression"], seq(checkChild("left"), checkChild("right")));
addCheck("ConditionalExpression", seq(checkChild("test"), checkChild("consequent"), checkChild("alternate")));
addCheck(["CallExpression", "NewExpression"], seq(checkChild("callee"), checkChild("args")));
addCheck("MemberExpression", seq(checkChild("object"), inspect((function(node) {
    return (node.computed ? checkChild("property") : pass);
}))));
addCheck("ArrayExpression", checkChild("elements"));
addCheck("ObjectExpression", checkChild("properties"));
addCheck("LetExpression", block(checkChild("bindings"), checkChild("body")));
addCheck("CurryExpression", seq(checkChild("base"), checkChild("args")));
addCheck("SinkPattern", bind(unique, (function(uid) {
    return setNode(setData(ast_value.Identifier.create(null, "_"), "uid", uid));
})));
addCheck("IdentifierPattern", seq(inspect((function(node) {
    return (node.reserved ? addImmutableBinding(node.id.name, node.loc) : addImmutableBindingChecked(
        node.id.name, node.loc));
})), checkChild("id")));
addCheck("ImportPattern", checkChild("pattern"));
addCheck("AsPattern", seq(checkChild("id"), inspect((function(node) {
    return child("target", modifyNode((function(target) {
        return setData(target, "id", node.id);
    })), checkTop);
}))));
addCheck("ObjectPattern", inspect((function(node) {
    if (((!node.ud) || (!node.ud.id))) {
        return seq(bind(unique, (function(uid) {
            var id = ast_pattern.IdentifierPattern.create(node.loc, setData(ast_value.Identifier
                .create(null, "__o"), "uid", uid));
            (id.reserved = true);
            return setNode(ast_pattern.AsPattern.create(null, id, node));
        })), checkTop);
    }
    return checkChild("elements");
})));
addCheck("ObjectPatternElement", seq(checkChild("target"), checkChild("key")));
addCheck("ArgumentsPattern", seq(checkChild("id"), checkChild("elements"), checkChild("self")));
addCheck("ObjectValue", checkChild("value"));
addCheck("Identifier", inspect((function(node) {
    return seq(examineScope((function(s) {
        return setNode(setData(node, "uid", s.getUid(node.name)));
    })), checkHasBinding(node.name, node.loc));
})));
(_check = (function(node) {
    if (Array.isArray(node)) {
        if ((!node.length)) return pass;
        return seq(down, seqa(node.map((function(_, i) {
            return ((i === (node.length - 1)) ? checkTop : next(checkTop, right));
        }))), up);
    }
    if (((node instanceof ast_node.Node) && checks[node.type])) return checks[node.type];
    return pass;
}));
var initialScope = fun.foldl.bind(null, Scope.addImmutableBinding, Scope.empty),
    suc = (function(x, s) {
        return ({
            "tree": x,
            "data": ({
                "unique": s.unique
            })
        });
    }),
    fail = (function(x) {
        throw x;
    });
(check = (function(ast, globals) {
    return run(seq(checkTop, move(zipper.root), extractNode), new(State)(khepriZipper(ast), initialScope((
        globals || [])), 1), suc, fail);
}));
(exports["check"] = check);