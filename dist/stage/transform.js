/*
 * THIS FILE IS AUTO GENERATED from 'lib/stage/transform.kep'
 * DO NOT EDIT
*/define(["require", "exports", "../transform", "bes/object"], (function(require, exports, transformer, __o) {
    "use strict";
    var setProperty = __o["setProperty"],
        transform;
    (transform = (function(input) {
        var options = input["options"],
            ast = input["ast"],
            data = input["data"];
        return setProperty(input, "ast", transformer.transform(ast, (options.package_manager || "amd"),
            data));
    }));
    (exports["transform"] = transform);
}));