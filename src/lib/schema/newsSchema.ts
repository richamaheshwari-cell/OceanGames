 
interface NewsPerson {
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
 
interface NewsArticle {
  url?: string;
  title: string;
  description?: string;
  image?: string | string[];
  datePublished?: string;
  dateModified?: string;
  author?: NewsPerson;
  reviewedBy?: NewsPerson;
}
 
export function generateNewsSchema(newsArticle: NewsArticle) {
  const baseUrl = "https://theoceangame.com";
  const articleUrl = newsArticle.url || "";
  const authorName = newsArticle.author?.name || "";
  const orgId = `${baseUrl}#organization`;
  const personId = authorName ? `${baseUrl}/authors/${encodeURIComponent(authorName)}#person` : undefined;
  const webpageId = `${articleUrl}#webpage`;
  const articleId = `${articleUrl}#article`;
 
  // Format dates with offset if present
  const datePublished = formatDateWithOffset(newsArticle.datePublished);
  const dateModified = formatDateWithOffset(newsArticle.dateModified) || datePublished;
 
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": webpageId,
        "url": articleUrl,
        "name": newsArticle.title,
        "description": newsArticle.description,
      },
      {
        "@type": "NewsArticle",
        "@id": articleId,
        "headline": newsArticle.title,
        "description": newsArticle.description,
        "datePublished": datePublished,
        "dateModified": dateModified,
        "mainEntityOfPage": { "@id": webpageId },
        "author": personId ? { "@id": personId } : undefined,
        "publisher": { "@id": orgId },
        "image": Array.isArray(newsArticle.image)
          ? newsArticle.image
          : [newsArticle.image].filter(Boolean),
        "url": articleUrl,
      },
      newsArticle.author && personId
        ? {
            "@type": "Person",
            "@id": personId,
            "name": newsArticle.author.name,
            "description": newsArticle.author.description,
            "image": newsArticle.author.image,
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
 