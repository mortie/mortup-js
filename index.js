var patterns =
[
	{
		name: "codeblock_end",
		regex: /^```$/,
		before: ["codeblock"],
		last: true
	},
	{
		name: "codeblock_start",
		regex: /^```$/,
		last: true
	},
	{
		name: "codeblock",
		regex: /(.*)/,
		before: ["codeblock", "codeblock_start"],
		last: true
	},
	{
		name: "strong",
		regex: /(.*)\*(.+)\*(.*)/
	},
	{
		name: "emphasis",
		regex: /(.*)_(.+)_(.*)/
	},
	{
		name: "code",
		regex: /(.*)`(.+)`(.*)/
	},
	{
		name: "head",
		regex: /^(#+)\s*(.+)/,
		last: true
	},
	{
		name: "newline",
		regex: /(.*)/,
		last: true
	}
]

module.exports = function(str)
{
	var res = "";
	var prevpattern = "NONE";

	str.split("\n").map(function(line)
	{
		var p, i, m, j, t, shouldbreak;
		var compiled = line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		var prevcompiled = line;
		var firstrun = false;

		while (true)
		{
			//Find the first matching pattern
			for (i = 0; i < patterns.length; ++i)
			{
				p = patterns[i];
				t = p.regex.test(compiled);
				if (t)
				{
					m = compiled.match(p.regex);

					if (p.before === undefined)
						break;

					shouldbreak = false;
					for (j = 0; j < p.before.length; ++j)
					{
						if (prevpattern === p.before[j])
						{
							shouldbreak = true;
							break;
						}
					}

					if (shouldbreak)
						break;
				}
				else
				{
					m = false;
				}
			}

			//Stop if there is no match
			if (!m)
				break;

			prevpattern = p.name;

			//Compile
			compiled = compile(p.name, m);

			if (compiled === prevcompiled || p.last)
				break;

			prevcompiled = compiled;
			firstrun = true;
		}

		res += compiled + "\n";
	});

	return res.substring(0, res.length - 1);
}

function compile(p, match)
{
	switch (p)
	{
	case "strong":
		return match[1]+"<strong>"+match[2]+"</strong>"+match[3];
	case "emphasis":
		return match[1]+"<em>"+match[2]+"</em>"+match[3];
	case "head":
		var n = match[1].length;
		return "<h"+n+">"+match[2]+"</h"+n+">";
	case "codeblock_start":
		return "<pre><code>";
	case "codeblock":
		return match[1];
	case "codeblock_end":
		return "</code></pre>";
	case "code":
		return match[1]+"<code>"+match[2]+"</code>"+match[3];
	case "newline":
		return match[1]+"<br>";
	default:
		throw new Error("Pattern "+p+" doesn't exist.");
	}
}
