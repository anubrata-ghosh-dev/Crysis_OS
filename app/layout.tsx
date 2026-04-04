import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRYSIS_OS - Crisis Intelligence Platform',
  description: 'Real-time crisis intelligence and emergency response system',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ backgroundColor: '#0B1220' }}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' font-weight='bold' fill='%2300D9FF'>◆</text></svg>" />
      </head>
      <body className={`${inter.className} bg-crisis-dark text-white overflow-hidden`} style={{ backgroundColor: '#0B1220', color: '#FFFFFF' }}>
        {children}
      </body>
    </html>
  );
}
