import { Metadata } from "next";
import React, { Suspense } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/ColorMode";
import "@refinedev/antd/dist/reset.css";
import { ConfigProvider } from "antd";
import "@styles/global.css";
import { RefineKbarProvider } from "@refinedev/kbar";
import i18nConfig from "@i18n/i18nConfig";

export const metadata: Metadata = {
  title: "Medixi",
  description: "Plateforme médicale spécialisée en radiologie"
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    fontFamily:
                      "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', sans-serif"
                  }
                }}
              >
                <ColorModeContextProvider>{children}</ColorModeContextProvider>
              </ConfigProvider>
            </AntdRegistry>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
