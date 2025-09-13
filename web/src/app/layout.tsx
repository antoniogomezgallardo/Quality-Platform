import './global.css';

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
        {children}
      </body>
    </html>
  );
}
