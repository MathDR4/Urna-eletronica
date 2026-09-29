import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Home from './pages/Home/Home'
import { ThemeProvider } from 'styled-components'
import theme from "./styles/Theme";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Urna eletrônica 2024',
    description: '',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className} style={{ display: 'flex', justifyContent: 'center', background: '#fff' }}>
                <ThemeProvider theme={theme}>
                    <Home />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
