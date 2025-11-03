import React from "react"
import { PageType } from "../AppState"

export interface HeaderProps {
    setPage: (page: PageType) => void
}

export const Header: React.FC<HeaderProps> = props => {
    const { setPage } = props

    return <header className="header">
        <h1 onClick={() => setPage('home')}>Welcome to HTML Elements Example</h1>
        <nav>
            <ul className="nav-menu">
                <li><button onClick={() => setPage('home')}>Home</button></li>
                <li><button onClick={() => setPage('users-page')}>Users</button></li>
                <li><button onClick={() => setPage('random-student-group')}>Demo time!</button></li>
                <li><button onClick={() => setPage('about')}>About</button></li>
                <li><button onClick={() => setPage('sample-page')}>Sample page</button></li>
                <li><button onClick={() => setPage('article')}>Article</button></li>
                <li><button onClick={() => setPage('contact')}>Contact</button></li>
                <li><button onClick={() => setPage('tic-tac-toe')}>Awesome Tic Tac Toe Game</button></li>
                <li><button onClick={() => setPage('tic-tac-toe-ai')}>Or play the AI generated version</button></li>
            </ul>
        </nav>
    </header>
}