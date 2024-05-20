"use client";

import { useTranslation } from "react-i18next";
import { Avatar, Button, Dropdown, MenuProps, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import i18nConfig from "@i18n/i18nConfig";

export default function LanguageChanger() {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const currentPathname = usePathname();

  const menuItems: MenuProps["items"] = [...(i18nConfig.locales || [])]
    .sort()
    .map((lang: string) => ({
      key: lang,
      icon: (
        <span style={{ marginRight: 8 }}>
          <Avatar size={16} src={`/images/flags/${lang}.svg`} />
        </span>
      ),
      label: (
        <Link
          href={`/${lang}${currentPathname.replace(`/${currentLocale}`, "")}`}
          locale={lang}
        >
          {lang === i18nConfig.defaultLocale ? "Français" : "Anglais"}
        </Link>
      )
    }));

  return (
    <Dropdown
      menu={{
        items: menuItems,
        selectedKeys: currentLocale ? [currentLocale] : []
      }}
    >
      <Button type="text">
        <Space>
          <Avatar size={16} src={`/images/flags/${currentLocale}.svg`} />
          {currentLocale === i18nConfig.defaultLocale ? "Français" : "Anglais"}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
}
