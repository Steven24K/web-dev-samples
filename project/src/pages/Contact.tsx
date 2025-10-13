import React from "react";

export const Contact: React.FC = () => <section id="contact">
    <h2>Contact Us</h2>
    {/* The <form> tag creates a form for user input */}
    <form>
        {/* The <label> tag labels form elements */}
        <label htmlFor="name">Name:</label>
        {/* The <input> tag for user input */}
        <input type="text" id="name" name="name" />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" />
        <br />
        {/* The <textarea> tag for multi-line input */}
        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message"></textarea>
        <br />
        {/* The <button> tag creates a clickable button */}
        <button type="submit" className="button">Send</button>
    </form>
</section>