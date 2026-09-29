"use client";

import { ThemeProvider } from 'styled-components';
import Home from './pages/Home/Home';
import theme from './styles/Theme';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <Home />
            {children}
        </ThemeProvider>
    );
}
