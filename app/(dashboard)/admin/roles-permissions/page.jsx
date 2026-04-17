"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/dashboard/PageLayout/PageLayout";
import { PermissionCrossBadge, PermissionTickBadge} from "@/components/helpers";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/axios";
import {PERMISSION_MATRIX_ROLE_ORDER, ROLE_LABELS} from "@/lib/helpers";

export default function RolesPermissionsPage() {
  const [matrix, setMatrix] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(null);

  const loadMatrix = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get("/api/admin/role-permissions");
      setMatrix(res.data.matrix || []);
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatrix();
  }, [loadMatrix]);

  const handleToggle = async (roleName, permissionKey, nextEnabled) => {
    const saveId = `${roleName}:${permissionKey}`;
    setSavingKey(saveId);
    try {
      const { data: res } = await api.patch("/api/admin/role-permissions", {
        roleName,
        permissionKey,
        enabled: nextEnabled,
      });
      toast.success(res.message);
      setMatrix((prev) =>
        prev.map((row) => {
          if (row.key !== permissionKey) return row;
          const cell = row.roles[roleName];
          if (!cell || cell.kind !== "toggle") return row;
          return {
            ...row,
            roles: {
              ...row.roles,
              [roleName]: { ...cell, enabled: nextEnabled },
            },
          };
        })
      );
    } catch {
      await loadMatrix();
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="min-w-0 w-full max-w-full space-y-5">
      <PageHeader
        title="Role & Permissions"
        description="Manage system roles and permissions"
      />

      <div className="min-w-0 w-full max-w-full overflow-x-auto overscroll-x-contain rounded-lg border border-border [scrollbar-width:thin]">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr style={{ backgroundColor: "#F9FAFB" }}>
              <th className="px-4 py-3 text-sm font-medium uppercase text-foreground-light whitespace-nowrap">
                Feature
              </th>
              {PERMISSION_MATRIX_ROLE_ORDER.map((roleName) => (
                <th
                  key={roleName}
                  className="px-4 py-3 text-center text-sm font-medium uppercase text-foreground-light whitespace-nowrap"
                >
                  {ROLE_LABELS[roleName] || roleName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {loading ? (
              <tr>
                <td
                  colSpan={PERMISSION_MATRIX_ROLE_ORDER.length + 1}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            ) : matrix.length === 0 ? (
              <tr>
                <td
                  colSpan={PERMISSION_MATRIX_ROLE_ORDER.length + 1}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No data.
                </td>
              </tr>
            ) : (
              matrix.map((row) => (
                <tr key={row.key} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-normal text-foreground">
                    {row.label}
                  </td>
                  {PERMISSION_MATRIX_ROLE_ORDER.map((roleName) => (
                    <td key={roleName} className="px-4 py-3 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {roleName === "admin" ? (
                          row.admin === "tick" ? (
                            <PermissionTickBadge />
                          ) : (
                            <PermissionCrossBadge />
                          )
                        ) : row.roles[roleName]?.kind === "toggle" ? (
                          <Switch
                            checked={row.roles[roleName].enabled}
                            disabled={ savingKey === `${roleName}:${row.key}`}
                            onCheckedChange={(next) => handleToggle(roleName, row.key, next)}
                            aria-label={`${ROLE_LABELS[roleName] || roleName}: ${row.label}`}
                          />
                        ) : (
                          <PermissionCrossBadge />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
