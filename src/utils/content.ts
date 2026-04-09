import { getCollection, type CollectionEntry } from 'astro:content';

export type PublicArticleEntry =
  | CollectionEntry<'publishedArticles'>
  | CollectionEntry<'articleWorkbench'>;

function isPublicArticle(entry: PublicArticleEntry): boolean {
  return (
    entry.data.draft !== true &&
    Boolean(entry.data.title) &&
    Boolean(entry.data.description) &&
    Boolean(entry.data.pubDate)
  );
}

export async function getPublishedArticles(): Promise<PublicArticleEntry[]> {
  const [publishedArticles, articleWorkbench] = await Promise.all([
    getCollection('publishedArticles', ({ data }) => !data.draft),
    getCollection('articleWorkbench')
  ]);

  const dedupedLegacyTitles = new Set(publishedArticles.map((entry) => entry.data.title));
  const workbenchPublished = articleWorkbench.filter(
    (entry) => isPublicArticle(entry) && !dedupedLegacyTitles.has(entry.data.title ?? '')
  );

  return [...publishedArticles, ...workbenchPublished].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
}

export async function getPublishedArticleById(id: string): Promise<PublicArticleEntry | undefined> {
  const articles = await getPublishedArticles();
  return articles.find((article) => article.id === id);
}

export async function getPublishedArticleTagCounts() {
  const articles = await getPublishedArticles();
  const counter = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.data.tags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1);
    }
  }

  return [...counter.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

export async function getArticleWorkbenchStats() {
  const [publishedArticles, articleWorkbench] = await Promise.all([
    getCollection('publishedArticles', ({ data }) => !data.draft),
    getCollection('articleWorkbench')
  ]);

  const publishedTitles = new Set(publishedArticles.map((entry) => entry.data.title));

  const publishable = articleWorkbench.filter(isPublicArticle);
  const duplicateCandidates = publishable.filter((entry) => publishedTitles.has(entry.data.title ?? ''));
  const drafts = articleWorkbench.filter(
    (entry) => !isPublicArticle(entry) || publishedTitles.has(entry.data.title ?? '')
  );

  return {
    total: articleWorkbench.length,
    publishable: publishable.length,
    drafts: drafts.length,
    duplicates: duplicateCandidates.length
  };
}
