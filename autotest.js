var mortup = require("./index.js");
var fs = require("fs");

var passedTests = 0;
var failedTests = 0;

var dirs = fs.readdirSync("test");
dirs.forEach(function(dir)
{
	if (fs.existsSync("test/"+dir+"/test.html"))
		return console.log(dir+"/test.html exists. Skipping.");

	fs.readFile("test/"+dir+"/test.mup", "utf8", function(err, res)
	{
		if (err) throw err;

		var html = mortup(res.trim());
		fs.writeFile("test/"+dir+"/test.html", html, function(err)
		{
			if (err) throw err;

			console.log("Made "+dir+"/test.html.");
		});
	});
});

