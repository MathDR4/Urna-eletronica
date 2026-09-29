"use client";

import { ThemeProvider } from 'styled-components';
import { usePathname } from 'next/navigation';
import Home from './pages/Home/Home';
import theme from './styles/Theme';

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <ThemeProvider theme={theme}>
            {pathname === '/' && <Home />}
            {children}
        </ThemeProvider>
    );
}
