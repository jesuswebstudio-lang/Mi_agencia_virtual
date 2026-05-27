import './globals.css'
import { Inter, Instrument_Serif } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const instrumentSerif = Instrument_Serif({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
})

export const metadata = {
  title: 'Fluxia - Agencia de Automatización e IA',
  description: 'Automatiza tu negocio con agentes de Inteligencia Artificial. Diseñamos, entrenamos e integramos delegados autónomos que optimizan tus operaciones 24/7.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${instrumentSerif.variable} bg-background`}>
      <body className="font-sans bg-background text-foreground">{children}</body>
    </html>
  )
}
