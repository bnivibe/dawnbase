"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { publishArticleAction, unpublishArticleAction } from "@/actions/admin";

interface PublishToggleProps {
  articleId: string;
  status: string;
}

export function PublishToggle({ articleId, status }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition();

  const isPublished = status === "published";

  function handleClick() {
    startTransition(async () => {
      if (isPublished) {
        await unpublishArticleAction(articleId);
      } else {
        await publishArticleAction(articleId);
      }
    });
  }

  return (
    <Button
      variant={isPublished ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending
        ? "Saving..."
        : isPublished
          ? "Unpublish"
          : "Publish"}
    </Button>
  );
}
