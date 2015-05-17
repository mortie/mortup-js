var patterns =
[
	{
		name: "raw_end",
		regex: /^\!\!\!\!$/,
		state: "raw",
		endstate: "raw",
		last: true
	}, {
		name: "raw_start",
		regex: /^\!\!\!\!$/,
		startstate: "raw",
		last: true
	}, {
		name: "raw",
		regex: /(.*)/,
		state: "raw",
		last: true
	},
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
		name: "sortedlist",
		regex: /^\s*([0-9]+)\.\s+(.*)/,
		state: "sortedlist",
		last: true
	}, {
		name: "sortedlist_start",
		regex: /^\s*([0-9]+)\.\s+(.*)/,
		startstate: "sortedlist",
		last: true
	}, {
		name: "sortedlist_end",
		regex: /(.*)/,
		state: "sortedlist",
		endstate: "sortedlist",
		last: true,
		lastrun: true
	},
	{
		name: "bulletlist",
		regex: /^\s*\*\s*(.*)/,
		state: "bulletlist",
		last: true
	}, {
		name: "bulletlist_start",
		regex: /^\s*\*\s*(.*)/,
		startstate: "bulletlist",
		last: true
	}, {
		name: "bulletlist_end",
		regex: /(.*)/,
		state: "bulletlist",
		endstate: "bulletlist",
		last: true,
		lastrun: true
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
	}
]

var states = {
	raw: 0,
	codeblock: 0,
	blockquote: 0,
	sortedlist: 0,
	bulletlist: 0
}

module.exports = function(str, opts)
{
	var res = "";
	var prevpattern = "NONE";
	str = str.trim();
	str += "\n";

	str.split("\n").map(function(line, linenum, arr)
	{
		var p, i, m, j, t, shouldbreak;
		var compiled = line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
		var prevcompiled = line;
		var firstrun = false;
		var lastrun = (linenum + 1 === arr.length);

		while (true)
		{
			//Find the first matching pattern
			for (i = 0; i < patterns.length; ++i)
			{
				p = patterns[i];
				t = p.regex.test(compiled);
				if (t && (!lastrun || p.lastrun))
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
			compiled = compile(p.name, m, opts);

			if (compiled === prevcompiled || p.last)
				break;

			prevcompiled = compiled;
			firstrun = true;
		}

		res += compiled;
		if (!lastrun)
			res += "\n";
	});

	return res.substring(0, res.length - 1);
}

function compile(p, match, opts)
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

	case "raw_start":
		if (opts.allow_unsanitized === true)
			return "";
		else
			throw new Error("Unsanitized code is disabled.");
	case "raw":
		if (opts.allow_unsanitized === true)
			return match[1].replace(/&gt;/g, ">").replace(/&lt;/g, "<");
		else
			return match[1];
	case "raw_end":
		return "";

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

	case "sortedlist_start":
		return "<ol start=\""+match[1]+"\">\n<li>"+match[2]+"</li>";
	case "sortedlist":
		return "<li value=\""+match[1]+"\">"+match[2]+"</li>";
	case "sortedlist_end":
		return "</ol>\n"+match[1];

	case "bulletlist_start":
		return "<ul>\n<li>"+match[1]+"</li>";
	case "bulletlist":
		return "<li>"+match[1]+"</li>";
	case "bulletlist_end":
		return "</ul>\n"+match[1];

	case "newline":
		return match[1]+"<br>";

	default:
		throw new Error("Pattern "+p+" doesn't exist.");
	}
}
