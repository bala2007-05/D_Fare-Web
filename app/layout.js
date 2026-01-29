'use client';

import './globals.css';
import { RoleProvider } from '@/lib/roleContext';
import { ProviderProvider } from '@/lib/providerContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProviderProvider>
          <RoleProvider>
            {children}
          </RoleProvider>
        </ProviderProvider>
      </body>
    </html>
  );
}
