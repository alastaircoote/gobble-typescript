var ts = require('typescript');
function compileTypeScript(input, options) {
    var _this = this;
    var moduleName = this.filename.replace(/\\/g, '/').replace(/.tsx?$/, '');
    if (options.moduleNamePrefix)
        moduleName = options.moduleNamePrefix + moduleName;
    var transpileOptions = {
        compilerOptions: options,
        reportDiagnostics: true,
        moduleName: moduleName
    };
    var result = ts.transpileModule(input, transpileOptions);
    result.diagnostics.forEach(function (diagnostic) {
        if (diagnostic.file) {
            var items = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            var line = items.line;
            var character = items.character;
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.warn(_this.filename + " (" + (line + 1) + "," + (character + 1) + "): " + message);
        }
        else {
            console.warn(_this.filename + ": " + diagnostic.messageText);
        }
    });
    if (result.diagnostics.length > 0)
        throw new Error('TypeScript compilation errors occurred.');
    return result.outputText;
}
;
compileTypeScript.defaults = {
    accept: ['.ts', '.tsx'],
    ext: '.js'
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = compileTypeScript;
