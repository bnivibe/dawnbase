import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/lib/db/articles-repository";

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
  }).format(new Date(date));
}

export default async function ArticlesPage() {
  const { data: articles, pagination } = await getArticles();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Articles</h1>
          <p className="text-sm text-muted-foreground">
            {pagination.total} article{pagination.total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button render={<Link href="/articles/new" />}>
          <Plus className="size-4" />
          New Article
        </Button>
      </div>

      {/* Article list */}
      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 size-12 text-muted-foreground/40" />
            <h2 className="text-lg font-medium">No articles yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first article to get started!
            </p>
            <Button className="mt-4" render={<Link href="/articles/new" />}>
              <Plus className="size-4" />
              New Article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="block">
              <Card className="transition-colors hover:bg-muted/30">
                <CardHeader>
                  <CardTitle>{article.title}</CardTitle>
                  <CardAction>
                    <StatusBadge status={article.status} />
                  </CardAction>
                  <CardDescription>
                    {article.excerpt || "No excerpt"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(article.createdAt)}
                    {article.publishedAt && (
                      <> &middot; Published {formatDate(article.publishedAt)}</>
                    )}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
