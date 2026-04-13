import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'CRYSIS_OS - Report Emergency',
  description: 'Report emergencies and help save lives',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ backgroundColor: '#0B1220' }}>
      <body className="bg-crisis-dark text-white" style={{ backgroundColor: '#0B1220', color: '#FFFFFF' }}>
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
