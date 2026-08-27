import './globals.css';
import localFont from 'next/font/local';
import Chrome from './chrome.jsx';

const display = localFont({
  variable: '--font-oswald',
  src: [
    { path: './fonts/oswald-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/oswald-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/oswald-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});
const mono = localFont({
  variable: '--font-mono-f',
  src: [
    { path: './fonts/space-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/space-mono-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});
const hand = localFont({
  variable: '--font-hand',
  src: [
    { path: './fonts/kalam-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/kalam-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});

export const metadata = {
  title: 'RAKHI.PROTOCOL — for didi only',
  description: 'this is not a website. it is a reply. 28.08.2026',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'RAKHI.PROTOCOL — for didi only',
    description: 'this is not a website. it is a reply.',
    images: ['/og-image.png'],
  },
};

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable} ${hand.variable}`}>
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
