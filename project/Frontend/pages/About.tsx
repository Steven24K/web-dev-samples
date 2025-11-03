import React from "react";

export const About: React.FC = () => <section id="about">
    <h1>About This Page</h1>
    {/* The <p> tag defines a paragraph */}
    <p>This page demonstrates basic HTML elements in context.</p>
    {/* The <ul> tag creates an unordered list */}
    <ul>
        {/* The <li> tag defines a list item */}
        <li>Semantic structure</li>
        <li>Short descriptions</li>
        <li>Life-like examples</li>
    </ul>
    {/* The <ol> tag creates an ordered list */}
    <ol>
        <li>Learn HTML</li>
        <li>Practice coding</li>
        <li>Build web pages</li>
    </ol>
    {/* The <figure> tag groups media and caption */}
    <figure>
        {/* The <img> tag embeds an image */}
        <img src="https://picsum.photos/id/91/200/300" alt="Placeholder image" />
        {/* The <figcaption> tag adds a caption to the image */}
        <figcaption>Example of an oldschool selfie</figcaption>
    </figure>
</section>
