import React from "react";
import initTranslations from "../../../src/i18n/i18n";
import ClientLayout from "./ClientLayout";
import TranslationProvider from "@contexts/TranslationProvider";

const i18nNamespaces = ["common"];

export default async function Layout({ children, params: { locale } }: any) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationProvider
      locale={locale}
      resources={resources}
      namespaces={i18nNamespaces}
    >
      <ClientLayout>{children}</ClientLayout>
    </TranslationProvider>
  );
}
