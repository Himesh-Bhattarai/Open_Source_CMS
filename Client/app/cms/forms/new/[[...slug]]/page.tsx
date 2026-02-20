"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  EyeOff,
  Mail,
  Database,
  ExternalLink,
  AlertCircle,
  Globe,
  Building,
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { createForm, updateForm } from "@/Api/Form/Create";
import { loadFormsDataById } from "@/Api/Form/Load"; // Assuming this exists
import { useTenant } from "@/context/TenantContext";
import { toast } from "sonner";


// Extend FormField interface with advanced CMS features
interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  order: number;
  helperText?: string;
  defaultValue?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  options?: string[];
}

// Form behavior configuration
interface FormBehavior {
  storeSubmissions: boolean;
  notifyEmail?: string;
  redirectUrl?: string;
}

// Main form state interface
interface FormState {
  name: string;
  description: string;
  status: "draft" | "published";
  scope: "global";
  submitButtonText: string;
  successMessage: string;
  behavior: FormBehavior;
  fields: FormField[];
  metadata: {
    version: number;
  };
}

// Save lifecycle states
type SaveState = "idle" | "saving" | "success" | "error";

// Mock websites/tenants for selection
interface Website {
  id: string;
  name: string;
  domain: string;
}

export default function NewFormPage() {
  const router = useRouter();
  const params = useParams();

  const slug = params?.slug as string[] | undefined;

  // RULE:
  // /new           -> create
  // /new/:id       -> edit
  const formId = slug?.[0] && slug[0] !== "new" ? slug[0] : undefined;

  // const [mode] = useState<"create" | "edit">(() => {
  //   const hasId = slug && slug.length > 0 && slug[0] !== "new";
  //   return hasId ? "edit" : "create";
  // });

  const isEditMode = Boolean(formId)
  const [isLoading, setIsLoading] = useState(!!formId);
  const { tenants, activeTenant, setActiveTenant } = useTenant();
  // Map tenants to Website interface
  const tenantWebsites: Website[] = useMemo(
    () =>
      tenants.map((t) => ({
        id: t._id,
        name: t.name,
        domain: t.domain,
      })),
    [tenants]
  );

  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(
    activeTenant
      ? {
        id: activeTenant._id,
        name: activeTenant.name,
        domain: activeTenant.domain,
      }
      : null,
  );

  useEffect(() => {
    if (!activeTenant || isEditMode) return;
    setSelectedWebsite((prev) => {
      if (prev?.id === activeTenant._id) return prev;
      return {
        id: activeTenant._id,
        name: activeTenant.name,
        domain: activeTenant.domain,
      };
    });
  }, [activeTenant, isEditMode]);

  // Save website selection to localStorage
  useEffect(() => {
    if (selectedWebsite) {
      localStorage.setItem("cms_selectedWebsiteId", selectedWebsite.id);
    }
  }, [selectedWebsite]);

  // Centralized form state
  const [formState, setFormState] = useState<FormState>({
    name: "",
    description: "",
    status: "draft",
    scope: "global",
    submitButtonText: "Submit",
    successMessage: "Thank you for your submission!",
    behavior: {
      storeSubmissions: true,
      notifyEmail: "",
      redirectUrl: "",
    },
    fields: [
      {
        id: "1",
        type: "text",
        label: "Name",
        placeholder: "Enter your name",
        required: true,
        order: 0,
      },
      {
        id: "2",
        type: "email",
        label: "Email",
        placeholder: "your@email.com",
        required: true,
        order: 1,
      },
    ],
    metadata: {
      version: 1,
    },
  });

  // Save lifecycle state
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing form for edit mode
  useEffect(() => {
   
    if (!isEditMode || !formId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadExistingForm = async () => {
      try {
        setIsLoading(true);
        const response = await loadFormsDataById(formId);
        if (!cancelled && response?.ok && response.data) {
          const existingForm = response.data?.data || response.data;
          if (!existingForm) {
            throw new Error("Form not found");
          }

          setFormState({
            name: existingForm.name || "",
            description: existingForm.description || "",
            status: existingForm.status || "draft",
            scope: existingForm.scope || "global",
            submitButtonText: existingForm.submitButtonText || "Submit",
            successMessage:
              existingForm.successMessage || "Thank you for your submission!",
            behavior: {
              storeSubmissions:
                existingForm.behavior?.storeSubmissions ?? true,
              notifyEmail: existingForm.behavior?.notifyEmail || "",
              redirectUrl: existingForm.behavior?.redirectUrl || "",
            },
            fields:
              existingForm.fields?.map((field: any, index: number) => ({
                id: field.id || `field-${index}`,
                type: field.type || "text",
                label: field.label ?? "",
                placeholder: field.placeholder ?? "",
                required: Boolean(field.required),
                order: field.order ?? index,
                helperText: field.helperText ?? "",
                defaultValue: field.defaultValue ?? "",
                validation: field.validation || {},
                options: field.options || [],
              })) || [],
            metadata: {
              version: existingForm.metadata?.version || 1,
            },
          });

       
          if (existingForm.tenantId) {
            const website = tenantWebsites.find(
              (w) => w.id === existingForm.tenantId
            );
            if (website) {
              setSelectedWebsite(website);
            } else {
              setSelectedWebsite({
                id: existingForm.tenantId,
                name: `Website ${existingForm.tenantId}`,
                domain: "Unknown domain",
              });
            }
          }
        }
      } catch (err) {
        console.error("[CMS] Failed to load form", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadExistingForm();

    return () => {
      cancelled = true;
    };
  }, [isEditMode, formId, tenantWebsites]);

  // Update form state helper
  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      placeholder: "",
      required: false,
      order: formState.fields.length,
      helperText: "",
      defaultValue: "",
      validation: {},
    };

    setFormState((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const removeField = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      fields: prev.fields
        .filter((f) => f.id !== id)
        .map((f, index) => ({ ...f, order: index })),
    }));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormState((prev) => ({
      ...prev,
      fields: prev.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    }));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setFormState((prev) => {
      const newFields = [...prev.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);

      // Update order for all fields
      const reorderedFields = newFields.map((field, index) => ({
        ...field,
        order: index,
      }));

      return {
        ...prev,
        fields: reorderedFields,
      };
    });
  };

  const updateBehavior = (updates: Partial<FormBehavior>) => {
    setFormState((prev) => ({
      ...prev,
      behavior: { ...prev.behavior, ...updates },
    }));
  };


  // Field type badge colors
  const getFieldTypeBadge = (type: string) => {
    const types: Record<
      string,
      { label: string; variant: "default" | "secondary" | "outline" }
    > = {
      text: { label: "Text", variant: "default" },
      email: { label: "Email", variant: "secondary" },
      tel: { label: "Phone", variant: "secondary" },
      textarea: { label: "Text Area", variant: "outline" },
      select: { label: "Dropdown", variant: "outline" },
      checkbox: { label: "Checkbox", variant: "outline" },
    };
    return types[type] || { label: type, variant: "default" };
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!selectedWebsite?.id) {
      errors.push("Please select a website");
    }

    if (!formState.name.trim()) {
      errors.push("Form name is required");
    }

    if (formState.fields.length === 0) {
      errors.push("At least one form field is required");
    }

    const invalidLength = formState.fields.find((field) => {
      const min = field.validation?.minLength;
      const max = field.validation?.maxLength;
      return typeof min === "number" && typeof max === "number" && min > max;
    });
    if (invalidLength) {
      errors.push("Field min length cannot be greater than max length");
    }

    // Validate email notification if provided
    if (
      formState.behavior.notifyEmail &&
      !/\S+@\S+\.\S+/.test(formState.behavior.notifyEmail)
    ) {
      errors.push("Notification email is invalid");
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      setSaveError(errors.join(", "));
      setSaveState("error");
      toast.error(errors[0] || "Please fix form validation errors");
      return;
    }

    if (!selectedWebsite?.id) {
      setSaveError("Please select a website first");
      setSaveState("error");
      toast.error("Please select a website first");
      return;
    }

    setSaveState("saving");
    setSaveError(null);

    try {
      if (isEditMode && formId) {
        // Update existing form - include only editable fields and id
        const updatePayload = {

          name: formState.name,
          description: formState.description,
          status: formState.status,
          scope: formState.scope,
          submitButtonText: formState.submitButtonText,
          successMessage: formState.successMessage,
          behavior: formState.behavior,
          fields: formState.fields,
          metadata: {
            version: formState.metadata.version + 1, 
          },
        };

        const response = await updateForm(updatePayload, formId);
        if (!response?.ok) {
          throw new Error(response?.message || "Failed to update form");
        }
      } else {
        // Create new form
        const createPayload = {
          tenantId: selectedWebsite.id,
          name: formState.name,
          description: formState.description,
          status: formState.status,
          scope: "global",
          submitButtonText: formState.submitButtonText,
          successMessage: formState.successMessage,
          behavior: formState.behavior,
          fields: formState.fields,
          metadata: {
            version: formState.metadata.version,
          },
        };

        const response = await createForm(createPayload);
        if (!response?.ok) {
          throw new Error(response?.message || "Failed to create form");
        }
      }

      // Only show success and redirect after API success
      setSaveState("success");
      toast.success(isEditMode ? "Form updated successfully" : "Form created successfully");

      // Show success message for 1.5 seconds before redirect
      setTimeout(() => {
        router.push("/cms/forms");
      }, 1000);
    } catch (err) {
      console.error("[CMS] Failed to save form:", err);
      setSaveState("error");
      const message =
        err instanceof Error
          ? err.message
          : "Failed to save form. Please check your connection and try again.";
      setSaveError(message);
      toast.error(message);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Form" : "Create New Form"}
            </h1>
            {selectedWebsite && (
              <Badge variant="outline" className="gap-1.5">
                <Building className="h-3.5 w-3.5" />
                {selectedWebsite.name}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-2">
            {isEditMode
              ? "Edit your existing form"
              : "Build a custom form for your website"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saveState === "saving"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saveState === "saving" || !selectedWebsite}
            className="min-w-30"
          >
            {saveState === "saving" ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEditMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditMode ? "Update Form" : "Save Form"}
              </>
            )}
          </Button>
        </div>
      </div>

      {!selectedWebsite && (
        <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <div>
              <p className="text-amber-800 font-medium text-sm">
                Select a website
              </p>
              <p className="text-amber-700 text-sm">
                Choose which website this form belongs to. You can continue
                editing while we wait.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left column - Form Builder */}
        <div className="space-y-8 lg:col-span-2">
          <Tabs defaultValue="settings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="settings" className="py-2.5">
                Settings
              </TabsTrigger>
              <TabsTrigger value="behavior" className="py-2.5">
                Behavior
              </TabsTrigger>
              <TabsTrigger value="fields" className="py-2.5">
                Fields
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-6 pt-6">
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website & Form Settings
                  </CardTitle>
                  <CardDescription>
                    Configure where and how this form will be used
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Select Website *
                    </Label>
                    <Select
                      value={selectedWebsite?.id || ""}
                      onValueChange={(value) => {
                        const website = tenantWebsites.find(
                          (w) => w.id === value,
                        );
                        if (website) {
                          setSelectedWebsite(website);
                          setActiveTenant({
                            _id: website.id,
                            name: website.name,
                            domain: website.domain,
                          });
                        }
                      }}
                      disabled={isEditMode} // Disable website selection in edit mode
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a website..." />
                      </SelectTrigger>
                      <SelectContent>
                        {tenantWebsites.map((website) => (
                          <SelectItem key={website.id} value={website.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {website.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {website.domain}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {isEditMode && selectedWebsite && (
                      <p className="text-sm text-muted-foreground">
                        Website cannot be changed for existing forms
                      </p>
                    )}

                    {!selectedWebsite && (
                      <p className="text-sm text-amber-600">
                        <AlertCircle className="inline h-3 w-3 mr-1" />
                        Required to save form
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Form Name *</Label>
                    <Input
                      value={formState.name}
                      onChange={(e) =>
                        updateFormState({ name: e.target.value })
                      }
                      placeholder="Contact Form"
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Display name for this form (shown in CMS)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea
                      value={formState.description}
                      onChange={(e) =>
                        updateFormState({ description: e.target.value })
                      }
                      placeholder="Brief description of this form's purpose..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Status</Label>
                      <Select
                        value={formState.status}
                        onValueChange={(value: "draft" | "published") =>
                          updateFormState({ status: value })
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center gap-2.5">
                              <EyeOff className="h-3.5 w-3.5" />
                              <div className="flex flex-col">
                                <span>Draft</span>
                                <span className="text-xs text-muted-foreground">
                                  Not visible to visitors
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="published">
                            <div className="flex items-center gap-2.5">
                              <Eye className="h-3.5 w-3.5" />
                              <div className="flex flex-col">
                                <span>Published</span>
                                <span className="text-xs text-muted-foreground">
                                  Live on website
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Scope</Label>
                      <div className="relative">
                        <Input
                          value="Global"
                          disabled
                          className="h-11 bg-muted/50"
                        />
                        <Badge
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          variant="secondary"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          Website-wide
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Available across entire website
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Submit Button Text
                      </Label>
                      <Input
                        value={formState.submitButtonText}
                        onChange={(e) =>
                          updateFormState({ submitButtonText: e.target.value })
                        }
                        placeholder="Submit"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Success Message
                      </Label>
                      <Input
                        value={formState.successMessage}
                        onChange={(e) =>
                          updateFormState({ successMessage: e.target.value })
                        }
                        placeholder="Thank you for your submission!"
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="behavior" className="space-y-6 pt-6">
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Submission Behavior</CardTitle>
                  <CardDescription>
                    Configure what happens after form submission
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <Database className="h-5 w-5 text-muted-foreground" />
                        <Label className="text-base font-medium">
                          Store Submissions
                        </Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Save form submissions to the CMS database for later
                        review
                      </p>
                    </div>
                    <Switch
                      checked={formState.behavior.storeSubmissions}
                      onCheckedChange={(checked) =>
                        updateBehavior({ storeSubmissions: checked })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notification
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    </Label>
                    <Input
                      type="email"
                      value={formState.behavior.notifyEmail || ""}
                      onChange={(e) =>
                        updateBehavior({ notifyEmail: e.target.value })
                      }
                      placeholder="notify@example.com"
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Receive email notifications for new submissions. Leave
                      blank to disable.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Redirect After Submission
                      <Badge variant="outline" className="text-xs">
                        Optional
                      </Badge>
                    </Label>
                    <Input
                      value={formState.behavior.redirectUrl || ""}
                      onChange={(e) =>
                        updateBehavior({ redirectUrl: e.target.value })
                      }
                      placeholder="https://example.com/thank-you"
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      Redirect users to a custom URL after successful submission
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fields" className="space-y-6 pt-6">
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Form Fields</CardTitle>
                      <CardDescription>
                        {formState.fields.length} field
                        {formState.fields.length !== 1 ? "s" : ""} - Drag to
                        reorder
                      </CardDescription>
                    </div>
                    <Button onClick={addField} size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Field
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formState.fields
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                      <div
                        key={field.id}
                        className="p-5 border-2 rounded-xl space-y-4 bg-card hover:border-muted-foreground/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="cursor-grab active:cursor-grabbing p-2 hover:bg-accent rounded-md transition-colors"
                              onMouseDown={(e) => {
                                const moveHandler = (moveEvent: MouseEvent) => {
                                  moveEvent.preventDefault();
                                  if (moveEvent.button === 0) {
                                    const direction =
                                      moveEvent.movementY > 0 ? 1 : -1;
                                    const newIndex = Math.max(
                                      0,
                                      Math.min(
                                        formState.fields.length - 1,
                                        index + direction,
                                      ),
                                    );
                                    moveField(index, newIndex);
                                  }
                                };
                                document.addEventListener(
                                  "mousemove",
                                  moveHandler,
                                );
                                document.addEventListener(
                                  "mouseup",
                                  () => {
                                    document.removeEventListener(
                                      "mousemove",
                                      moveHandler,
                                    );
                                  },
                                  { once: true },
                                );
                              }}
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Badge
                              variant={getFieldTypeBadge(field.type).variant}
                              className="text-xs py-1 px-2.5"
                            >
                              {getFieldTypeBadge(field.type).label}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {field.label || `Field ${index + 1}`}
                              </span>
                              {field.required && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs py-0.5 px-2"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(field.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Field Type
                              </Label>
                              <Select
                                value={field.type}
                                onValueChange={(value) =>
                                  updateField(field.id, { type: value })
                                }
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="email">Email</SelectItem>
                                  <SelectItem value="tel">Phone</SelectItem>
                                  <SelectItem value="textarea">
                                    Textarea
                                  </SelectItem>
                                  <SelectItem value="select">
                                    Select Dropdown
                                  </SelectItem>
                                  <SelectItem value="checkbox">
                                    Checkbox
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Default Value
                              </Label>
                              <Input
                                value={field.defaultValue || ""}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    defaultValue: e.target.value,
                                  })
                                }
                                placeholder="Optional default value"
                                className="h-9"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Label
                              </Label>
                              <Input
                                value={field.label}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    label: e.target.value,
                                  })
                                }
                                placeholder="Field label"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-medium">
                                Placeholder Text
                              </Label>
                              <Input
                                value={field.placeholder}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    placeholder: e.target.value,
                                  })
                                }
                                placeholder="Placeholder text"
                                className="h-9"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-medium">
                              Help Text
                            </Label>
                            <Input
                              value={field.helperText || ""}
                              onChange={(e) =>
                                updateField(field.id, {
                                  helperText: e.target.value,
                                })
                              }
                              placeholder="Optional helper text shown below field"
                              className="h-9"
                            />
                          </div>

                          {(field.type === "select" ||
                            field.type === "checkbox") && (
                              <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                  Options (one per line)
                                </Label>
                                <Textarea
                                  value={field.options?.join("\n") || ""}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      options: e.target.value
                                        .split("\n")
                                        .filter((opt) => opt.trim()),
                                    })
                                  }
                                  placeholder="Option 1\nOption 2\nOption 3"
                                  rows={3}
                                  className="text-sm resize-none"
                                />
                              </div>
                            )}

                          <div className="pt-4 border-t space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium">
                                Field Settings
                              </Label>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <Label className="text-xs font-medium">
                                  Required
                                </Label>
                                <Switch
                                  checked={field.required}
                                  onCheckedChange={(checked) =>
                                    updateField(field.id, { required: checked })
                                  }
                                  className="scale-90"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                  Min Length
                                </Label>
                                <Input
                                  type="number"
                                  value={field.validation?.minLength ?? ""}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      validation: {
                                        ...field.validation,
                                        minLength: e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined,
                                      },
                                    })
                                  }
                                  placeholder="Min"
                                  min="0"
                                  className="h-9"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                  Max Length
                                </Label>
                                <Input
                                  type="number"
                                  value={field.validation?.maxLength ?? ""}
                                  onChange={(e) =>
                                    updateField(field.id, {
                                      validation: {
                                        ...field.validation,
                                        maxLength: e.target.value
                                          ? parseInt(e.target.value)
                                          : undefined,
                                      },
                                    })
                                  }
                                  placeholder="Max"
                                  min="1"
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {formState.fields.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                      <div className="mb-4 text-muted-foreground/60">
                        <Plus className="h-12 w-12 mx-auto" />
                      </div>
                      <p className="mb-3 font-medium">No fields added yet</p>
                      <p className="text-sm mb-4">
                        Add fields to build your form
                      </p>
                      <Button onClick={addField} variant="outline">
                        Add First Field
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right column - Preview */}
        {/* Right column - Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start lg:h-fit">
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Preview</CardTitle>
                <div className="flex items-center gap-2">
                  {isEditMode && (
                    <Badge variant="outline" className="text-xs">
                      Editing
                    </Badge>
                  )}
                  <Badge
                    variant={
                      formState.status === "published" ? "default" : "secondary"
                    }
                  >
                    {formState.status}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                How your form will appear on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5 p-6 border-2 rounded-lg bg-background">
                {formState.name && (
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{formState.name}</h3>
                    {formState.description && (
                      <p className="text-sm text-muted-foreground">
                        {formState.description}
                      </p>
                    )}
                  </div>
                )}

                {formState.fields
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <div key={field.id} className="space-y-2.5">
                      <Label className="flex items-center gap-1">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-0.5">*</span>
                        )}
                      </Label>
                      {field.helperText && (
                        <p className="text-xs text-muted-foreground">
                          {field.helperText}
                        </p>
                      )}
                      {field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          defaultValue={field.defaultValue}
                          className="min-h-25"
                        />
                      ) : field.type === "select" ? (
                        <Select defaultValue={field.defaultValue}>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                field.placeholder || "Select an option"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option, idx) => (
                              <SelectItem key={idx} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "checkbox" ? (
                        <div className="space-y-3">
                          {field.options?.map((option, idx) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="checkbox"
                                id={`preview-${field.id}-${idx}`}
                              />
                              <Label
                                htmlFor={`preview-${field.id}-${idx}`}
                                className="font-normal"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          defaultValue={field.defaultValue}
                        />
                      )}
                    </div>
                  ))}

                {formState.fields.length > 0 && (
                  <div className="pt-2">
                    <Button className="w-full h-11">
                      {formState.submitButtonText}
                    </Button>
                    {formState.behavior.redirectUrl && (
                      <div className="mt-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 text-sm">
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Will redirect to:</span>
                        </div>
                        <p className="text-xs text-blue-600 mt-1 truncate">
                          {formState.behavior.redirectUrl}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-4 border-2 rounded-lg">
                    <div className="font-medium">Fields</div>
                    <div className="text-2xl font-bold mt-1">
                      {formState.fields.length}
                    </div>
                  </div>
                  <div className="p-4 border-2 rounded-lg">
                    <div className="font-medium">Required</div>
                    <div className="text-2xl font-bold mt-1">
                      {formState.fields.filter((f) => f.required).length}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-2 rounded-lg bg-muted/30">
                  <div className="text-sm font-medium mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Submission Behavior
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Store submissions</span>
                      <Badge
                        variant={
                          formState.behavior.storeSubmissions
                            ? "default"
                            : "outline"
                        }
                      >
                        {formState.behavior.storeSubmissions ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {formState.behavior.notifyEmail && (
                      <div className="flex items-center justify-between">
                        <span>Email notifications</span>
                        <Badge
                          variant="secondary"
                          className="text-xs truncate max-w-35"
                        >
                          {formState.behavior.notifyEmail}
                        </Badge>
                      </div>
                    )}
                    {formState.behavior.redirectUrl && (
                      <div className="flex items-center justify-between">
                        <span>Redirect URL</span>
                        <Badge variant="outline" className="text-xs">
                          Set
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
