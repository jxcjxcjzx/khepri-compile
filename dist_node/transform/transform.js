/*
 * THIS FILE IS AUTO GENERATED from 'lib/transform/transform.kep'
 * DO NOT EDIT
*/"use strict";
var ecma_clause = require("ecma-ast")["clause"],
    ecma_declaration = require("ecma-ast")["declaration"],
    ecma_expression = require("ecma-ast")["expression"],
    ecma_node = require("ecma-ast")["node"],
    ecma_program = require("ecma-ast")["program"],
    ecma_statement = require("ecma-ast")["statement"],
    ecma_value = require("ecma-ast")["value"],
    __o = require("ecma-ast-zipper"),
    ecmaZipper = __o["ecmaZipper"],
    khepri_declaration = require("khepri-ast")["declaration"],
    khepri_expression = require("khepri-ast")["expression"],
    khepri_node = require("khepri-ast")["node"],
    setData = khepri_node["setData"],
    khepri_statement = require("khepri-ast")["statement"],
    khepri_value = require("khepri-ast")["value"],
    Unique = require("akh")["unique"],
    StateT = require("akh")["trans"]["statei"],
    __o0 = require("akh")["base"],
    liftM2 = __o0["liftM2"],
    seq = __o0["sequence"],
    TreeZipperT = require("zipper-m")["trans"]["tree"],
    walk = require("zipper-m")["walk"],
    __o1 = require("../ast"),
    type = __o1["type"],
    tryGetUd = __o1["tryGetUd"],
    getUd = __o1["getUd"],
    getUid = __o1["getUid"],
    scope = require("../lexical/scope"),
    Scope = scope["Scope"],
    fun = require("../fun"),
    concat = fun["concat"],
    flatten = fun["flatten"],
    flip = fun["flip"],
    filter = fun["filter"],
    foldr = fun["foldr"],
    map = fun["map"],
    reduce = fun["reduce"],
    __o2 = require("../builtin"),
    builtins = __o2["builtins"],
    __o3 = require("./unpack"),
    expandBinding = __o3["expandBinding"],
    expandBindings = __o3["expandBindings"],
    expandArgumentsPattern = __o3["expandArgumentsPattern"],
    state = require("./state"),
    State = state["State"],
    _ = require("./package_manager/amd"),
    _0 = require("./package_manager/node"),
    transform, x, y, f, f0, x0, y0, y1, x1, x2, x3, y2, y3, x4, y4, x5, y5, x6, y6, filterImports, getImports, x7, x8,
        useStrict, uid, f1, uid0, f2, M = TreeZipperT(StateT(Unique)),
    run = (function(m, s, ctx, seed) {
        return Unique.runUnique(StateT.evalStateT(TreeZipperT.runTreeZipperT(m, ctx), s), seed);
    }),
    pass = M.of(null),
    cons = liftM2.bind(null, concat),
    enumeration = foldr.bind(null, flip(cons), M.of([])),
    extract = M.lift(M.inner.get),
    modifyState = ((x = M.lift), (y = M.inner.modify), (function(z) {
        return x(y(z));
    })),
    inspectStateWith = M.chain.bind(null, extract),
    packageManager = extract.map((function(x0) {
        return x0.packageManager;
    })),
    node = M.node,
    withNode = M.chain.bind(null, node),
    modify = M.modifyNode,
    set = M.setNode,
    inspectScope = (function(f) {
        return extract.map((function(z) {
            return f(z.scope);
        }));
    }),
    modifyScope = (function(f) {
        return modifyState((function(s) {
            return s.setScope(f(s.scope));
        }));
    }),
    enterBlock = ((f = scope.push), modifyState((function(s) {
        return s.setScope(f(s.scope));
    }))),
    exitBlock = ((f0 = scope.pop), modifyState((function(s) {
        return s.setScope(f0(s.scope));
    }))),
    getMapping = (function(uid) {
        return inspectScope((function(s) {
            return s.getMapping(uid);
        }));
    }),
    addVar = (function(id, uid) {
        return modifyScope(scope.addVar.bind(null, id, uid));
    }),
    pushBindings = modifyState(state.pushBindings),
    popBindings = modifyState(state.popBindings),
    getBindings = M.chain.bind(null, inspectStateWith(((x0 = enumeration), (y0 = map.bind(null, (function(uid) {
        return inspectScope((function(s) {
            return s.getMapping(uid);
        }));
    }))), (y1 = state.getBindings), (function(z) {
        var z0 = y1(z);
        return x0(y0(z0));
    })))),
    addBindingsForBindingsList = ((x1 = map.bind(null, ((y2 = expandBindings.bind(null, null)), (function(z) {
        return y2(z.pattern);
    })))), (x2 = flatten), (x3 = map.bind(null, ((y3 = getUid), (function(z) {
        var z0 = z.pattern;
        return y3(z0.id);
    })))), (function(z) {
        var z0 = x1(z),
            z1 = x2(z0),
            bindings = x3(z1);
        return modifyState(state.addBindings.bind(null, bindings));
    })),
    _trans, _transform = withNode((function(node0) {
        return _trans(node0);
    })),
    identifier = (function(loc, name) {
        return ecma_value.Identifier.create(loc, name);
    }),
    variableDeclaration = khepri_declaration.VariableDeclaration.create,
    variableDeclarator = ecma_declaration.VariableDeclarator.create,
    idsToDeclarators = ((x4 = map.bind(null, (function(x5) {
        return ecma_declaration.VariableDeclarator.create(null, identifier(null, x5));
    }))), (y4 = ecma_declaration.VariableDeclaration.create.bind(null, null)), (function(z) {
        return y4(x4(z));
    })),
    bindingToDeclarator = (function(x5) {
        return variableDeclarator(null, x5.pattern, x5.value);
    }),
    unpack = ((x5 = expandBinding), (y5 = map.bind(null, (function(x6) {
        return variableDeclarator(null, x6.pattern, x6.value);
    }))), (function(z) {
        return y5(x5(z));
    })),
    unpackAssign = ((x6 = expandBinding), (y6 = map.bind(null, (function(x7) {
        return ecma_expression.AssignmentExpression.create(null, "=", x7.pattern, x7.value);
    }))), (function(z) {
        return y6(x6(z));
    })),
    withStatementNoImport = (function(loc, bindings, body) {
        var vars = flatten(map(unpack, bindings)),
            prefix = variableDeclaration(null, vars);
        return khepri_statement.BlockStatement.create(loc, concat(prefix, body.body));
    }),
    withStatement = (function(packageManager0, loc, bindings, body) {
        var flattenImport = (function(imp) {
            return ((type(imp) === "ImportPattern") ? khepri_declaration.Binding.create(null, imp.pattern,
                packageManager0.importPackage(imp.from.value)) : imp);
        });
        return withStatementNoImport(loc, map(flattenImport, bindings), body);
    }),
    functionExpression = (function(loc, id, parameters, functionBody, prefix) {
        var params = parameters.elements,
            bindings = map(bindingToDeclarator, expandArgumentsPattern(parameters, ecma_expression.ThisExpression.create(
                null))),
            body = ((type(functionBody) === "BlockStatement") ? functionBody.body : khepri_statement.ReturnStatement
                .create(null, functionBody));
        return khepri_expression.FunctionExpression.create(loc, id, params, khepri_statement.BlockStatement.create(
            body.loc, concat((prefix || []), variableDeclaration(null, bindings), body)));
    }),
    letExpression = (function(loc, bindings, body) {
        return ecma_expression.SequenceExpression.create(null, flatten(concat(map(unpackAssign, bindings), body)));
    }),
    curryExpression = (function(loc, base, args) {
        return khepri_expression.CallExpression.create(loc, khepri_expression.MemberExpression.create(null, base,
            identifier(null, "bind")), concat(ecma_value.Literal.create(null, "null", null), args));
    }),
    packageBlock = ((filterImports = filter.bind(null, ((x7 = type), (function(z) {
        var y7 = x7(z);
        return ("ImportPattern" === y7);
    })))), (getImports = filter.bind(null, ((x8 = type), (function(z) {
        var y7 = x8(z);
        return ("ImportPattern" !== y7);
    })))), (function(packageManager0, loc, exports0, body) {
        var imports = ((type(body) === "WithStatement") ? filterImports(body.bindings) : []),
            targets = reduce(imports, (function(p, c) {
                (p[c.from.value] = c.pattern);
                return p;
            }), ({})),
            fBody = ((type(body) === "WithStatement") ? khepri_statement.WithStatement.create(null, getImports(
                body.bindings), body.body) : body);
        return packageManager0.definePackage(loc, exports0, imports, targets, fBody);
    })),
    transformers = ({}),
    addTransform = (function(type0, pre, post) {
        if (Array.isArray(type0)) return type0.map((function(x9) {
            return addTransform(x9, pre, post);
        }));
        (transformers[type0] = ({
            pre: pre,
            post: post
        }));
    });
addTransform("VariableDeclaration", null, modify((function(__o4) {
    var loc = __o4["loc"],
        declarations = __o4["declarations"];
    return ecma_declaration.VariableDeclaration.create(loc, declarations);
})));
addTransform("VariableDeclarator", null, modify((function(node0) {
    return ecma_declaration.VariableDeclarator.create(node0.loc, node0.id, node0.init);
})));
addTransform("StaticDeclaration", modify((function(__o4) {
    var loc = __o4["loc"];
    return ecma_statement.EmptyStatement.create(loc);
})));
addTransform("CatchClause", null, modify((function(node0) {
    return ecma_clause.CatchClause.create(node0.loc, node0.param, node0.body);
})));
addTransform("SwitchCase", null, modify((function(node0) {
    return ecma_clause.SwitchCase.create(node0.loc, node0.test, node0.consequent);
})));
addTransform("BlockStatement", pushBindings, seq(getBindings((function(bindings) {
    return modify((function(node0) {
        return ecma_statement.BlockStatement.create(node0.loc, concat(idsToDeclarators(bindings),
            node0.body));
    }));
})), popBindings));
addTransform("ExpressionStatement", null, modify((function(node0) {
    return ecma_statement.ExpressionStatement.create(node0.loc, node0.expression);
})));
addTransform("IfStatement", null, modify((function(node0) {
    return ecma_statement.IfStatement.create(node0.loc, node0.test, node0.consequent, node0.alternate);
})));
addTransform("WithStatement", seq(packageManager.chain((function(packageManager0) {
    return modify((function(node0) {
        return withStatement(packageManager0, node0.loc, node0.bindings, node0.body);
    }));
})), _transform));
addTransform("SwitchStatement", null, modify((function(node0) {
    return ecma_statement.SwitchStatement.create(node0.loc, node0.discriminant, node0.cases);
})));
addTransform("ReturnStatement", null, modify((function(node0) {
    return ecma_statement.ReturnStatement.create(node0.loc, node0.argument);
})));
addTransform("ThrowStatement", null, modify((function(node0) {
    return ecma_statement.ThrowStatement.create(node0.loc, node0.argument);
})));
addTransform("BreakStatement", modify((function(node0) {
    return ecma_statement.BreakStatement.create(node0.loc, null);
})));
addTransform("ContinueStatement", modify((function(node0) {
    return ecma_statement.ContinueStatement.create(node0.loc, null);
})));
addTransform("TryStatement", null, modify((function(node0) {
    return ecma_statement.TryStatement.create(node0.loc, node0.block, node0.handler, node0.finalizer);
})));
addTransform("WhileStatement", null, modify((function(node0) {
    return ecma_statement.WhileStatement.create(node0.loc, node0.test, node0.body);
})));
addTransform("DoWhileStatement", null, modify((function(node0) {
    return ecma_statement.DoWhileStatement.create(node0.loc, node0.body, node0.test);
})));
addTransform("ForStatement", null, modify((function(node0) {
    return ecma_statement.ForStatement.create(node0.loc, node0.init, node0.test, node0.update, node0.body);
})));
addTransform("AssignmentExpression", null, modify((function(node0) {
    return ecma_expression.AssignmentExpression.create(node0.loc, "=", node0.left, node0.right);
})));
addTransform("UnaryExpression", null, modify((function(node0) {
    return ecma_expression.UnaryExpression.create(node0.loc, ((node0.operator === "++") ? "+" : ((node0.operator ===
        "--") ? "-" : node0.operator)), node0.argument);
})));
addTransform("BinaryExpression", null, modify((function(node0) {
    return ecma_expression.BinaryExpression.create(node0.loc, node0.operator, node0.left, node0.right);
})));
addTransform("LogicalExpression", null, modify((function(node0) {
    return ecma_expression.LogicalExpression.create(node0.loc, node0.operator, node0.left, node0.right);
})));
addTransform("ConditionalExpression", null, modify((function(node0) {
    return ecma_expression.ConditionalExpression.create(node0.loc, node0.test, node0.consequent, node0.alternate);
})));
addTransform("NewExpression", null, modify((function(node0) {
    return ecma_expression.NewExpression.create(node0.loc, node0.callee, node0.args);
})));
addTransform("CallExpression", null, modify((function(node0) {
    return ecma_expression.CallExpression.create(node0.loc, node0.callee, node0.args);
})));
addTransform("MemberExpression", null, modify((function(node0) {
    return ecma_expression.MemberExpression.create(node0.loc, node0.object, node0.property, node0.computed);
})));
addTransform("LetExpression", seq(withNode((function(z) {
    return addBindingsForBindingsList(z.bindings);
})), modify((function(node0) {
    return letExpression(node0.loc, node0.bindings, node0.body);
}))));
addTransform("CurryExpression", modify((function(node0) {
    return curryExpression(node0.loc, node0.base, node0.args);
})));
addTransform("FunctionExpression", seq(enterBlock, modify((function(node0) {
    return functionExpression(node0.loc, node0.id, node0.params, node0.body, getUd("prefix", node0));
}))), seq(modify((function(node0) {
    return ecma_expression.FunctionExpression.create(null, node0.id, node0.params, node0.body);
})), exitBlock));
addTransform("ArrayExpression", null, modify((function(node0) {
    return ecma_expression.ArrayExpression.create(node0.loc, node0.elements);
})));
addTransform("ObjectExpression", null, modify((function(node0) {
    return ecma_expression.ObjectExpression.create(node0.loc, node0.properties);
})));
addTransform("ObjectValue", null, modify((function(node0) {
    return ecma_value.ObjectValue.create(node0.loc, node0.key, node0.value);
})));
addTransform(["IdentifierPattern", "AsPattern", "ArgumentsPattern"], null, modify((function(x9) {
    return x9.id;
})));
addTransform(["ObjectPattern", "EllipsisPattern", "SinkPattern"], null, modify(getUd.bind(null, "id")));
addTransform("Program", ((useStrict = khepri_statement.ExpressionStatement.create(null, khepri_value.Literal.create(
    null, "string", "use strict"))), seq(pushBindings, modify((function(node0) {
    return ((type(node0.body) === "Package") ? node0 : setData(node0, "prefix", useStrict));
})))), getBindings((function(bindings) {
    return modify((function(node0) {
        return ecma_program.Program.create(node0.loc, concat(tryGetUd([], "prefix", node0),
            idsToDeclarators(bindings), node0.body));
    }));
})));
addTransform("Package", packageManager.chain((function(packageManager0) {
    return modify((function(node0) {
        return packageBlock(packageManager0, node0.loc, node0.exports, node0.body);
    }));
})));
addTransform("Identifier", null, withNode((function(node0) {
    return (getUid(node0) ? seq(addVar(node0.name, getUid(node0)), getMapping(getUid(node0))
        .chain((function(name) {
            return set(identifier(node0.loc, name));
        }))) : set(identifier(node0.loc, node0.name)));
})));
(_trans = (function(node0) {
    var t;
    return ((node0 instanceof khepri_node.Node) ? ((t = transformers[type(node0)]), ((t && t.pre) || pass)) :
        pass);
}));
var _transformPost = withNode((function(node0) {
    var t;
    return ((node0 instanceof khepri_node.Node) ? ((t = transformers[type(node0)]), ((t && t.post) || pass)) :
        pass);
})),
    rewrite = walk(M, _transform, _transformPost),
    transformProgram = seq(((uid = getUid(builtins.require)), (f1 = scope.addVar.bind(null, "require", uid)),
        modifyState((function(s) {
            return s.setScope(f1(s.scope));
        }))), ((uid0 = getUid(builtins.exports)), (f2 = scope.addVar.bind(null, "exports", uid0)), modifyState((
        function(s) {
            return s.setScope(f2(s.scope));
        }))), rewrite, node.map(ecmaZipper)),
    getPackageManager = (function(manager) {
        var amd_manager = require("./package_manager/amd"),
            node_manager = require("./package_manager/node");
        return ((manager === "node") ? node_manager : amd_manager);
    });
(transform = (function(ast, manager) {
    var packageManager0 = getPackageManager(manager),
        s = State.empty.setPackageManager(packageManager0);
    return run(transformProgram, s, ast);
}));
(exports["transform"] = transform);