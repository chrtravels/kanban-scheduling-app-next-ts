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

export const metadata = {
  title: 'Kanban Boards',
  description: 'Scheduling App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
