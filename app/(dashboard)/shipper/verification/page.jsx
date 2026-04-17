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

export default function ShipperVerificationPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploadingDocId, setUploadingDocId] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm();

  const fetchData = useCallback(async () => {
    try {
      const { data } = await api.get("/api/verification");
      setProfile(data.data.user);
      setDocuments(data.data.documents);
      reset({
        fullName: data.data.user.fullName || "",
        phone: data.data.user.phone || "",
        companyName: data.data.user.companyName || "",
        monthlyLoadEstimate: data.data.user.monthlyLoadEstimate || "",
        equipmentType: data.data.user.equipmentType || "",
        address: data.data.user.address || "",
        city: data.data.user.city || "",
        state: data.data.user.state || "",
        businessAddress: data.data.user.businessAddress || "",
        businessCity: data.data.user.businessCity || "",
        businessState: data.data.user.businessState || "",
        typicalRouteFrom: data.data.user.typicalRouteFrom || "",
        typicalRouteTo: data.data.user.typicalRouteTo || "",
        specialHandling: data.data.user.specialHandling || "",
        industry: data.data.user.industry || "",
        website: data.data.user.website || "",
        companySize: data.data.user.companySize || "",
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
        <h1 className="2xl:text-3xl text-2xl font-semibold text-foreground">Shipper Verification</h1>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <ReadOnlyField label="Email" value={profile.email} />
            <div>
              <EditableFieldLabel label="Company Name" />
              <Input placeholder="Company name" {...register("companyName")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="Average Monthly Loads" />
              <Input inputMode="numeric" placeholder="e.g. 50" {...register("monthlyLoadEstimate")} />
            </div>
            <div>
              <EditableFieldLabel label="Equipment Type" />
              <Input placeholder="e.g. Dry Van, Reefer, Flatbed" {...register("equipmentType")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="Industry" />
              <Input placeholder="e.g. Manufacturing" {...register("industry")} />
            </div>
            <div>
              <EditableFieldLabel label="Company Size" />
              <Input inputMode="numeric" placeholder="e.g. 120" {...register("companySize")} />
            </div>
          </div>

          <div>
            <EditableFieldLabel label="Website" />
            <Input type="url" placeholder="e.g. www.example.com" {...register("website")} />
          </div>

          {/* Personal Address */}
          <p className="pt-2 text-sm font-semibold text-foreground">Personal Address</p>
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

          {/* Business Address */}
          <p className="pt-2 text-sm font-semibold text-foreground">Business Address</p>
          <div>
            <EditableFieldLabel label="Business Address" />
            <Input placeholder="Business street address" {...register("businessAddress")} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="Business City" />
              <Input placeholder="City" {...register("businessCity")} />
            </div>
            <div>
              <EditableFieldLabel label="Business State" />
              <Input placeholder="State" {...register("businessState")} />
            </div>
          </div>

          {/* Routes & Handling */}
          <p className="pt-2 text-sm font-semibold text-foreground">Shipping Details</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <EditableFieldLabel label="Typical Route From" />
              <Input placeholder="e.g. CA" {...register("typicalRouteFrom")} />
            </div>
            <div>
              <EditableFieldLabel label="Typical Route To" />
              <Input placeholder="e.g. TX" {...register("typicalRouteTo")} />
            </div>
          </div>

          <div>
            <EditableFieldLabel label="Special Handling" />
            <Input placeholder="e.g. Fragile electronics" {...register("specialHandling")} />
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
