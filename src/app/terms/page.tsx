import Link from "next/link";
import { Box, Typography } from "@mui/material";

import { JsonLdScript } from "@/components/JsonLd";
import { StickyToc } from "@/components/StickyToc";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo";
import "./style.css";

const META_TITLE = "Terms and Conditions | TheOceanGame";

const META_DESC =
  "Read the Terms and Conditions for TheOceanGame. Please read these terms carefully before using our website.";

const SCROLL_OFFSET = 120;

/* -------------------------------- Constants ------------------------------- */

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "eligibility", label: "Eligibility" },
  { id: "use-of-website", label: "Use of Website" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "affiliate-disclaimer", label: "Affiliate Disclaimer" },
  { id: "third-party-links", label: "Third-Party Links" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "governing-law", label: "Governing Law" },
  { id: "changes-to-terms", label: "Changes to Terms" },
  { id: "contact-information", label: "Contact Information" },
];

const ELIGIBILITY_POINTS = [
  "You are of legal age to access iGaming-related content in your jurisdiction",
  "You will comply with all applicable local, state, national, and international laws",
  "You will not use the Website for any unlawful purpose",
  "All information you provide is accurate and current",
];

const PROHIBITED_ACTIVITIES = [
  "Copy, reproduce, or redistribute our content without permission",
  "Use automated systems (bots, scrapers) to access the Website",
  "Attempt to gain unauthorized access to any part of the Website",
  "Transmit viruses, malware, or harmful code",
  "Impersonate any person or entity",
  "Interfere with the proper functioning of the Website",
  "Use the Website for any illegal or fraudulent activity",
];

const WEBSITE_WARRANTIES = [
  "The Website will be uninterrupted, secure, or error-free",
  "The information provided is accurate, complete, or current",
  "Any defects or errors will be corrected",
  "The Website is free of viruses or harmful components",
];

const LIABILITY_POINTS = [
  "Loss of profits, revenue, or data",
  "iGaming losses at third-party casinos",
  "Errors or omissions in content",
  "Unauthorized access to your information",
];

const TERMS_UPDATE_POINTS = [
  'Updating the "Last Updated" date at the top of this page',
  "Posting a notice on the Website homepage",
  "Sending an email notification to registered users (if applicable)",
];

/* ---------------------------------- Styles --------------------------------- */

const SECTION_SX = {
  mb: 5,
  scrollMarginTop: SCROLL_OFFSET,
};

const H2_SX = {
  fontSize: "1.25rem",
  fontWeight: 700,
  color: "grey.900",
  mb: 2,
};

const H3_SX = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "grey.900",
  mb: 1,
};

const BODY_SX = {
  color: "grey.700",
  lineHeight: 1.8,
  mb: 2,
};

const UL_SX = {
  pl: 2.5,
  mb: 2,
  "& li": {
    mb: 0.5,
  },
};

/* ------------------------------- Components -------------------------------- */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography component="h2" sx={H2_SX}>
    {children}
  </Typography>
);

const SubTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography component="h3" sx={H3_SX}>
    {children}
  </Typography>
);

const renderList = (items: string[]) => (
  <Box component="ul" sx={UL_SX}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </Box>
);

/* ---------------------------------- Page ---------------------------------- */

export default function TermsPage() {
  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Terms & Conditions", url: "/terms" },
        ])}
      />

      <JsonLdScript
        data={buildWebPageJsonLd(
          {
            slug: "terms",
            title: META_TITLE,
            shortDesc: META_DESC,
          },
          "pages",
        )}
      />

      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 6 }}>
        {/* Hero Section */}
        <Box
          sx={{
            pt: { xs: 10, md: 16 },
            pb: { xs: 6, md: 8 },
            px: 2,
            bgcolor: "#0d0d0d",
          }}
        >
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            {/* Breadcrumb */}
            <Box
              sx={{
                fontSize: "0.875rem",
                color: "grey.400",
                mb: 3,
              }}
            >
              <Link href="/" className="terms-link">
                Home
              </Link>

              <span className="term-link-span">/</span>

              <span className="terms-condition-span">Terms & Conditions</span>
            </Box>

            {/* Hero Content */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 700,
                color: "white",
                mb: 2,
              }}
            >
              Terms and Conditions
            </Typography>

            <Typography
              sx={{
                color: "grey.300",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                maxWidth: 720,
                mb: 2,
              }}
            >
              Please read these terms carefully before using our website.
            </Typography>

            <Typography
              sx={{
                fontSize: "0.875rem",
                color: "grey.400",
              }}
            >
              Last Updated: January 15, 2025
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            maxWidth: 1200,
            mx: "auto",
            pt: { xs: 10, md: 12 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", lg: "row" },
              alignItems: "flex-start",
            }}
          >
            {/* Sidebar */}
            <Box
              component="aside"
              sx={{
                display: { xs: "none", lg: "block" },
                width: 270,
                flexShrink: 0,
                alignSelf: "flex-start",
                position: "sticky",
                top: SCROLL_OFFSET + 8,
                maxHeight: `calc(100vh - ${SCROLL_OFFSET + 16}px)`,
              }}
            >
              <StickyToc sections={SECTIONS} offset={SCROLL_OFFSET} />
            </Box>

            {/* Article */}
            <Box
              component="article"
              sx={{
                flex: 1,
                minWidth: 0,
                maxWidth: 720,
              }}
            >
              {/* 1 */}
              <Box id="introduction" sx={SECTION_SX}>
                <SectionTitle>1. Introduction</SectionTitle>

                <Typography sx={BODY_SX}>
                  Welcome to TheOceanGame. These Terms and Conditions ("Terms")
                  govern your access to and use of our website, including all
                  content, features, and services offered on or through
                  theoceangame.com (the "Website").
                </Typography>

                <Typography sx={BODY_SX}>
                  By accessing or using the Website, you agree to be bound by
                  these Terms. If you do not agree to these Terms, please do not
                  use the Website.
                </Typography>

                <Typography sx={BODY_SX}>
                  TheOceanGame is an informational platform providing casino
                  reviews, game guides, industry news, and educational content
                  related to online iGaming and iGaming. We do not operate any
                  iGaming services directly.
                </Typography>
              </Box>

              {/* 2 */}
              <Box id="eligibility" sx={SECTION_SX}>
                <SectionTitle>2. Eligibility</SectionTitle>

                <Typography sx={BODY_SX}>
                  You must be at least 18 years of age (or the legal age of
                  majority in your jurisdiction) to use this Website. By using
                  the Website, you represent and warrant that:
                </Typography>

                {renderList(ELIGIBILITY_POINTS)}

                <Typography sx={BODY_SX}>
                  We reserve the right to verify your age and identity at any
                  time. Failure to comply may result in immediate termination of
                  your access to the Website.
                </Typography>
              </Box>

              {/* 3 */}
              <Box id="use-of-website" sx={SECTION_SX}>
                <SectionTitle>3. Use of Website</SectionTitle>

                <SubTitle>3.1 Permitted Use</SubTitle>

                <Typography sx={BODY_SX}>
                  You may use the Website for personal, non-commercial purposes
                  to access information about online casinos, games, bonuses,
                  and industry news.
                </Typography>

                <SubTitle>3.2 Prohibited Activities</SubTitle>

                <Typography sx={BODY_SX}>You agree not to:</Typography>

                {renderList(PROHIBITED_ACTIVITIES)}
              </Box>

              {/* 4 */}
              <Box id="intellectual-property" sx={SECTION_SX}>
                <SectionTitle>4. Intellectual Property</SectionTitle>

                <Typography sx={BODY_SX}>
                  All content on the Website, including text, graphics, logos,
                  images, videos, software, and data compilations, is protected
                  by copyright, trademark, and intellectual property laws.
                </Typography>

                <Typography sx={BODY_SX}>
                  The TheOceanGame name and logo are trademarks of TheOceanGame.
                </Typography>
              </Box>

              {/* 5 */}
              <Box id="affiliate-disclaimer" sx={SECTION_SX}>
                <SectionTitle>5. Affiliate Disclaimer</SectionTitle>

                <Typography sx={BODY_SX}>
                  TheOceanGame participates in affiliate marketing programs and
                  may receive compensation from featured platforms.
                </Typography>

                <Typography sx={BODY_SX}>
                  Our affiliate relationships do not influence our editorial
                  content or rankings.
                </Typography>
              </Box>

              {/* 6 */}
              <Box id="third-party-links" sx={SECTION_SX}>
                <SectionTitle>6. Third-Party Links</SectionTitle>

                <Typography sx={BODY_SX}>
                  The Website may contain links to third-party websites for
                  informational purposes only.
                </Typography>

                <Typography sx={BODY_SX}>
                  We are not responsible for the content, privacy practices, or
                  policies of third-party websites.
                </Typography>
              </Box>

              {/* 7 */}
              <Box id="limitation-of-liability" sx={SECTION_SX}>
                <SectionTitle>7. Limitation of Liability</SectionTitle>

                <Typography sx={BODY_SX}>
                  The Website is provided "as is" without warranties of any
                  kind.
                </Typography>

                <Typography sx={BODY_SX}>
                  TheOceanGame does not warrant that:
                </Typography>

                {renderList(WEBSITE_WARRANTIES)}

                <Typography sx={BODY_SX}>
                  To the fullest extent permitted by law, TheOceanGame shall not
                  be liable for:
                </Typography>

                {renderList(LIABILITY_POINTS)}
              </Box>

              {/* 8 */}
              <Box id="governing-law" sx={SECTION_SX}>
                <SectionTitle>8. Governing Law</SectionTitle>

                <Typography sx={BODY_SX}>
                  These Terms shall be governed in accordance with the laws of
                  the applicable jurisdiction.
                </Typography>
              </Box>

              {/* 9 */}
              <Box id="changes-to-terms" sx={SECTION_SX}>
                <SectionTitle>9. Changes to Terms</SectionTitle>

                <Typography sx={BODY_SX}>
                  We reserve the right to modify these Terms at any time.
                </Typography>

                {renderList(TERMS_UPDATE_POINTS)}

                <Typography sx={BODY_SX}>
                  Continued use of the Website constitutes acceptance of revised
                  Terms.
                </Typography>
              </Box>

              {/* 10 */}
              <Box id="contact-information" sx={SECTION_SX}>
                <SectionTitle>10. Contact Information</SectionTitle>

                <Typography sx={BODY_SX}>
                  If you have any questions regarding these Terms and
                  Conditions, contact us at{" "}
                  <Typography
                    component="a"
                    href="mailto:support@theoceangame.com"
                    sx={{ color: "primary.main" }}
                  >
                    support@theoceangame.com
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
