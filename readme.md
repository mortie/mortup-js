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
