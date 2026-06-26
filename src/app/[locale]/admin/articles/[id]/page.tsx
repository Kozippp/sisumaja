import ArticleForm from '@/components/admin/ArticleForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: PageProps) {
  const { id } = await params;
  return <ArticleForm articleId={id} />;
}
