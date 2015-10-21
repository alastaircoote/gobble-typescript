var ts = require( 'typescript' );

module.exports = function compileTypeScript ( inputdir, outputdir, options, callback ) {
  var recursive = require('./readdir');
  
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
