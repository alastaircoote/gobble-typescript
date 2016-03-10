import * as ts from 'typescript';

function compileTypeScript (input, options : CompileTypeScriptOptions) {
  var moduleName = this.filename.replace(/\\/g, '/').replace(/.tsx?$/, '');
  if(options.moduleNamePrefix)
    moduleName = options.moduleNamePrefix + moduleName;

  var transpileOptions : ts.TranspileOptions = {
    compilerOptions: options,
    reportDiagnostics: true,
    moduleName: moduleName
  };

  var result = ts.transpileModule(input, transpileOptions);

  result.diagnostics.forEach((diagnostic) => {
    if(diagnostic.file) {
      var items = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      var line = items.line;
      var character = items.character;
      var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.warn(this.filename +" ("+(line + 1)+","+(character + 1)+"): "+message);
    } else {
      console.warn(this.filename + ": " + diagnostic.messageText);
    }
  });

  if(result.diagnostics.length > 0)
    throw new Error( 'TypeScript compilation errors occurred.' );

  return {code: result.outputText, map: result.sourceMapText};
};

compileTypeScript.defaults = {
  accept: ['.ts', '.tsx'],
  ext: '.js'
}

export = compileTypeScript;

export interface CompileTypeScriptOptions extends ts.CompilerOptions {
  moduleNamePrefix?: string
}