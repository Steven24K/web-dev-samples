import React, { useState } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AppState, defaultAppState } from "./AppState";
import { PageContent } from "./components/PageContent";

export const App: React.FC = () => {
    const [state, setState] = useState<AppState>(defaultAppState)

    return <div className="container">
        <Header setPage={page => setState({ ...state, page: page })} />

        <main className="main-content">
            <PageContent page={state.page} />
        </main>

        <Footer />
    </div>
}
