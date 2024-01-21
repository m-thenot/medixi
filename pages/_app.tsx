import {
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/antd";
import { AuthBindings, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React from "react";

import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts";
import "@refinedev/antd/dist/reset.css";
import dataProvider, { GraphQLClient } from "@refinedev/hasura";
import { App as AntdApp } from "antd";
import { appWithTranslation, useTranslation } from "next-i18next";
import { AppIcon } from "src/components/app-icon";
import { KindeProvider, useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { redirect } from "next/navigation";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import "dayjs/locale/fr";

const client = (getToken: () => string | null) =>
  new GraphQLClient(process.env.NEXT_PUBLIC_API_URL!, {
    fetch: (url: string, options: RequestInit) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${getToken()}`,
        },
      });
    },
  });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = (props: React.PropsWithChildren) => {
  const { t, i18n } = useTranslation();

  const { user, isAuthenticated, isLoading, getToken } = useKindeAuth();
  const router = useRouter();
  const { to } = router.query;

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  if (isLoading) {
    return <span>loading...</span>;
  }

  const authProvider: AuthBindings = {
    login: async () => {
      redirect(
        `/api/auth/login?post_login_redirect_url=${to ? to.toString() : "/"}`
      );

      return {
        success: true,
      };
    },
    logout: async () => {
      router.push(`/api/auth/logout`);

      return {
        success: true,
      };
    },
    onError: async (error) => {
      console.error(error);
      return {
        error,
      };
    },
    check: async () => {
      if (!isAuthenticated) {
        return {
          authenticated: false,
          redirectTo: `/api/auth/login?post_login_redirect_url=${
            to ? to.toString() : "/"
          }`,
        };
      }

      return {
        authenticated: true,
      };
    },
    getPermissions: async () => {
      return null;
    },
    getIdentity: async () => {
      if (user) {
        return {
          name: user.given_name,
          avatar: user.picture,
        };
      }

      return null;
    },
  };

  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider(client(getToken))}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: "patients",
                  list: "/patients",
                  create: "/patients/create",
                  edit: "/patients/edit/:id",
                  show: "/patients/show/:id",
                  meta: {
                    canDelete: false,
                    icon: <UserOutlined />,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  edit: "/users/edit/:id",
                  meta: {
                    label: t("users.list.title"),
                    icon: <SettingOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
              }}
            >
              {props.children}
              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  );
};

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Header={() => <Header sticky />}
        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
        Title={({ collapsed }) => (
          <ThemedTitleV2
            collapsed={collapsed}
            text="Medixi"
            icon={<AppIcon />}
          />
        )}
      >
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };

  return (
    <KindeProvider>
      <App>{renderComponent()}</App>
    </KindeProvider>
  );
}

export default appWithTranslation(MyApp);
