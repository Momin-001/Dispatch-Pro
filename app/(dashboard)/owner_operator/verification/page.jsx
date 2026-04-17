"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import {
  SectionCard,
  ReadOnlyField,
  EditableFieldLabel,
  DocumentsSection,
  documentRowKey,
} from "@/components/verification-helpers";

const currentYear = new Date().getFullYear();

function validateYear(v) {
  if (!v) return true;
  if (!/^\d{1,4}$/.test(v)) return "Year must be up to 4 digits";
  const n = Number(v);
  if (n > currentYear) return `Year cannot exceed ${currentYear}`;
  return true;
}

function validateFutureDate(v) {
  if (!v) return true;
  const selected = new Date(v);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected <= today) return "Date must be in the future";
  return true;
}

export default function OwnerOperatorVerificationPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploadingDocId, setUploadingDocId] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm();

  const fetchData = useCallback(async () => {
    try {
      const { data } = await api.get("/api/verification");
      setProfile(data.data.user);
      setDocuments(data.data.documents);
      reset({
        fullName: data.data.user.fullName || "",
        phone: data.data.user.phone || "",
        equipmentType: data.data.user.equipmentType || "",
        vehicleYear: data.data.user.vehicleYear || "",
        registrationNumber: data.data.user.registrationNumber || "",
        vinNumber: data.data.user.vinNumber || "",
        insuranceExpiry: data.data.user.insuranceExpiry || "",
        inspectionExpiry: data.data.user.inspectionExpiry || "",
        address: data.data.user.address || "",
        city: data.data.user.city || "",
        state: data.data.user.state || "",
      });
    } catch {
      /* axios interceptor */
    } finally {
      setLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSaveProfile = async (values) => {
    try {
      const { data } = await api.patch("/api/verification", values);
      toast.success(data.message);
      await fetchData();
    } catch {
      /* axios interceptor */
    }
  };

  const handleDocUpload = async (doc, file) => {
    setUploadingDocId(documentRowKey(doc));
    try {
      const fd = new FormData();
      if (doc.userDocumentId) {
        fd.append("documentId", doc.userDocumentId);
      } else {
        fd.append("docTypeId", String(doc.docTypeId));
      }
      fd.append("file", file);
      const { data } = await api.post("/api/verification/documents", fd);
      toast.success(data.message);
      await fetchData();
    } catch (err) {
      throw err;
    } finally {
      setUploadingDocId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Unable to load verification data.
      </p>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="2xl:text-3xl text-2xl font-semibold text-foreground">Owner-Operator Verification</h1>
        <p className="mt-1 2xl:text-lg lg:text-base text-muted-foreground">
          Complete your profile and upload required documents for approval.
        </p>
      </div>

      <SectionCard title="Personal Information">
        <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="Full Name" />
              <Input placeholder="Full Name" {...register("fullName")} />
            </div>
            <div>
              <EditableFieldLabel label="Phone" />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    international
                    defaultCountry="US"
                    countryCallingCodeEditable={false}
                    className="phone-input-wrapper flex h-10 w-full items-center rounded-lg border border-input bg-transparent px-2 text-sm shadow-xs"
                    inputComponent={Input}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          <ReadOnlyField label="Email" value={profile.email} />

          <div>
            <EditableFieldLabel label="Address" />
            <Input placeholder="Street address" {...register("address")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="City" />
              <Input placeholder="City" {...register("city")} />
            </div>
            <div>
              <EditableFieldLabel label="State" />
              <Input placeholder="State" {...register("state")} />
            </div>
          </div>

          {/* Vehicle Information */}
          <p className="pt-2 text-sm font-semibold text-foreground">Vehicle Information</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="Equipment Type" />
              <Input placeholder="e.g. Dry Van, Reefer" {...register("equipmentType")} />
            </div>
            <div>
              <EditableFieldLabel label="Vehicle Year" />
              <Input
                inputMode="numeric"
                maxLength={4}
                placeholder={`e.g. ${currentYear}`}
                aria-invalid={!!errors.vehicleYear}
                {...register("vehicleYear", { validate: validateYear })}
              />
              {errors.vehicleYear && (
                <p className="mt-1 text-xs text-destructive">{errors.vehicleYear.message}</p>
              )}
            </div>
          </div>

          <div>
            <EditableFieldLabel label="Registration Number" />
            <Input placeholder="e.g. 1234567890" {...register("registrationNumber")} />
          </div>

          <div>
            <EditableFieldLabel label="VIN Number" />
            <Input placeholder="e.g. 1HGCM82633A004352" {...register("vinNumber")} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="Insurance Expiry" />
              <Input
                type="date"
                aria-invalid={!!errors.insuranceExpiry}
                {...register("insuranceExpiry", { validate: validateFutureDate })}
              />
              {errors.insuranceExpiry && (
                <p className="mt-1 text-xs text-destructive">{errors.insuranceExpiry.message}</p>
              )}
            </div>
            <div>
              <EditableFieldLabel label="Inspection Expiry" />
              <Input
                type="date"
                aria-invalid={!!errors.inspectionExpiry}
                {...register("inspectionExpiry", { validate: validateFutureDate })}
              />
              {errors.inspectionExpiry && (
                <p className="mt-1 text-xs text-destructive">{errors.inspectionExpiry.message}</p>
              )}
            </div>
          </div>

          {isDirty && (
            <div className="flex justify-end">
              <Button variant="dark" size="lg" type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </SectionCard>

      <DocumentsSection documents={documents} onUpload={handleDocUpload} uploadingDocId={uploadingDocId} />
    </div>
  );
}
