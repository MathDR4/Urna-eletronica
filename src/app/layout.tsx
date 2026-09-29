import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providers from './Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Urna eletrônica 2024',
    description: '',
}

export default function RootLayout({
    children,
}: any) {
    return (
        <html lang="en">
            <body className={inter.className} style={{ display: 'flex', justifyContent: 'center', background: '#fff' }}>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
