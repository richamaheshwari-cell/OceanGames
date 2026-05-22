 
interface casinoPerson {
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
 
interface casinoArticle {
    url?: string;
    title: string;
    description?: string;
    image?: string | string[];
    datePublished?: string;
    dateModified?: string;
    author?: casinoPerson;
    reviewedBy?: casinoPerson;
}
 
export function generateCasinoSchema(casinoArticle: casinoArticle) {
    const baseUrl = "https://theoceangame.com";
    const articleUrl = casinoArticle.url || "";
    const authorName = casinoArticle.author?.name || "";
    const orgId = `${baseUrl}#organization`;
    const personId = authorName ? `${baseUrl}/authors/${encodeURIComponent(authorName)}#person` : undefined;
    const webpageId = `${articleUrl}#webpage`;
    const articleId = `${articleUrl}#article`;
 
    // Format dates with offset if present
    const datePublished = formatDateWithOffset(casinoArticle.datePublished);
    const dateModified = formatDateWithOffset(casinoArticle.dateModified) || datePublished;
 
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": webpageId,
                "url": articleUrl,
                "name": casinoArticle.title,
                "description": casinoArticle.description,
            },
            {
                "@type": "NewsArticle",
                "@id": articleId,
                "headline": casinoArticle.title,
                "description": casinoArticle.description,
                "datePublished": datePublished,
                "dateModified": dateModified,
                "mainEntityOfPage": { "@id": webpageId },
                "author": personId ? { "@id": personId } : undefined,
                "publisher": { "@id": orgId },
                "image": Array.isArray(casinoArticle.image)
                    ? casinoArticle.image
                    : [casinoArticle.image].filter(Boolean),
                "url": articleUrl,
            },
            casinoArticle.author && personId
                ? {
                    "@type": "Person",
                    "@id": personId,
                    "name": casinoArticle.author.name,
                    "description": casinoArticle.author.description,
                    "image": casinoArticle.author.image,
                    "url": `${baseUrl}/authors/${casinoArticle.author.slug ||
                        casinoArticle.author.name.toLowerCase().replace(/\s+/g, "-")
                        }`,
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
 