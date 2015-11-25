var ts = require( 'typescript' );

function enumOptionNames(enumType) {
  var values = [];
  for (var key in enumType) {
    if (enumType.hasOwnProperty(key)) {
      var element = enumType[key];
      if(typeof element == 'number') {
        values.push('"' + key + '"');
      }
    }
  }
  return values;
}

function parseEnum(value, enumName, enumType, defaultValue) {  
  if(enumType[value] && typeof enumType[value] == 'number') {
    return enumType[value];
  }
   
  var defaultValueName = enumType[defaultValue];
  console.warn(enumName+" type '"+value+"' is not supported. Defaulting to "+defaultValueName);
  console.warn("Supported options are: "+enumOptionNames(enumType).join(', '));
  return defaultValue;
}

function parseOptions(options)
{
  if(!options) {
    return {};
  }
  
  if(options.target) {
    options.target = parseEnum(options.target, "ScriptTarget", ts.ScriptTarget, ts.ScriptTarget.ES5);
  }
  
  if(options.module) {
    options.module = parseEnum(options.module, "ModuleKind", ts.ModuleKind, ts.ModuleKind.CommonJS);
  }
  
  if(options.jsx) {
    options.jsx = parseEnum(options.jsx, "JsxEmit", ts.JsxEmit, ts.JsxEmit.React);
  }
  
  return options;
}

module.exports = function compileTypeScript ( inputdir, outputdir, options, callback ) {
  var recursive = require('./readdir');
  
  options = parseOptions(options);
  
  options.rootDir = inputdir;
  options.outDir = outputdir;
  
  recursive(inputdir, ['*.ts', '*.tsx'], function (err, files) {
    if(err)
      return callback();
      
    var program = ts.createProgram(files, options);        
    var emitResult = program.emit();  
    
    var allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);    
    
    allDiagnostics.forEach(function(diagnostic) {
      if(diagnostic.file) {
        var items = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        var line = items.line;
        var character = items.character;
        var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
        console.log(diagnostic.file.fileName +" ("+(line + 1)+","+(character + 1)+"): "+message);        
      } else {
        console.log(diagnostic.messageText);
      }
    });
    if(allDiagnostics.length)
    {
      callback('Typescript compilation did not complete.');
      return;
    }
    callback();
  });  
};
