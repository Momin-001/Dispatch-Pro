"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Download,
  Eye,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import api from "@/lib/axios";
import { Card } from "@/components/ui/card";
import { getDownloadUrl, DocStatusBadge } from "@/components/dashboard/Applications/application-helpers";

function InfoRow({ label, value }) {
  return (
    <Card className="flex flex-row items-center rounded-xs justify-between px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
    </Card>
  );
}

function InfoSection({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

/**
 * @param {string}   pageTitle       – e.g. "Driver Detail Page"
 * @param {string}   idPrefix        – e.g. "DRIV-APP"
 * @param {string}   roleSlug        – e.g. "driver"
 * @param {string}   userId          – the user's UUID
 * @param {Array}    infoSections    – [{ title, fields: [{ label, valueKey, render? }] }]
 * @param {string}   backHref        – link back to listing
 */
export function ApplicationDetail({
  pageTitle,
  idPrefix,
  roleSlug,
  userId,
  infoSections,
  backHref,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [pendingStatusAction, setPendingStatusAction] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [reuploadDialogOpen, setReuploadDialogOpen] = useState(false);
  const [reuploadDocId, setReuploadDocId] = useState(null);
  const [reuploadNote, setReuploadNote] = useState("");
  const [reuploadLoading, setReuploadLoading] = useState(false);

  const [requestDocDialogOpen, setRequestDocDialogOpen] = useState(false);
  const [requestDocName, setRequestDocName] = useState("");
  const [requestDocLoading, setRequestDocLoading] = useState(false);

  const [approvingDocId, setApprovingDocId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const { data: res } = await api.get(`/api/admin/applications/${roleSlug}/${userId}`);
      setUser(res.data.user);
      setDocuments(res.data.documents);
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, [roleSlug, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGlobalStatus = async () => {
    if (!pendingStatusAction) return;
    setStatusLoading(true);
    try {
      const { data: res } = await api.patch("/api/admin/applications/status", {
        userId,
        action: pendingStatusAction,
      });
      toast.success(res.message);
      setStatusDialogOpen(false);
      setPendingStatusAction(null);
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setStatusLoading(false);
    }
  };

  const handleApproveDoc = async (docId) => {
    setApprovingDocId(docId);
    try {
      const { data: res } = await api.patch("/api/admin/applications/documents", {
        documentId: docId,
        action: "approved",
      });
      toast.success(res.message);
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setApprovingDocId(null);
    }
  };

  const handleReuploadRequest = async () => {
    if (!reuploadDocId) return;
    setReuploadLoading(true);
    try {
      const { data: res } = await api.patch("/api/admin/applications/documents", {
        documentId: reuploadDocId,
        action: "reupload_requested",
        adminNote: reuploadNote.trim() || undefined,
      });
      toast.success(res.message);
      setReuploadDialogOpen(false);
      setReuploadDocId(null);
      setReuploadNote("");
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setReuploadLoading(false);
    }
  };

  const handleRequestDoc = async () => {
    if (!requestDocName.trim()) return;
    setRequestDocLoading(true);
    try {
      const { data: res } = await api.post("/api/admin/applications/documents", {
        userId,
        documentName: requestDocName.trim(),
      });
      toast.success(res.message);
      setRequestDocDialogOpen(false);
      setRequestDocName("");
      await fetchData();
    } catch {
      /* axios interceptor */
    } finally {
      setRequestDocLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-sm text-muted-foreground">Application not found.</p>;
  }

  const shortId = user.id.split("-")[0].toUpperCase();
  const fullAddress = [user.address, user.city, user.state].filter(Boolean).join(", ");

  const resolvedSections = infoSections.map((section) => ({
    ...section,
    fields: section.fields.map((f) => ({
      ...f,
      value: f.render ? f.render(user, fullAddress) : user[f.valueKey] || "—",
    })),
  }));

  return (
    <div className="min-w-0 w-full max-w-full space-y-6">
      {/* Back + Header */}
      <div>
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Applications
        </button>
        <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-sm font-semibold text-primary-dark">{idPrefix}-{shortId}</p>
        <p className="text-sm text-muted-foreground">{user.fullName}</p>
      </div>

      {/* Info Sections — 2-column grid on md+ */}
      <div className="grid gap-6 md:grid-cols-2">
        {resolvedSections.map((section) => (
          <InfoSection key={section.title} title={section.title}>
            {section.fields.map((f) => (
              <InfoRow key={f.label} label={f.label} value={f.value} />
            ))}
          </InfoSection>
        ))}
      </div>

      {/* Documents */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">Uploaded Documents</h3>
        <div className="space-y-2">
          {documents.map((doc, idx) => {
            const hasFile = doc.uploaded && doc.uploaded.fileUrl;
            const docKey = doc.uploaded?.id || `doc-${idx}`;
            return (
              <div
                key={docKey}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <FileText className="size-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {doc.name}
                      {doc.isOther && (
                        <span className="ml-1.5 text-xs text-muted-foreground">(Requested)</span>
                      )}
                    </p>
                    {doc.uploaded && <DocStatusBadge status={doc.uploaded.status} />}
                    {doc.uploaded?.adminNote && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Note: {doc.uploaded.adminNote}
                      </p>
                    )}
                    {!hasFile && (
                      <p className="mt-0.5 text-xs text-muted-foreground">Not uploaded yet</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {hasFile && (
                    <>
                      <a
                        href={getDownloadUrl(doc.uploaded.fileUrl)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        <Download className="size-3.5" />
                        Download
                      </a>
                      <a
                        href={doc.uploaded.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        <Eye className="size-3.5" />
                        View
                      </a>
                    </>
                  )}

                  {hasFile && doc.uploaded.status !== "approved" && (
                    <Button
                      variant="light"
                      size="rounded"
                      disabled={approvingDocId === doc.uploaded.id}
                      onClick={() => handleApproveDoc(doc.uploaded.id)}
                    >
                      {approvingDocId === doc.uploaded.id && (
                        <Loader2 className="mr-1 size-3.5 animate-spin" />
                      )}
                      Approve
                    </Button>
                  )}

                  {hasFile && doc.uploaded.status !== "approved" && (
                    <Button
                      variant="info"
                      size="rounded"
                      onClick={() => {
                        setReuploadDocId(doc.uploaded.id);
                        setReuploadNote("");
                        setReuploadDialogOpen(true);
                      }}
                    >
                      Request Re-upload
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global action buttons */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        {user.status !== "approved" && user.status !== "rejected" && (
          <>
            <Button
              variant="light"
              size="rounded-lg"
              onClick={() => {
                setPendingStatusAction("approved");
                setStatusDialogOpen(true);
              }}
            >
              Approve Application
            </Button>
            <Button
              variant="destructive"
              size="rounded-lg"
              onClick={() => {
                setPendingStatusAction("rejected");
                setStatusDialogOpen(true);
              }}
            >
              Reject Application
            </Button>

            <Button
              variant="info"
              size="rounded-lg"
              onClick={() => {
                setRequestDocName("");
                setRequestDocDialogOpen(true);
              }}
            >
              Request More Info
            </Button>
          </>
        )}
      </div>

      {/* ---- Dialogs ---- */}

      {/* Approve / Reject global */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatusAction === "approved" ? "Approve" : "Reject"} this application?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatusAction === "approved"
                ? "This will approve the user and all their documents. They will gain full system access."
                : "This will reject the user and all their documents. They will lose access."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={statusLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={pendingStatusAction === "approved" ? "light" : "destructive"}
              disabled={statusLoading}
              onClick={(e) => { e.preventDefault(); handleGlobalStatus(); }}
            >
              {statusLoading && <Loader2 className="mr-1 size-4 animate-spin" />}
              {pendingStatusAction === "approved" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Request re-upload dialog */}
      <AlertDialog open={reuploadDialogOpen} onOpenChange={setReuploadDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Re-upload</AlertDialogTitle>
            <AlertDialogDescription>
              Add an optional note for the applicant explaining why a re-upload is needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1">
            <Input
              value={reuploadNote}
              onChange={(e) => setReuploadNote(e.target.value)}
              placeholder="e.g. Document is blurry, please re-upload"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={reuploadLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="info"
              disabled={reuploadLoading}
              onClick={(e) => { e.preventDefault(); handleReuploadRequest(); }}
            >
              {reuploadLoading && <Loader2 className="mr-1 size-4 animate-spin" />}
              Send Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Request more info / extra document dialog */}
      <AlertDialog open={requestDocDialogOpen} onOpenChange={setRequestDocDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Additional Document</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the name of the document you want the applicant to upload. It will appear on their verification panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1">
            <Input
              value={requestDocName}
              onChange={(e) => setRequestDocName(e.target.value)}
              placeholder="e.g. Proof of Address, Background Check"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={requestDocLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="info"
              disabled={requestDocLoading || !requestDocName.trim()}
              onClick={(e) => { e.preventDefault(); handleRequestDoc(); }}
            >
              {requestDocLoading && <Loader2 className="mr-1 size-4 animate-spin" />}
              Request Document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
