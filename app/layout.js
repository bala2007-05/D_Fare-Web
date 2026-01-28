import './globals.css';

export const metadata = {
  title: 'D-FARE Management Dashboard',
  description: 'AI-Powered Fair Dispatch System - Management Console',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
