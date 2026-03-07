"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ArticleDeleteButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this article?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const json = await res.json();
        alert(json.error || "Failed to delete article");
        return;
      }

      router.push("/articles");
      router.refresh();
    } catch {
      alert("An error occurred while deleting the article.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      disabled={deleting}
    >
      <Trash2 className="size-4" />
      {deleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
