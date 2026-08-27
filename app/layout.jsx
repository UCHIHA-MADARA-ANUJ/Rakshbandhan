import './globals.css';
import localFont from 'next/font/local';

const display = localFont({
  variable: '--font-display',
  src: [
    { path: './fonts/fraunces-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/fraunces-latin-400-italic.woff2', weight: '400', style: 'italic' },
    { path: './fonts/fraunces-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/fraunces-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});
const ui = localFont({
  variable: '--font-ui',
  src: [
    { path: './fonts/space-grotesk-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/space-grotesk-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/space-grotesk-latin-700-normal.woff2', weight: '700', style: 'normal' },
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
  title: 'for dayan only 🌙',
  description: 'yeh website nahi hai. ye reply hai.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'for dayan only 🌙',
    description: 'yeh website nahi hai. ye reply hai. — tumhara bhai',
    images: ['/og-image.png'],
  },
};

export const viewport = {
  themeColor: '#06060B',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className={`${display.variable} ${ui.variable} ${mono.variable} ${hand.variable}`}>
        {children}
      </body>
    </html>
  );
}
