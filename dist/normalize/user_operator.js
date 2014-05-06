/*
 * THIS FILE IS AUTO GENERATED from 'lib/normalize/user_operator.kep'
 * DO NOT EDIT
*/define(["require", "exports"], (function(require, exports) {
    "use strict";
    var rename, map = ({
            "*": "star",
            "/": "slash",
            "+": "plus",
            "-": "minus",
            "%": "percent",
            "<": "lt",
            ">": "gt",
            "=": "eq",
            "&": "and",
            "|": "bar",
            "^": "hat",
            "\\": "bslash",
            "~": "tilde",
            "@": "at"
        });
    (rename = (function(name) {
        return ("__" + name.split("")
            .map((function(y) {
                return map[y];
            }))
            .join("_"));
    }));
    return rename;
}));