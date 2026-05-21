
interface ArticlePerson {
  type?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
}

// Utility to format date as 'YYYY-MM-DDTHH:mm:ss±hh:mm'
function formatDateWithOffset(dateInput?: string | Date): string | undefined {
  if (!dateInput) return undefined;
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return undefined;
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMinutes = pad(absOffset % 60);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${sign}${offsetHours}:${offsetMinutes}`;
}

interface Article {
  url?: string;
  title: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: ArticlePerson;
  reviewedBy?: ArticlePerson;
}

export function generateArticleSchema(article: Article) {
  const baseUrl = "https://theoceangame.com";
  const articleUrl = article.url || "";
  const authorName = article.author?.name || "";
  const orgId = `${baseUrl}#organization`;
  const personId = authorName ? `${baseUrl}/authors/${encodeURIComponent(authorName)}#person` : undefined;
  const webpageId = `${articleUrl}#webpage`;
  const articleId = `${articleUrl}#article`;

  // Format dates with offset if present
  const datePublished = formatDateWithOffset(article.datePublished);
  const dateModified = formatDateWithOffset(article.dateModified) || datePublished;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": articleUrl,
        "name": article.title,
        "description": article.description,
      },
      {
        "@type": "BlogPosting",
        "@id": articleId,
        "headline": article.title,
        "description": article.description,
        "datePublished": datePublished,
        "dateModified": dateModified,
        "mainEntityOfPage": { "@id": webpageId },
        "author": personId ? { "@id": personId } : undefined,
        "publisher": { "@id": orgId },
        "image": Array.isArray(article.image)
          ? article.image
          : [article.image].filter(Boolean),
        "url": articleUrl,
      },
      article.author && personId
        ? {
            "@type": "Person",
            "@id": personId,
            "name": article.author.name,
            "description": article.author.description,
            "image": article.author.image,
            "url": `${baseUrl}/authors/${encodeURIComponent(authorName)}`,
          }
        : undefined,
      {
        "@type": "Organization",
        "@id": orgId,
        "name": "TheOceanGame",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/favicon/android-chrome-512x512.png`,
        },
      },
    ].filter(Boolean),
  };
}