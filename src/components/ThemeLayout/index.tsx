"use client";

import Header from "@components/header";
import OrganizationSwitcher from "@components/header/OrganizationSwitcher";
import { ThemedLayout as ThemedLayout2 } from "@refinedev/antd";
import React from "react";

export const ThemedLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayout2
      Header={() => <Header />}
      Title={({ collapsed }) => (
        <div
          className="hidden lg:block"
          style={collapsed ? { transform: "translateX(175px)" } : {}}
        >
          <OrganizationSwitcher />
        </div>
      )}
    >
      {children}
    </ThemedLayout2>
  );
};
