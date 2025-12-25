"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, GripVertical, Save } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface FormField {
  id: string
  type: string
  label: string
  placeholder: string
  required: boolean
  options?: string[]
}

export default function NewFormPage() {
  const router = useRouter()
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [submitButtonText, setSubmitButtonText] = useState("Submit")
  const [successMessage, setSuccessMessage] = useState("Thank you for your submission!")
  const [fields, setFields] = useState<FormField[]>([
    { id: "1", type: "text", label: "Name", placeholder: "Enter your name", required: true },
    { id: "2", type: "email", label: "Email", placeholder: "your@email.com", required: true },
  ])

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: "text",
      label: "New Field",
      placeholder: "",
      required: false,
    }
    setFields([...fields, newField])
  }

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id))
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const handleSave = () => {
    console.log("[v0] Saving form:", { formName, formDescription, submitButtonText, successMessage, fields })
    // In real implementation, save to database
    alert("Form created successfully!")
    router.push("/cms/forms")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Form</h1>
          <p className="text-muted-foreground mt-2">Build a custom form for your website</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Form
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Form Settings</CardTitle>
              <CardDescription>Configure basic form information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Form Name</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Contact Form" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief description of this form"
                  rows={3}
                />
              </div>
              <div>
                <Label>Submit Button Text</Label>
                <Input
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                  placeholder="Submit"
                />
              </div>
              <div>
                <Label>Success Message</Label>
                <Input
                  value={successMessage}
                  onChange={(e) => setSuccessMessage(e.target.value)}
                  placeholder="Thank you for your submission!"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Form Fields</CardTitle>
                <Button size="sm" onClick={addField}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <span className="font-medium">Field {index + 1}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeField(field.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <Label className="text-xs">Field Type</Label>
                      <Select value={field.type} onValueChange={(value) => updateField(field.id, { type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="textarea">Textarea</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        placeholder="Field label"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        value={field.placeholder}
                        onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        placeholder="Placeholder text"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Required</Label>
                      <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No fields added yet</p>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent" onClick={addField}>
                    Add First Field
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your form will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 p-6 border rounded-lg bg-muted/30">
                {formName && <h3 className="text-lg font-semibold">{formName}</h3>}
                {formDescription && <p className="text-sm text-muted-foreground">{formDescription}</p>}

                {fields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label>
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea placeholder={field.placeholder} />
                    ) : field.type === "select" ? (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder || "Select option"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input type={field.type} placeholder={field.placeholder} />
                    )}
                  </div>
                ))}

                {fields.length > 0 && <Button className="w-full">{submitButtonText}</Button>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
