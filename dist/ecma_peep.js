/*
 * THIS FILE IS AUTO GENERATED from 'lib/ecma_peep.kep'
 * DO NOT EDIT
*/define(["require", "exports", "ecma-ast-zipper", "ecma-ast/node", "./ast", "./fun", "./rewriter"], (function(require,
    exports, __o, __o0, __o1, __o2, __o3) {
    "use strict";
    var ecmaZipper = __o["ecmaZipper"],
        modify = __o0["modify"],
        type = __o1["type"],
        concat = __o2["concat"],
        flatten = __o2["flatten"],
        map = __o2["map"],
        foldr = __o2["foldr"],
        UP = __o3["UP"],
        DOWN = __o3["DOWN"],
        Rewriter = __o3["Rewriter"],
        rewrite = __o3["rewrite"],
        optimize, flattenBlockBody = (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(flatten, map.bind(null, (function(x) {
            return (((!x) || (type(x) === "EmptyStatement")) ? [] : ((type(x) === "BlockStatement") ?
                x.body : x));
        }))),
        mergeBlockDeclarations = foldr.bind(null, (function(p, c) {
            return (((type(c) === "VariableDeclaration") && (type(p[0]) === "VariableDeclaration")) ?
                concat(modify(c, ({
                    "declarations": concat(c.declarations, p[0].declarations)
                }), ({})), p.slice(1)) : concat(c, p));
        }), []),
        peepholes = new(Rewriter)(),
        always = (function(_) {
            return true;
        });
    peepholes.add("VariableDeclaration", DOWN, always, (function(node) {
        var declarations = node.declarations.filter((function(x) {
            return (!(!x));
        }));
        return modify(node, ({
            "declarations": declarations
        }), ({}));
    }));
    peepholes.add("VariableDeclaration", UP, (function(node) {
        return (!node.declarations.length);
    }), (function(_) {
        return null;
    }));
    peepholes.add(["Program", "BlockStatement"], UP, always, (function(node) {
        return modify(node, ({
            "body": flattenBlockBody(node.body)
        }), ({}));
    }));
    peepholes.add(["Program", "BlockStatement"], UP, always, (function(node) {
        return modify(node, ({
            "body": mergeBlockDeclarations(node.body)
        }), ({}));
    }));
    (optimize = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(rewrite.bind(null, peepholes), ecmaZipper));
    (exports["optimize"] = optimize);
}));