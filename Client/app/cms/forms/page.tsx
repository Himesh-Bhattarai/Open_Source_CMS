"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FormInput, Plus, Eye, Edit, Trash2, FileText, CheckSquare } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { loadFormsData } from "@/Api/Form/Load"
import { deleteFormById } from "@/Api/Form/Delete"

interface Form {
  _id: string
  name: string
  status: string
  type: string
  description: string
  createdAt: string
  updatedAt: string
  fields: string[]
  fieldsRequired: string[]
  fieldsOptional: string[]
  fieldsHidden: string[]
  fieldsDisabled: string[]
  fieldsReadonly: string[]
  fieldsCount: number
  submissions: number
  lastSubmission: string
}

export default function FormsPage() {
  const [loading, setLoading] = useState(false)
  const [forms, setForms] = useState<Form[]>([])
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    const loadForms = async () => {
      try {
        setLoading(true)
        const response = await loadFormsData()

        if (!response?.ok) {
          throw new Error(response?.message || "Failed to load forms")
        }

        const rawForms = Array.isArray(response.data) ? response.data : []
        const normalizedForms = rawForms.map((form: Form) => ({
          _id: form._id,
          name: form.name,
          status: form.status,
          fieldsCount: form.fields?.length ?? 0,
          submissions: 0,
          lastSubmission: "Never",
        }))

        setForms(normalizedForms)
      } catch (err) {
        console.error(err)
        setMessageType("error")
        setMessage("Failed to load forms")
      } finally {
        setLoading(false)
      }
    }

    loadForms()
  }, [])

  const handelDelete = async (formId: string) => {
    setLoading(true)

    try {
      const response = await deleteFormById(formId)
      if (response.ok) {
        setMessageType("success")
        setMessage("Form deleted successfully")
        setForms((prevForms) => prevForms.filter((form) => form._id !== formId))
      } else {
        setMessageType("error")
        setMessage("Failed to delete form")
      }
    } catch {
      setMessageType("error")
      setMessage("Failed to delete form")
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(""), 2500)
    }
  }

  const publishedCount = forms.filter((form) => form.status === "published").length
  const totalSubmissions = forms.reduce((acc, form) => acc + (form.submissions || 0), 0)
  const conversionRate = forms.length > 0 ? Math.round((publishedCount / forms.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground mt-2">Build and manage custom forms</p>
        </div>
        {message && (
          <Badge variant={messageType === "success" ? "default" : "destructive"}>{message}</Badge>
        )}
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
            <div className="text-3xl font-bold">{forms.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{publishedCount} published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSubmissions}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all forms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Published form ratio</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Forms</CardTitle>
          <CardDescription>Manage your custom forms</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading forms...</p>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
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
                        <Badge variant={form.status === "published" ? "default" : "secondary"}>
                          {form.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {form.fieldsCount} fields - {form.submissions} submissions
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Last submission: {form.lastSubmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cms/forms/${form._id}/submissions`}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/cms/forms/new/${form._id}`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handelDelete(form._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
