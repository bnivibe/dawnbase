import Link from "next/link";
import { FileText, PenLine, BookOpen, Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getArticleStats } from "@/lib/db/articles-repository";

export default async function DashboardPage() {
  const stats = await getArticleStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">{"Dawn's Knowledge Base"}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total Articles</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              {stats.total === 0 ? "No articles yet" : `${stats.total} articles total`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-2xl">{stats.draft}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <PenLine className="size-3.5" />
              {stats.draft === 0 ? "No drafts" : `${stats.draft} in progress`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-2xl">{stats.published}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="size-3.5" />
              {stats.published === 0 ? "No published articles" : `${stats.published} published`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Get Started */}
      <Card>
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Start building your knowledge archive by creating your first article.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/articles/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            <Plus className="size-4" />
            Create First Article
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
