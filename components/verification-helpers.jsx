"use client";

import { useState, useRef } from "react";
import {
  Loader2,
  Upload,
  Download,
  Eye,
  FileText,
  Plus,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDownloadUrl, DocStatusBadge } from "@/components/helpers";

export function SectionCard({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h2 className="mb-5 2xl:text-[22px] text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

export function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="mb-1 2xl:text-lg text-base font-medium text-foreground-light">{label}</p>
      <div className="flex h-10 items-center rounded-lg border border-input bg-muted/40 px-3 text-sm text-foreground">
        {value || "—"}
      </div>
    </div>
  );
}

export function EditableFieldLabel({ label }) {
  return (
    <p className="mb-1 2xl:text-lg text-base font-medium text-foreground-light">
      {label} <span className="text-primary">(Editable)</span>
    </p>
  );
}

export function DocumentRow({ doc, onUpload, uploading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const hasFile = Boolean(doc.uploaded?.fileUrl);
  const canReupload =
    doc.uploaded?.status === "rejected" || doc.uploaded?.status === "reupload_requested";
  const showPicker = !hasFile || canReupload;

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    try {
      await onUpload(doc, selectedFile);
      setSelectedFile(null);
    } catch {
      /* keep selected file for retry */
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50">
          <FileText className="size-4 text-red-500" />
        </div>
        <div>
          <p className="text-base text-foreground">
            {doc.name}
            {doc.isOther && (
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">(Requested)</span>
            )}
          </p>
          {doc.uploaded && <DocStatusBadge status={doc.uploaded.status} />}
          {doc.uploaded?.adminNote && (
            <p className="mt-1 text-xs text-muted-foreground">
              Admin note: {doc.uploaded.adminNote}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {hasFile && !uploading && (
          <>
            <a
              href={getDownloadUrl(doc.uploaded.fileUrl)}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:underline"
            >
              <Download className="size-3.5" />
              Download
            </a>
            <a
              href={doc.uploaded.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary-dark hover:underline"
            >
              <Eye className="size-3.5" />
              View
            </a>
          </>
        )}

        {showPicker && !selectedFile && (
          <>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="dark"
              size="lg"
              className="gap-1"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Plus className="size-3.5" />
              {hasFile ? "Re-upload" : "Add Document"}
            </Button>
          </>
        )}

        {selectedFile && (
          <div className="flex items-center gap-2">
            <span className="max-w-[140px] truncate text-xs text-muted-foreground">
              {selectedFile.name}
            </span>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="gap-1"
              onClick={() => setSelectedFile(null)}
              disabled={uploading}
            >
              <X className="size-3.5" />
              Clear
            </Button>
            <Button
              type="button"
              variant="dark"
              size="lg"
              className="gap-1"
              onClick={handleConfirmUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  Upload
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function documentRowKey(doc) {
  return doc.userDocumentId ?? `type-${doc.docTypeId}`;
}

export function DocumentsSection({ documents, onUpload, uploadingDocId }) {
  return (
    <SectionCard title="Uploaded Documents">
      {documents.length === 0 ? (
        <p className="text-sm text-muted-foreground">No documents required.</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {documents.map((doc) => (
            <DocumentRow
              key={documentRowKey(doc)}
              doc={doc}
              onUpload={onUpload}
              uploading={uploadingDocId === documentRowKey(doc)}
            />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
