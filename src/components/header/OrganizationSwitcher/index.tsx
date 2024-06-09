"use client";

import { Button, Dropdown, MenuProps, Space } from "antd";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { DownOutlined } from "@ant-design/icons";
import { IAccessToken, IIdToken } from "@types";
import { usePathname } from "next/navigation";

export default function OrganizationSwitcher() {
  const { accessToken, idToken } = useKindeBrowserClient();
  const organizations = (idToken as IIdToken)?.["x-hasura-organizations"] || [];
  const withHasuraAccessToken = accessToken as IAccessToken;
  const pathname = usePathname();

  const menuItems: MenuProps["items"] = organizations.map(({ id, name }) => ({
    key: id,
    label: (
      <LoginLink orgCode={id} postLoginRedirectURL={pathname}>
        {name}
      </LoginLink>
    )
  }));

  if (!withHasuraAccessToken?.["x-hasura-org-code"]) {
    return null;
  }

  return (
    <Dropdown
      menu={{
        items: menuItems,
        selectedKeys: [withHasuraAccessToken?.["x-hasura-org-code"]]
      }}
    >
      <Button type="text">
        <Space>
          <span className="font-medium">
            {
              organizations.find(
                ({ id }) => id === withHasuraAccessToken?.["x-hasura-org-code"]
              )?.name
            }
          </span>
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
