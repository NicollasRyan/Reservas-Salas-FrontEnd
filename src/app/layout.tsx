import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, CalendarRange } from 'lucide-react'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reserva de Salas',
  description: 'Sistema de gerenciamento de salas e reservas',
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-gray-900">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
            <CalendarRange className="h-4 w-4" />
          </div>
          <span className="text-base">ReservaSalas</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/reservas"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <CalendarRange className="h-4 w-4" />
            Reservas
          </Link>
          <Link
            href="/salas"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <Building2 className="h-4 w-4" />
            Salas
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="flex min-h-full flex-col bg-gray-50 antialiased">
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
            {children}
          </main>
          <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
            Reserva de Salas &copy; {new Date().getFullYear()}
          </footer>
        </Providers>
      </body>
    </html>
  )
}
