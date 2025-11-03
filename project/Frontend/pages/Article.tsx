import React from "react";

export const Article: React.FC = () => <article id="article">
    <h2>Sample Article</h2>
    <p>
        {/* The <strong> tag highlights important text */}
        <strong>HTML</strong> is the standard markup language for web pages.
        {/* The <em> tag emphasizes text */}
        <em>Learning HTML</em> is the first step to web development.
    </p>
    {/* The <blockquote> tag for quoted text */}
    <blockquote cite="https://www.w3.org/">
        "HTML is the backbone of the web."
    </blockquote>
    {/* The <pre> tag preserves whitespace and formatting */}
    <pre>
        {/* The <code> tag indicated this is code */}
        <code>{`<h1>Hello, world!</h1>`}</code>
    </pre>
    {/* The <a> tag creates a hyperlink */}
    <p>
        Visit the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML">MDN HTML Guide</a> for more info.
    </p>
    {/* The <table> tag creates a table */}
    <table>
        <thead>
            <tr>
                {/* The <th> tag defines a table header */}
                <th>Name</th>
                <th>Role</th>
            </tr>
        </thead>
        <tbody>
            {/* The <tr> tag defines a table row */}
            <tr>
                {/* The <td> tag defines a table cell */}
                <td>Alice</td>
                <td>Student</td>
            </tr>
            <tr>
                <td>Bob</td>
                <td>Teacher</td>
            </tr>
        </tbody>
    </table>
</article>