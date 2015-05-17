# Mortup Markup Language

This is a library for node.js for compiling mortup to HTML.

## The Mortup Language

Here's a small rundown of the mortup language:

	This line has *bold* words, and it has _italized_ words.

	This line has <strong>bold</strong> words, and it has <em>italized</em> words.<br>


	This line contains `code`.

	This line contains <code>code</code>.<br>


	This line contains (a link)[https://github.com/mortie/mortup].
	And this contains an image: img[http://example.com/pic.png]

	This line contains <a href="https://github.com/mortie/mortup">a link</a>.
	And this contains an image: <img src="http://example.com/pic.png>


	* Here we have a bullet list.
	* It can have *many* elements.

	<ul>
	<li>Here we have a bullet list.</li>
	<li>It can have <strong>many</strong> elements.
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

	Most of the time you want safe &lt;div&gt;sanitized HTML&lt;div&gt;.
	However, you may need unsanitized HTML sometimes:
	<script>alert("I can do whatever I want now.")</script>
	<div>It doesn't even *care* about formatting either.</div>
