"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FormInput, Plus, Eye, Edit, Trash2, FileText, CheckSquare } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { loadFormsData } from "@/Api/Form/Load"


interface Form{
  _id: string,
  name: string,
  status: string,
  type: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  fields: string[],
  fieldsRequired: string[],
  fieldsOptional: string[],
  fieldsHidden: string[],
  fieldsDisabled: string[],
  fieldsReadonly: string[],


  fieldsCount: number,
  submissions: number,
  lastSubmission: string
}
export default function FormsPage() {
  // const forms = [
  //   {
  //     id: 1,
  //     name: "Contact Form",
  //     type: "contact",
  //     submissions: 45,
  //     status: "published",
  //     lastSubmission: "2 hours ago",
  //     fields: 5,
  //   },
  //   {
  //     id: 2,
  //     name: "Newsletter Signup",
  //     type: "newsletter",
  //     submissions: 234,
  //     status: "published",
  //     lastSubmission: "10 minutes ago",
  //     fields: 2,
  //   },
  //   {
  //     id: 3,
  //     name: "Job Application",
  //     type: "application",
  //     submissions: 12,
  //     status: "draft",
  //     lastSubmission: "Never",
  //     fields: 8,
  //   },
  // ]

  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState([]);

  //load forms data
  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true);
        const response = await loadFormsData();
        console.log("Forms Data", response);

        if (!response?.ok) {
          throw new Error("Failed to load forms");
        }

        // 🔥 Normalize here
        const normalizedForms = response.data.map((form:Form) => ({
          _id: form._id,
          name: form.name,
          status: form.status,
          fieldsCount: form.fields?.length ?? 0,
          submissions: 0, // placeholder
          lastSubmission: "Never", // placeholder
        }));

        setForms(normalizedForms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground mt-2">Build and manage custom forms</p>
        </div>
        <Button asChild>
          <Link href="/cms/forms/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Forms</CardTitle>
            <FormInput className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">291</div>
            <p className="text-xs text-muted-foreground mt-1">+18 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground mt-1">Above average</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
          <CardDescription>Manage your custom forms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forms.map((form : Form) => (
              <div
                key={form._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FormInput className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-medium">{form.name}</h3>
                      <Badge variant={form.status === "published" ? "default" : "secondary"}>{form.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {form.fieldsCount} fields • {form.submissions} submissions
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      Last submission: {form.lastSubmission}
                    </p>

                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cms/forms/${form?._id}/submissions`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cms/forms/${form._id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
