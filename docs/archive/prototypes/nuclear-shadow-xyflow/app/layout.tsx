import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Nuclear Shadow | Ultraterrestrial',
  description: 'A traversable evidence graph for the architecture of nuclear secrecy.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
