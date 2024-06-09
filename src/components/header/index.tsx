"use client";

import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Avatar,
  Layout as AntdLayout,
  Space,
  Switch,
  theme,
  Typography
} from "antd";
import React, { useContext } from "react";
import LanguageChanger from "./LanguageChanger";
import { ColorModeContext } from "@contexts/ColorMode";
import OrganizationSwitcher from "./OrganizationSwitcher";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({ sticky }) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header
      style={headerStyles}
      className={`h-16 py-6	 justify-between items-center flex`}
    >
      <div className="lg:hidden">
        <OrganizationSwitcher />
      </div>
      <div className="hidden lg:block" />

      <Space className="sm:!flex justify-end items-center !hidden">
        <LanguageChanger />
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        {(user?.name || user?.avatar) && (
          <Space style={{ marginLeft: "8px" }} size="middle">
            {user?.name && <Text>{user.name}</Text>}
            {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
          </Space>
        )}
      </Space>
    </AntdLayout.Header>
  );
};

export default Header;
