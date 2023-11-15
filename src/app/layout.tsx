import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../../context/Providers';
import Navbar from '../../components/navbar/Navbar';
import SidebarLayout from '../../components/layout/SidebarLayout';

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <Providers>
          {/* <div className='layout-navbar'>
            <Navbar />
          </div> */}
          <SidebarLayout>
          {children}
          </SidebarLayout>
        </Providers>
      </body>
    </html>
  )
}
