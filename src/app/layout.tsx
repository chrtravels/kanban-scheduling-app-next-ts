import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Providers from '../../context/Providers';
import SidebarLayout from '../../components/layout/SidebarLayout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

const plus_jakarta_sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kanban Boards',
  description: 'Scheduling App',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${plus_jakarta_sans.variable}`}>
        <Providers>
          <SidebarLayout>
          {children}
          </SidebarLayout>
        </Providers>
      </body>
    </html>
  )
}
