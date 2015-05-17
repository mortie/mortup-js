var mortup = require("./index.js");
var fs = require("fs");

var passedTests = 0;
var failedTests = 0;
var testsDone = 0;
var numTests;

var dirs = fs.readdirSync("test");
numTests = dirs.length;
dirs.forEach(function(dir)
{
	var cbs = 2;
	var mup;
	var html;

	fs.readFile("test/"+dir+"/test.mup", "utf8", function(err, res)
	{
		if (err) throw err;
		mup = res.trim();
		cbs -= 1;
		if (cbs === 0)
			test(dir, mup, html);
	});

	fs.readFile("test/"+dir+"/test.html", "utf8", function(err, res)
	{
		if (err) throw err;
		html = res.trim();
		cbs -= 1;
		if (cbs === 0)
			test(dir, mup, html);
	});
});

function test(name, mup, html)
{
	testhtml = mortup(mup, {allow_unsanitized: true});
	if (testhtml !== html)
	{
		console.log("########## Test "+name+" failed! ##########");
		console.log("Input:\n\n'"+mup+"'\n");
		console.log("Should become:\n\n'"+html+"'\n");
		console.log("Became:\n\n'"+testhtml+"'\n\n");
		failedTests += 1;
	}
	else
	{
		console.log("Passed "+name);
		passedTests += 1;
	}

	testsDone += 1;
	if (testsDone === numTests)
		conclude();
}

function conclude()
{
	console.log();
	console.log("Tests total:  ", numTests);
	console.log("Tests passed: ", passedTests);
	console.log("Tests failed: ", failedTests);
}
