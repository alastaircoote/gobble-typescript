"use strict";
var ts = require("typescript");
var path = require('path');
var compileTypeScript = function (inputDir, outputDir, options, callback) {
    var typescriptFile = /\.tsx?$/;
    var sander = this.sander;
    var emitDiagnostic = function (diagnostic) {
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
            if (diagnostic.category === ts.DiagnosticCategory.Error) {
                callback({
                    file: diagnostic.file.fileName,
                    line: line + 1,
                    column: character + 1,
                    message: message
                });
                return true;
            }
            console.error("Error: " + message + " (" + diagnostic.file.fileName + ":" + (line + 1) + ":" + (character + 1) + ")");
            return false;
        }
        if (diagnostic.category === ts.DiagnosticCategory.Error) {
            callback({
                message: diagnostic.messageText
            });
            return true;
        }
        console.error("Error: " + message);
        return false;
    };
    return sander.lsr(inputDir).then(function (files) {
        options.outDir = outputDir;
        options.rootDir = inputDir;
        var fileNames = files
            .filter(function (file) { return typescriptFile.test(file); })
            .map(function (file) { return path.resolve(inputDir, file); });
        var program = ts.createProgram(fileNames, options);
        if (program.emit().diagnostics.some(emitDiagnostic))
            return;
        if (ts.getPreEmitDiagnostics(program).some(emitDiagnostic))
            return;
    });
};
module.exports = compileTypeScript;
