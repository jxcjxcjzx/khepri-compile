/*
 * THIS FILE IS AUTO GENERATED from 'lib/inline/rename.kep'
 * DO NOT EDIT
*/"use strict";
var __o = require("khepri-ast-zipper"),
    khepriZipper = __o["khepriZipper"],
    __o0 = require("neith")["walk"],
    preWalk = __o0["preWalk"],
    tree = require("neith")["tree"],
    __o1 = require("khepri-ast")["node"],
    setData = __o1["setData"],
    __o2 = require("../fun"),
    contains = __o2["contains"],
    __o3 = require("../ast"),
    type = __o3["type"],
    tryGetUd = __o3["tryGetUd"],
    getUd = __o3["getUd"],
    getUid = __o3["getUid"],
    setUid = __o3["setUid"],
    __o4 = require("./expansion"),
    incrementCount = __o4["incrementCount"],
    getLocals, rename, incCount;
(getLocals = (function(node, prefix) {
    return tryGetUd([], "locals", node)
        .map((function(uid) {
            return ((prefix + "-") + uid);
        }));
}));
var updateClosure = (function(node, prefix, list) {
    var closure = tryGetUd([], "locals", node),
        closure0 = closure.map((function(x) {
            return (contains(list, x) ? ((prefix + "-") + x) : x);
        }));
    return setData(node, "locals", closure0);
});
(rename = (function(prefix, list, root) {
    return tree.node(preWalk((function(ctx) {
        var node = tree.node(ctx),
            uid = getUid(node);
        return (contains(list, uid) ? tree.setNode(setUid(((prefix + "-") + uid), node), ctx) : ((
            type(node) === "FunctionExpression") ? tree.setNode(updateClosure(node, prefix,
            list), ctx) : ctx));
    }), khepriZipper(root)));
}));
(incCount = (function(target, count, value, root) {
    return tree.node(preWalk((function(ctx) {
        var node = tree.node(ctx),
            uid = getUid(node);
        return ((node && (target === uid)) ? tree.setNode(incrementCount(node, count, value), ctx) :
            ctx);
    }), khepriZipper(root)));
}));
(exports["getLocals"] = getLocals);
(exports["rename"] = rename);
(exports["incCount"] = incCount);