"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface ValidationError {
  field: string;
  message: string;
}

interface EditArticleFormProps {
  article: {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    status: "draft" | "published" | "archived";
  };
}

export function EditArticleForm({ article }: EditArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [excerpt, setExcerpt] = useState(article.excerpt ?? "");
  const [status, setStatus] = useState<"draft" | "published">(
    article.status === "published" ? "published" : "draft",
  );
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function getFieldError(field: string) {
    return errors.find((e) => e.field === field)?.message;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const body: Record<string, unknown> = {};

      if (title !== article.title) body.title = title;
      if (content !== article.content) body.content = content;
      if (excerpt !== (article.excerpt ?? "")) {
        body.excerpt = excerpt || null;
      }
      if (status !== article.status) body.status = status;

      // If nothing changed, just redirect back
      if (Object.keys(body).length === 0) {
        router.push(`/articles/${article.slug}`);
        return;
      }

      const res = await fetch(`/api/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.details && Array.isArray(json.details)) {
          setErrors(json.details);
        } else {
          alert(json.error || "Failed to update article");
        }
        return;
      }

      router.push(`/articles/${json.data.slug}`);
      router.refresh();
    } catch {
      alert("An error occurred while updating the article.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          render={<Link href={`/articles/${article.slug}`} />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Article</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none"
              >
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title"
                aria-invalid={!!getFieldError("title")}
              />
              {getFieldError("title") && (
                <p className="text-xs text-destructive">
                  {getFieldError("title")}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label
                htmlFor="content"
                className="text-sm font-medium leading-none"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content in Markdown..."
                rows={16}
                className="w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
                aria-invalid={!!getFieldError("content")}
              />
              {getFieldError("content") && (
                <p className="text-xs text-destructive">
                  {getFieldError("content")}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <label
                htmlFor="excerpt"
                className="text-sm font-medium leading-none"
              >
                Excerpt{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary. Auto-generated from content if left empty."
                rows={3}
                className="w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
              {getFieldError("excerpt") && (
                <p className="text-xs text-destructive">
                  {getFieldError("excerpt")}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    value="draft"
                    checked={status === "draft"}
                    onChange={() => setStatus("draft")}
                    className="accent-primary"
                  />
                  Draft
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    value="published"
                    checked={status === "published"}
                    onChange={() => setStatus("published")}
                    className="accent-primary"
                  />
                  Published
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              render={<Link href={`/articles/${article.slug}`} />}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              <Save className="size-4" />
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
