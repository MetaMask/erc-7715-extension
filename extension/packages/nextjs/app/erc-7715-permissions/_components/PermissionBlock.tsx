"use client";

import React from "react";
import { RequestExecutionPermissionsReturnType } from "@metamask/smart-accounts-kit/actions";

interface PermissionsListProps {
  permission: RequestExecutionPermissionsReturnType;
}

export const PermissionBlock: React.FC<PermissionsListProps> = ({ permission }) => {
  return (
    <pre className="bg-base-200 text-base-content p-4 rounded overflow-auto text-sm font-mono h-64 border border-base-300">
      {JSON.stringify(permission, null, 2)}
    </pre>
  );
};
