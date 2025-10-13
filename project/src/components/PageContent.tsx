import React from "react";
import { PageType } from "../AppState";
import { Contact } from "../pages/Contact";
import { About } from "../pages/About";
import { Home } from "../pages/Home";
import { Article } from "../pages/Article";
import { BasicSamplePage } from "../pages/basic-sample-page";
import TicTacToeAI from "../pages/tic-tac-toe-ai";
import { TicTacToe } from "../pages/tic-tac-toe";

interface PageContentProps {
    page: PageType
}

export const PageContent: React.FC<PageContentProps> = props => {
    const { page } = props
    switch (page) {
        case "home":
            return <Home />
        case "about":
            return <About />
        case "contact":
            return <Contact />
        case "article":
            return <Article />
        case "sample-page":
            return <BasicSamplePage />
        case "tic-tac-toe":
            return <TicTacToe />
        case "tic-tac-toe-ai":
            return <TicTacToeAI />
        default:
            return <div>404 Not Found</div>
    }
}