import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/db/articles-repository";
import { EditArticleForm } from "./edit-form";

export default async function EditArticlePage({
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
    <EditArticleForm
      article={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        status: article.status,
      }}
    />
  );
}
