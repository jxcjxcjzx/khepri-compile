/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/compile.kep'
 * DO NOT EDIT
*/
"use strict";
var Error = require("akh")["error"],
    pre_normalize = require("./stages/pre_normalize"),
    lexical = require("./stages/lexical"),
    post_normalize = require("./stages/post_normalize"),
    inline = require("./stages/inline"),
    khepri_peep = require("./stages/khepri_peep"),
    transform = require("./stages/transform"),
    ecma_peep = require("./stages/ecma_peep"),
    compile, compiler = (function(x) {
        return pre_normalize(x)
            .chain(lexical)
            .chain(post_normalize)
            .chain(inline)
            .chain(khepri_peep)
            .chain(transform)
            .chain(ecma_peep);
    }),
    extract = (function(__o) {
        var tree = __o["tree"];
        return tree;
    }),
    thr = (function(x) {
        throw x;
    });
(compile = (function(root, options, err) {
    var x;
    return Error.runError(((x = ({
            "tree": root,
            "options": (options || ({}))
        })), pre_normalize(x)
        .chain(lexical)
        .chain(post_normalize)
        .chain(inline)
        .chain(khepri_peep)
        .chain(transform)
        .chain(ecma_peep)), extract, (err || thr));
}));
(module.exports = compile);