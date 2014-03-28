var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile(parser.parseStream(lexer.lex(input))))));
};
  

exports.single_value = function(test) {
    test.equal(
        testParser("var f = \\[x] -> x; f [1, 2, 3];"),
        1);
    
    test.done();
};

exports.multiple_values = function(test) {
    test.equal(
        testParser("var f = \\[x y z] -> x * y + z; f [1, 2, 3];"),
        5);
    
    test.done();
};

exports.undefined_value = function(test) {
    test.equal(
        testParser("var f = \\[_ y] -> y; f [1];"),
        undefined);
    
    test.done();
};

exports.underscore = function(test) {
    test.equal(
        testParser("var f = \\[_ _ x] -> x; f [1, 2, 3, 4];"),
        3);
    
    test.done();
};

exports.nested_array_unpacks = function(test) {
    test.equal(
        testParser("var f = \\[[x] y] -> x + y; f [[1], 3];"),
        4);
    
    test.done();
};

exports.array_like_target = function(test) {
    test.equal(
        testParser("var f = \\[x y z] -> z + y + x; f 'abcdef';"),
        'cba');
    
    test.done();
};
