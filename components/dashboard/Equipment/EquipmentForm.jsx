"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  EQUIPMENT_CATEGORY_OPTIONS,
  EQUIPMENT_STATUS_OPTIONS,
} from "@/lib/helpers";

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1 block text-sm font-medium text-foreground">
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );
}

const EMPTY = {
  category: "system",
  ownerOperatorId: "",
  equipmentType: "",
  registrationNumber: "",
  vinNumber: "",
  insuranceExpiry: "",
  inspectionExpiry: "",
  vehicleYear: "",
  status: "active",
};

const equipmentSchema = z
  .object({
    category: z.enum(["system", "owner_operator"], {
      message: "Category is required.",
    }),
    ownerOperatorId: z.string().trim().optional().default(""),
    equipmentType: z.string().trim().min(1, "Equipment type is required.").max(200),
    registrationNumber: z.string().trim().min(1, "Registration number is required.").max(50),
    vinNumber: z.string().trim().min(1, "VIN number is required.").max(50),
    insuranceExpiry: z.string().trim().min(1, "Insurance expiry date is required."),
    inspectionExpiry: z.string().trim().min(1, "Inspection expiry date is required."),
    vehicleYear: z
      .string()
      .trim()
      .regex(/^\d{4}$/, "Vehicle year must be a 4-digit year."),
    status: z.enum(["active", "inactive"], { message: "Status is required." }),
  })
  .superRefine((val, ctx) => {
    if (val.category === "owner_operator" && !val.ownerOperatorId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Owner operator is required.",
        path: ["ownerOperatorId"],
      });
    }
  });

export function EquipmentForm({ initialEquipment = null, mode = "create" }) {
  const router = useRouter();

  const defaultValues = {
    ...EMPTY,
    ...(initialEquipment
      ? {
          category: initialEquipment.category || "system",
          ownerOperatorId: initialEquipment.ownerOperatorId || "",
          equipmentType: initialEquipment.equipmentType || "",
          registrationNumber: initialEquipment.registrationNumber || "",
          vinNumber: initialEquipment.vinNumber || "",
          insuranceExpiry: initialEquipment.insuranceExpiry
            ? String(initialEquipment.insuranceExpiry).slice(0, 10)
            : "",
          inspectionExpiry: initialEquipment.inspectionExpiry
            ? String(initialEquipment.inspectionExpiry).slice(0, 10)
            : "",
          vehicleYear: initialEquipment.vehicleYear || "",
          status: initialEquipment.status || "active",
        }
      : {}),
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(equipmentSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Owner-operators for combobox
  const [ownerOperators, setOwnerOperators] = useState([]);
  const [ooLoading, setOoLoading] = useState(false);
  const [ooOpen, setOoOpen] = useState(false);

  const category = watch("category");
  const ownerOperatorId = watch("ownerOperatorId");

  useEffect(() => {
    if (category !== "owner_operator") 
      return;
    let active = true;
    (async () => {
      setOoLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("role", "owner_operator");
        params.set("status", "active");
        const { data: res } = await api.get(`/api/admin/users?${params.toString()}`);
        if (!active) return;
        setOwnerOperators(res.data.users || []);
      } catch {
        /* axios interceptor */
      } finally {
        if (active) setOoLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [category]);

  // If category switches away from owner_operator, clear ownerOperatorId
  useEffect(() => {
    if (category !== "owner_operator" && ownerOperatorId) {
      setValue("ownerOperatorId", "", { shouldValidate: true, shouldDirty: true });
    }
  }, [category, ownerOperatorId, setValue]);

  const selectedOwnerOperator = useMemo(() => {
    if (!ownerOperatorId) return null;
    return ownerOperators.find((u) => u.id === ownerOperatorId) || null;
  }, [ownerOperators, ownerOperatorId]);

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        category: values.category,
        ownerOperatorId:
          values.category === "owner_operator" ? values.ownerOperatorId : null,
        equipmentType: values.equipmentType.trim(),
        registrationNumber: values.registrationNumber.trim(),
        vinNumber: values.vinNumber.trim(),
        insuranceExpiry: values.insuranceExpiry || null,
        inspectionExpiry: values.inspectionExpiry || null,
        vehicleYear: values.vehicleYear.trim(),
        status: values.status,
      };

      if (mode === "create") {
        const { data: res } = await api.post("/api/admin/equipment", payload);
        toast.success(res.message);
      } else {
        const { data: res } = await api.patch(
          `/api/admin/equipment/${initialEquipment.id}`,
          payload
        );
        toast.success(res.message);
      }
      router.push("/admin/equipment");
    } catch {
      /* axios interceptor */
    } finally {
      setSubmitting(false);
    }
  };

  const headerTitle =
    mode === "create" ? "Add Equipment" : "Edit Equipment";
  const headerDescription =
    mode === "create"
      ? "Register trucks/cars that will operate in the system."
      : "Update existing equipment details.";

  const submitLabel = mode === "create" ? "Create Equipment" : "Save Changes";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{headerTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{headerDescription}</p>
      </div>

      <Card className="p-5 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Equipment Information
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Category</FieldLabel>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                  <SelectTrigger className="w-full" aria-invalid={Boolean(errors.category)}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_CATEGORY_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.category.message)}</p>
            )}
          </div>

          {category === "owner_operator" && (
            <div>
              <FieldLabel required>Owner Operator</FieldLabel>
              <Popover open={ooOpen} onOpenChange={setOoOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between h-12"
                    disabled={ooLoading}
                  >
                    <span className={cn("truncate", !selectedOwnerOperator && "text-muted-foreground")}>
                      {selectedOwnerOperator
                        ? `${selectedOwnerOperator.fullName} (${selectedOwnerOperator.email})`
                        : ooLoading
                          ? "Loading…"
                          : "Select owner operator"}
                    </span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[420px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search owner operator..." />
                    <CommandList>
                      <CommandEmpty>No owner operator found.</CommandEmpty>
                      <CommandGroup>
                        {ownerOperators.map((u) => (
                          <CommandItem
                            key={u.id}
                            value={`${u.fullName} ${u.email}`}
                            onSelect={() => {
                              setValue("ownerOperatorId", u.id, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setOoOpen(false);
                              trigger("ownerOperatorId");
                            }}
                          >
                            <Check
                              className={cn(
                                "size-4",
                                ownerOperatorId === u.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="min-w-0">
                              <div className="truncate font-medium text-foreground">
                                {u.fullName}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {u.email}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.ownerOperatorId?.message && (
                <p className="mt-1 text-xs text-destructive">
                  {String(errors.ownerOperatorId.message)}
                </p>
              )}
            </div>
          )}

          <div>
            <FieldLabel required>Equipment Type</FieldLabel>
            <Input
              placeholder="Reefer"
              maxLength={200}
              aria-invalid={Boolean(errors.equipmentType)}
              {...register("equipmentType")}
            />
            {errors.equipmentType?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.equipmentType.message)}</p>
            )}
          </div>

          <div>
            <FieldLabel required>Registration Number</FieldLabel>
            <Input
              placeholder="ABC-123"
              maxLength={50}
              aria-invalid={Boolean(errors.registrationNumber)}
              {...register("registrationNumber")}
            />
            {errors.registrationNumber?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.registrationNumber.message)}</p>
            )}
          </div>

          <div>
            <FieldLabel required>VIN Number</FieldLabel>
            <Input
              placeholder="1HGBH41JXMN109186"
              maxLength={50}
              aria-invalid={Boolean(errors.vinNumber)}
              {...register("vinNumber")}
            />
            {errors.vinNumber?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.vinNumber.message)}</p>
            )}
          </div>

          <div>
            <FieldLabel required>Insurance Expiry Date</FieldLabel>
            <Input
              type="date"
              aria-invalid={Boolean(errors.insuranceExpiry)}
              {...register("insuranceExpiry")}
            />
            {errors.insuranceExpiry?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.insuranceExpiry.message)}</p>
            )}
          </div>

          <div>
            <FieldLabel required>Inspection Expiry</FieldLabel>
            <Input
              type="date"
              aria-invalid={Boolean(errors.inspectionExpiry)}
              {...register("inspectionExpiry")}
            />
            {errors.inspectionExpiry?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.inspectionExpiry.message)}</p>
            )}
          </div>

          <div>
            <FieldLabel required>Vehicle Year</FieldLabel>
            <Input
              inputMode="numeric"
              placeholder="2022"
              maxLength={4}
              aria-invalid={Boolean(errors.vehicleYear)}
              {...register("vehicleYear", {
                onChange: (e) => {
                  const next = String(e.target.value || "")
                    .replace(/[^\d]/g, "")
                    .slice(0, 4);
                  setValue("vehicleYear", next, {
                    shouldValidate: false,
                    shouldDirty: true,
                  });
                },
              })}
              value={watch("vehicleYear")}
            />
            {errors.vehicleYear?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.vehicleYear.message)}</p>
            )}
          </div>

          <div>
            <FieldLabel required>Status</FieldLabel>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                  <SelectTrigger className="w-full" aria-invalid={Boolean(errors.status)}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EQUIPMENT_STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status?.message && (
              <p className="mt-1 text-xs text-destructive">{String(errors.status.message)}</p>
            )}
          </div>
        </div>
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="dark"
          size="lg"
          disabled={submitting || isSubmitting}
          className="gap-2"
        >
          {(submitting || isSubmitting) && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </Button>

        <Button
          type="button"
          variant="secondary-dark"
          size="lg"
          disabled={submitting || isSubmitting}
          onClick={() => router.push("/admin/equipment")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

