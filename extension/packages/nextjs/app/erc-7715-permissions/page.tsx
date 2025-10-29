"use client";

import React from "react";
import { SessionAccountProvider } from "./providers/SessionAccountProvider";
import { Steps } from "~~/app/erc-7715-permissions/_components/Steps";

export default function ERC7715PermissionsPage() {
  return (
    <SessionAccountProvider>
      <Steps />
    </SessionAccountProvider>
  );
}
