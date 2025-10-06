import React from "react";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Footer } from "./components/Footer";

export const App: React.FC = () => <div className="container">
    <Header />
    
    <main className="main-content">
        <Home />
    </main>

    <Footer />
</div>
