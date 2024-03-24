import "@styles/base.css";
import "@styles/global.css";

export const metadata = {
  title: "Medixi",
  description: "Plateforme médicale spécialisée en radiologie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased bg-body text-body font-body">
        {children}
      </body>
    </html>
  );
}
