"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadFormsDataById } from "@/Api/Form/Load";

type FormRecord = {
  _id: string;
  name?: string;
  fields?: Array<{ label?: string; name?: string; type?: string }>;
};

export default function FormSubmissionsPage() {
  const params = useParams<{ id: string }>();
  const formId = params?.id || "";
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormRecord | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const response = await loadFormsDataById(formId);
      setForm(response?.ok ? response?.data?.data || response?.data || null : null);
      setLoading(false);
    };
    if (formId) load();
  }, [formId]);

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link href="/cms/forms">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to forms
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{form?.name || "Form Submissions"}</CardTitle>
          <CardDescription>Submission inbox for this form.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading submissions...</p>
          ) : (
            <div className="text-sm text-muted-foreground space-y-3">
              <p className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                No submissions are stored yet for this form.
              </p>
              <p>
                Form ID: <span className="font-mono">{formId}</span>
              </p>
              {Array.isArray(form?.fields) && form.fields.length > 0 && (
                <div>
                  <p className="font-medium text-foreground mb-2">Form fields</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {form.fields.map((field, idx) => (
                      <li key={`${field.name || field.label || "field"}-${idx}`}>
                        {field.label || field.name || "Unnamed"} ({field.type || "text"})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
