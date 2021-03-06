/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/rewriter.kep'
 * DO NOT EDIT
*/
"use strict";
var zipper = require("neith")["zipper"],
    tree = require("neith")["tree"],
    __o = require("neith")["walk"],
    __o0 = require("./fun"),
    UP, DOWN, Rewriter, rewrite, walk = __o["walk"],
    concat = __o0["concat"];
(UP = true);
(DOWN = false);
var transform = (function(ctx, transforms) {
    return (transforms.length ? tree.modifyNode((function(node) {
        return transforms.reduce((function(p, c) {
            return c.map(p);
        }), node);
    }), ctx) : ctx);
});
(Rewriter = (function() {
    var self = this;
    (self.peepholes = []);
}));
(Rewriter.prototype.add = (function(type, up, condition, f) {
    var self = this;
    if (Array.isArray(type)) return type.map((function(x) {
        return self.add(x, up, condition, f);
    }));
    (self.peepholes[type] = concat((self.peepholes[type] || []), ({
        "condition": condition,
        "map": f,
        "up": up
    })));
}));
(Rewriter.prototype.rewriters = (function(node) {
    var self = this;
    return ((node && self.peepholes[node.type]) || []);
}));
(Rewriter.prototype.upTransforms = (function(node) {
    var self = this;
    return self.rewriters(node)
        .filter((function(x) {
            return (x.up && x.condition(node));
        }));
}));
(Rewriter.prototype.downTransforms = (function(node) {
    var self = this;
    return self.rewriters(node)
        .filter((function(x) {
            return ((!x.up) && x.condition(node));
        }));
}));
(Rewriter.prototype.transform = (function(ctx) {
    var self = this,
        node = tree.node(ctx);
    return transform(ctx, self.downTransforms(node));
}));
(Rewriter.prototype.transformPost = (function(ctx) {
    var self = this,
        node = tree.node(ctx);
    return transform(ctx, self.upTransforms(node));
}));
var x = (function(rewritter, ctx) {
    return walk(rewritter.transform.bind(rewritter), rewritter.transformPost.bind(rewritter), ctx);
}),
    y = zipper.root;
(rewrite = (function() {
    var args = arguments;
    return y(x.apply(null, args));
}));
(exports["UP"] = UP);
(exports["DOWN"] = DOWN);
(exports["Rewriter"] = Rewriter);
(exports["rewrite"] = rewrite);