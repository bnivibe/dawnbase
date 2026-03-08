import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getArticleBySlug } from "@/lib/db/articles-repository";
import { MarkdownContent } from "@/components/markdown-content";

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "published":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          Published
        </Badge>
      );
    case "draft":
      return <Badge variant="outline">Draft</Badge>;
    case "archived":
      return (
        <Badge variant="secondary" className="opacity-60">
          Archived
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(decodeURIComponent(slug));

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/articles" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <span className="text-sm text-muted-foreground">Back to Articles</span>
      </div>

      {/* Article */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{article.title}</CardTitle>
          <CardAction className="flex items-center gap-2">
            <StatusBadge status={article.status} />
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Meta info */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>Created: {formatDate(article.createdAt)}</span>
            <span>Updated: {formatDate(article.updatedAt)}</span>
            {article.publishedAt && (
              <span>Published: {formatDate(article.publishedAt)}</span>
            )}
            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Source ({article.sourceType ?? "link"})
              </a>
            )}
          </div>

          <Separator />

          {/* Content */}
          <MarkdownContent content={article.content} />
        </CardContent>
      </Card>
    </div>
  );
}
