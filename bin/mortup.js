#!/usr/bin/env node

var fs = require('fs');
var mortup = require('../');

function usage() {
    console.error(`Usage: mortup [-hu] [file]

Options:
\t-h - show this help message.
\t-u - allow unsanitized text.

mortup will read text from stdin if no file given.`);
}

var options = {
    allow_unsanitized: false
};

var filename = null;

// Cut the first two arguments, the interpreter (/usr/bin/node) and the filename of this script
process.argv.splice(0, 2);

while (process.argv.length) {
    var arg = process.argv.shift();

    // Parse flag
    if (arg.indexOf('-') === 0) {
        // Split multiple flags
        // Multiple flags like -hu
        if (arg.length > 2) {
            process.argv = arg.substring(1).split('').map(function(ch) {
                return '-' + ch;
            }).concat(process.argv);
            arg = process.argv.shift();
        }
    }

    switch (arg) {
        case '-h':
            usage();
            process.exit(0);
            break;
        case '-u':
            options.allow_unsanitized = true;
            break;
        default:
            if (arg.charAt(0) === '-') {
                usage();
                process.exit(1);
            }

            filename = arg;
            break;
    }
}

var file

if (typeof filename == "string") {
    file = fs.createReadStream(filename);
} else {
    // Read from stdin if no file given.
    file = process.stdin;
}

var readline = require('readline');
var rd = readline.createInterface({
    input: file,
    output: process.stdout,
    terminal: false
});
var str = ""

rd.on('line', function(line) {
    str += line + '\n';
});

rd.on('close', function() {
    console.log(mortup(str, options));
});
