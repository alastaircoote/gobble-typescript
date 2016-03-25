import * as ts from "typescript";
import path = require('path');

const compileTypeScript: GobbleTransformer = function (inputDir, outputDir, options: ts.CompilerOptions, callback) {
  const typescriptFile = /\.tsx?$/;
  const sander = this.sander;
  const emitDiagnostic = (diagnostic: ts.Diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");

    if (diagnostic.file) {
      const {line, character} = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);

      if (diagnostic.category === ts.DiagnosticCategory.Error) {
        callback({
          file: diagnostic.file.fileName,
          line: line + 1,
          column: character + 1,
          message: message
        });

        return true;
      }

      console.error(`Error: ${message} (${diagnostic.file.fileName}:${line + 1}:${character + 1})`);
      return false;
    }

    if (diagnostic.category === ts.DiagnosticCategory.Error) {
      callback({
        message: diagnostic.messageText
      });
      return true;
    }

    console.error(`Error: ${message}`);
    return false;
  };

  return sander.lsr( inputDir ).then(files => {
    options.outDir = outputDir;
    options.rootDir = inputDir;

    let fileNames = files
        .filter((file) => typescriptFile.test(file))
        .map((file) => path.resolve(inputDir, file));

    let program = ts.createProgram(fileNames, options);
    if (program.emit().diagnostics.some(emitDiagnostic))
      return;

    if (ts.getPreEmitDiagnostics(program).some(emitDiagnostic))
      return;
  });
};

export = compileTypeScript;