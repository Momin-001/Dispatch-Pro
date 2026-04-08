import { relations } from "drizzle-orm";
import { roles } from "./roles.js";
import { permissions, rolePermissions } from "./permissions.js";
import { users } from "./users.js";
import { passwordSetupTokens } from "./tokens.js";
import { verificationDocumentTypes, userDocuments } from "./documents.js";

// --- Roles ---
export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  rolePermissions: many(rolePermissions),
  verificationDocumentTypes: many(verificationDocumentTypes),
}));

// --- Permissions ---
export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

// --- Users ---
export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  passwordSetupTokens: many(passwordSetupTokens),
  documents: many(userDocuments),
}));

// --- Tokens ---
export const passwordSetupTokensRelations = relations(passwordSetupTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordSetupTokens.userId],
    references: [users.id],
  }),
}));

// --- Documents ---
export const verificationDocumentTypesRelations = relations(verificationDocumentTypes, ({ one, many }) => ({
  role: one(roles, {
    fields: [verificationDocumentTypes.roleId],
    references: [roles.id],
  }),
  userDocuments: many(userDocuments),
}));

export const userDocumentsRelations = relations(userDocuments, ({ one }) => ({
  user: one(users, {
    fields: [userDocuments.userId],
    references: [users.id],
  }),
  documentType: one(verificationDocumentTypes, {
    fields: [userDocuments.docTypeId],
    references: [verificationDocumentTypes.id],
  }),
}));
