"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Download, Edit, Loader2, Monitor, Save } from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
import type { z } from "zod";

type ResumeForm = z.input<typeof resumeSchema>;

export default function ResumeBuilder({ initialContent }: { initialContent?: string | null }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState<string | undefined | null>(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState<"edit" | "preview">("preview");

  const { control, register, handleSubmit, watch, formState: { errors } } = useForm<ResumeForm>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {} as any,
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const { loading: isSaving, fn: saveResumeFn, data: saveResult, error: saveError } = useFetch(saveResume);

  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, activeTab]);

  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error((saveError as any).message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues as any;
    const parts: string[] = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin) parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.fullName ?? ""}</div>\n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues as any;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      } as any;

      await (html2pdf() as any).set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (_data: ResumeForm) => {
    try {
      const formattedContent = (previewContent ?? "")
        .replace(/\n/g, "\n")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      await saveResumeFn(formattedContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">Resume Builder</h1>
        <div className="space-x-2">
          <Button variant="destructive" onClick={handleSubmit(onSubmit as any)} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input {...register("contactInfo.email" as any)} type="email" placeholder="your@email.com" error={(errors as any).contactInfo?.email} />
                  {(errors as any).contactInfo?.email && (
                    <p className="text-sm text-red-500">{(errors as any).contactInfo.email.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input {...register("contactInfo.mobile" as any)} type="tel" placeholder="+1 234 567 8900" />
                  {(errors as any).contactInfo?.mobile && (
                    <p className="text-sm text-red-500">{(errors as any).contactInfo.mobile.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input {...register("contactInfo.linkedin" as any)} type="url" placeholder="https://linkedin.com/in/your-profile" />
                  {(errors as any).contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">{(errors as any).contactInfo.linkedin.message as string}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Twitter/X Profile</label>
                  <Input {...register("contactInfo.twitter" as any)} type="url" placeholder="https://twitter.com/your-handle" />
                  {(errors as any).contactInfo?.twitter && (
                    <p className="text-sm text-red-500">{(errors as any).contactInfo.twitter.message as string}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name={"summary" as any}
                control={control}
                render={({ field }) => (
                  <Textarea {...field} className="h-32" placeholder="Write a compelling professional summary..." error={(errors as any).summary} />
                )}
              />
              {(errors as any).summary && <p className="text-sm text-red-500">{(errors as any).summary.message as string}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name={"skills" as any}
                control={control}
                render={({ field }) => (
                  <Textarea {...field} className="h-32" placeholder="List your key skills..." error={(errors as any).skills} />
                )}
              />
              {(errors as any).skills && <p className="text-sm text-red-500">{(errors as any).skills.message as string}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name={"experience" as any}
                control={control}
                render={({ field }) => <EntryForm type="Experience" entries={field.value as any} onChange={field.onChange} />}
              />
              {(errors as any).experience && <p className="text-sm text-red-500">{(errors as any).experience.message as string}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name={"education" as any}
                control={control}
                render={({ field }) => <EntryForm type="Education" entries={field.value as any} onChange={field.onChange} />}
              />
              {(errors as any).education && <p className="text-sm text-red-500">{(errors as any).education.message as string}</p>}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name={"projects" as any}
                control={control}
                render={({ field }) => <EntryForm type="Project" entries={field.value as any} onChange={field.onChange} />}
              />
              {(errors as any).projects && <p className="text-sm text-red-500">{(errors as any).projects.message as string}</p>}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {activeTab === "preview" && (
            <Button variant="link" type="button" className="mb-2" onClick={() => setResumeMode(resumeMode === "preview" ? "edit" : "preview")}>
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">You will lose editied markdown if you update the form data.</span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor value={previewContent ?? undefined} onChange={setPreviewContent as any} height={800} preview={resumeMode} />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown source={previewContent ?? ""} style={{ background: "white", color: "black" }} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
