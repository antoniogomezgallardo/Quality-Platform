import './global.css';
import { Providers } from '../lib/providers';
import { Navbar } from '../components/layout/navbar';
import { CartDrawer } from '../components/cart/cart-drawer';

export const metadata = {
  title: 'Quality Platform Store',
  description: 'A complete e-commerce platform demonstrating quality engineering practices',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
