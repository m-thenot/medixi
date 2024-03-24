"use client";

import routerProvider from "@refinedev/nextjs-router";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNotificationProvider } from "@refinedev/antd";
import dataProviderHasura, { GraphQLClient } from "@refinedev/hasura";
import { AuthBindings, Refine } from "@refinedev/core";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import PageLoader from "@components/PageLoader";
import { redirect, useRouter } from "next/navigation";
import { ThemedLayout } from "@components/ThemeLayout";
import { useTranslation } from "react-i18next";
import { RefineKbar } from "@refinedev/kbar";
import { logger } from "src/services/logger";

const client = (token: string | null) =>
  new GraphQLClient(process.env.NEXT_PUBLIC_API_URL!, {
    fetch: (url: string, options: RequestInit) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`
        }
      });
    }
  });

const ClientLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user, isAuthenticated, getToken, isLoading } =
    useKindeBrowserClient();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const pathPrefix = i18n.language === "fr" ? "" : `/${i18n.language}`;

  if (isLoading) {
    return <PageLoader />;
  }

  const authProvider: AuthBindings = {
    login: async () => {
      redirect(`/api/auth/login?post_login_redirect_url=/patients}`);

      return {
        success: true
      };
    },
    logout: async () => {
      router.push(`/api/auth/logout`);

      return {
        success: true
      };
    },
    onError: async (error) => {
      logger.error(error);
      return {
        error
      };
    },
    check: async () => {
      if (!isAuthenticated) {
        return {
          authenticated: false,
          redirectTo: `/api/auth/login?post_login_redirect_url=/patients
          }`
        };
      }

      return {
        authenticated: true
      };
    },
    getPermissions: async () => {
      return null;
    },
    getIdentity: async () => {
      if (user) {
        return {
          name: user.given_name,
          avatar: user.picture
        };
      }

      return null;
    }
  };

  const i18nProvider = {
    translate: (key: string, params: any) => t(key, params) as string,
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language
  };

  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProviderHasura(client(getToken()))}
      notificationProvider={useNotificationProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      resources={[
        {
          name: "patients",
          list: `${pathPrefix}/patients`,
          create: `${pathPrefix}/patients/create`,
          edit: `${pathPrefix}/patients/edit/:id`,
          show: `${pathPrefix}/patients/show/:id`,
          meta: {
            canDelete: false,
            icon: <UserOutlined />
          }
        },
        {
          name: "users",
          list: `${pathPrefix}/users`,
          edit: `${pathPrefix}/users/edit/:id`,
          meta: {
            label: t("users.list.title"),
            icon: <SettingOutlined />
          }
        }
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: false,
        useNewQueryKeys: true
      }}
    >
      <ThemedLayout>
        {children}
        <RefineKbar />
      </ThemedLayout>
    </Refine>
  );
};

export default ClientLayout;
