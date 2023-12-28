"use client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { AntdListInferencer } from "@refinedev/inferencer/antd";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { inferencerPredefinedMeta } from "src/inferencerPredefinedMeta";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function BlogPostList() {
  return (
    <>
      <AntdListInferencer meta={inferencerPredefinedMeta} />;
    </>
  );
}

export const getServerSideProps = async ({
  req,
  res,
  locale,
}: {
  req: Request;
  res: Response;
  locale: string;
}) => {
  const { isAuthenticated } = getKindeServerSession(req, res);
  const isLoggedIn = await isAuthenticated();

  const translateProps = await serverSideTranslations(locale ?? "en", [
    "common",
  ]);

  if (!isLoggedIn) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `/api/auth/login?post_login_redirect_url=${encodeURIComponent(
          "/patients"
        )}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
