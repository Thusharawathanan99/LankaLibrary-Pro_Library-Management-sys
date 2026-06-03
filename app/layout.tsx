import './globals.css';
import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' });

export const metadata: Metadata = {
  title: 'Ceylon Digital Library | Official Portal',
  description: 'National Heritage Library of Sri Lanka - Digital Archives and Catalog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${fraunces.variable} font-sans`}>{children}</body>
    </html>
  );
}

