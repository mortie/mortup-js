var patterns =
[
	{
		name: "codeblock_end",
		regex: /^```$/,
		state: "codeblock",
		endstate: "codeblock",
		last: true
	}, {
		name: "codeblock_start",
		regex: /^```$/,
		startstate: "codeblock",
		last: true
	}, {
		name: "codeblock",
		regex: /(.*)/,
		state: "codeblock",
		last: true
	},
	{
		name: "strong",
		regex: /(.*)\*(.+)\*(.*)/
	}, {
		name: "emphasis",
		regex: /(.*)_(.+)_(.*)/
	}, {
		name: "code",
		regex: /(.*)`(.+)`(.*)/
	}, {
		name: "link",
		regex: /(.*)\((.*)\)\[(.*)\](.*)/
	}, {
		name: "image",
		regex: /(.*)img\[(.*)\](.*)/
	},
	{
		name: "head",
		regex: /^(#+)\s*(.+)/,
		last: true
	},
	{
		name: "blockquote_end",
		regex: /^&gt;&gt;&gt;$/,
		state: "blockquote",
		endstate: "blockquote",
		last: true
	}, {
		name: "blockquote_start",
		regex: /^&gt;&gt;&gt;$/,
		startstate: "blockquote",
		last: true
	},
	{
		name: "newline",
		regex: /(.*)/,
		last: true
	},
	{
		name: "blockquote",
		regex: /(.*)/,
		state: "blockquote",
		last: true
	},
]

var states = {
	codeblock: 0,
	blockquote: 0
}

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

					if (p.state === undefined)
						break;

					shouldbreak = false;
					if (states[p.state] > 0)
						break;
				}
				else
				{
					m = false;
				}
			}

			if (p.startstate)
				states[p.startstate] += 1;
			if (p.endstate && states[p.endstate] > 0)
				states[p.endstate] -= 1;

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
	case "code":
		return match[1]+"<code>"+match[2]+"</code>"+match[3];
	case "link":
		return match[1]+"<a href=\""+match[3]+"\">"+match[2]+"</a>"+match[4];
	case "image":
		return match[1]+"<img src=\""+match[2]+"\">"+match[3];

	case "head":
		var n = match[1].length;
		return "<h"+n+">"+match[2]+"</h"+n+">";

	case "codeblock_start":
		return "<pre><code>";
	case "codeblock":
		return match[1];
	case "codeblock_end":
		return "</code></pre>";

	case "blockquote_start":
		return "<blockquote>";
	case "blockquote":
		return match[1];
	case "blockquote_end":
		return "</blockquote>";

	case "newline":
		return match[1]+"<br>";

	default:
		throw new Error("Pattern "+p+" doesn't exist.");
	}
}
