function cleanText(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
 
export function generateFaqSchema(contentHtml: string) {
  const plainText = cleanText(contentHtml);
 
  const faqIndex = plainText.search(/\bFAQs?\b/i);
  if (faqIndex === -1) return null;
 
  const faqText = plainText.slice(faqIndex).replace(/^FAQs?\s*/i, "");
 
  const faqRegex =
    /(?:^|\s)(?:\d+\.\s*)?([^?]+?\?)\s+([\s\S]*?)(?=\s+\d+\.\s*[^?]+?\?|$)/g;
 
  const mainEntity = [];
  let match;
 
  while ((match = faqRegex.exec(faqText)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();
 
    if (question && answer) {
      mainEntity.push({
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer,
        },
      });
    }
  }
 
  if (!mainEntity.length) return null;
 
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}