# Mortup Markup Language

This is a library for node.js for compiling mortup to HTML. The reason I've made it is that while Markdown is nice enough, it does have some issues which I dislike.

## Usage

Install: `npm install mortup`

Use:

```
var mortup = require("mortup");

console.log(mortup("Some *mortup* text", {
	allow_unsanitized: false
}));
```

## The Mortup Language

### Why this language exists

Here are the features with Markdown which annoy me, and the reasons I decided to create my own format.

* **Blockquotes**. With Markdown, I can't really figure out a nice way to quote paragraphs. You either have to insert hard newlines and prefix each line with '>', which makes the plaintext markdown look pretty but is usually a lot of unnecessary work, or leave the markdown looking ugly. I fix this by making blockquotes work like code blocks, except with ">>>" instead of "```".
* **Bold and italics**. In markdown, both `__something__` and `**something**` creates strong text (bold), while both `_something_` and `*something*` creates emphasized text (italics). I find this to be redundant and silly, and decided to make `*something*` strong, `//something//` emphasized, and `_something`_ underlined.
* **Links**. Links in markdown looks like this: `[Some link text](http://example.com)`. I find that to be backwards. In text, citations are often in brackets, and even Markdown's footnotes use brackets. Therefore, I made the link syntax `(Some link text)[http://example.com]`. The new image syntax is `!(Some alt text)[http://example.com/image.png]`.
* **Ordered lists**. With Markdown, regardless of how your plaintext markdown text looks like, sorted lists will always start at 1, and each new element will always increment by 1. This is an unnecessary constraint, as HTML has a native way of dealing with non-sequential ordered lists, and even "ordered" lists where the numbers aren't ordered.
* **Two spaces at the end of the line** creates a hard newline in Markdown. I find that to be ridiculous. That means two lines can look exactly identical, yet produce different HTML. It's also easy to accidentally include those two spaces where they're not intended. I fixed this by just inserting a `<br>` anywhere the page breaks. I know there are some people who disagree with this, but I feel that it's a decent solution, and more intuitive than what Markdown does.
* **Code blocks**. In Markdown, there are many ways to denote that something is a code block; one is to indent consecutive lines, which is hard in a `<textarea>`, which is one of the main places in which Markdown is used. The other is to use code in \`\`\`, which I think is a better solution, but Markdown's implementation has been fiddly in my exprience. For example, you can't have a code block with a non-empty line directly above it. I have simplified all of this by just always having blocks of \`\`\` generate `<pre><code>...</code></pre>`.
* **Unsanitized HTML**. A lot of markdown parsers allow you to write HTML in your markdown text. However, this has always been problematic for me, as that HTML goes through the markdown parser, which may break things. In Mortup, HTML will always be escaped, _unless_ it's in a block, similar to code blocks, of `!!!!`. If the `allow_unsanitized: true` option is passed to the parser, everything inside of blocks surrounded by `!!!!` will be taken as-is, not going through the markdown parser, and not sanitized.

### Syntax

Here's a small rundown of all the features in the language.

	This line has *bold* words, and it has //italized// words. It even has _underlined_ words.

	This line has <strong>bold</strong> words, and it has <em>italized</em> words. It even has <u>underlined</u> words.<br>


	This line contains `code`.

	This line contains <code>code</code>.<br>


	This line contains (a link)[https://github.com/mortie/mortup].
	And this contains an image: !(an image)[http://example.com/pic.png]

	This line contains <a href="https://github.com/mortie/mortup">a link</a>.
	And this contains an image: <img src="http://example.com/pic.png>


	* Here we have a bullet list.
	* It can have *many* elements.

	<ul>
	<li>Here we have a bullet list.</li>
	<li>It can have <strong>many</strong> elements.</li>
	</ul>


	1. This is a sorted, or ordered, list.
	2. It has ordered elements.
	9. Elements don't have to be sequential, however.

	<ol start="1">
	<li>This is a sorted, or ordered, list.</li>
	<li value="2">It has ordered elements.</li>
	<li value="9">Elements don't have to be sequential, however.</li>
	</ol>


	```
		This is a code block.
		Things won't *be bold* or _italized_ here.
		if (this.is(neat))
		{
			dance();
		}
	```

	<pre><code>
		This is a code block.
		Things won't *be bold* or _italized_ here.
		if (this.is(neat))
		{
			dance();
		}
	</code></pre>


	This is just some general text.
	It has some newlines.
	It has *multiple* newlines.

	This is just some general text.<br>
	It has some newlines.<br>
	It has <strong>multiple</strong> newlines.


	This is a very long continuous line of text. It relies on soft wrapping. No <br> tags will automatically be inserted, it is up to the HTML renderer to break the text wherever it sees fit.

	This is a very long continuous line of text. It relies on soft wrapping. No &lt;br&gt; tags will automatically be inserted, it is up to the HTML renderer to break the text wherever it sees fit.


	>>>
	This is a blockquote.
	We can have *all kinds* of formatting here.
	```
		Even code!
	```
	>>>

	<blockquote>
	This is a blockquote.<br>
	We can have <strong>all kinds</strong> of formatting here.
	<pre><code>
		Even code!
	</pre></code>
	</blockquote>

	Most of the time, you want safe <div>sanitized HTML</div>.
	However, you may need unsanitized HTML sometimes:
	!!!!
	<script>alert("I can do whatever I want now.")</script>
	<div>It doesn't *care* about formatting either.</div>
	!!!!

	Most of the time you want safe &lt;div&gt;sanitized HTML&lt;div&gt;.<br>
	However, you may need unsanitized HTML sometimes:<br>
	<script>alert("I can do whatever I want now.")</script>
	<div>It doesn't even *care* about formatting either.</div>


## License

The MIT License (MIT)

Copyright (c) 2015 Martin Dørum Nygaard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
