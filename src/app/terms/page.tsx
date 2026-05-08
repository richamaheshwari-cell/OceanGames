import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { JsonLdScript } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo";
import { StickyToc } from "@/components/StickyToc";

const META_TITLE = "Terms and Conditions | TheOceanGame";
const META_DESC =
  "Read the Terms and Conditions for TheOceanGame. Please read these terms carefully before using our website.";

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

const SCROLL_OFFSET = 120;

const SECTION_SX = { mb: 5, scrollMarginTop: SCROLL_OFFSET };
const H2_SX = { fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 };
const BODY_SX = { color: "grey.700", lineHeight: 1.8, mb: 2 };
const UL_SX = { pl: 2.5, mb: 2, "& li": { mb: 0.5 } };

export default function TermsPage() {
  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Terms & Conditions", url: "/terms" },
        ])}
      />
      <JsonLdScript data={buildWebPageJsonLd({ slug: "terms", title: META_TITLE, shortDesc: META_DESC }, "pages")} />

      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 6 }}>
        {/* Hero */}
        <Box sx={{ pt: { xs: 10, md: 16 }, pb: { xs: 6, md: 8 }, px: 2, bgcolor: "#0d0d0d" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Box sx={{ fontSize: "0.875rem", color: "grey.400", mb: 3 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ margin: "0 0.35rem" }}>/</span>
              <span style={{ color: "white" }}>Terms & Conditions</span>
            </Box>
            <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, color: "white", mb: 2 }}>
              Terms and Conditions
            </Typography>
            <Typography sx={{ color: "grey.300", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 720, mb: 2 }}>
              Please read these terms carefully before using our website.
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "grey.400" }}>Last Updated: January 15, 2025</Typography>
          </Box>
        </Box>

        {/* Main: flex + sticky sidebar + content */}
        <Box component="main" sx={{ maxWidth: 1200, mx: "auto", pt: { xs: 10, md: 12 }, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", lg: "row" }, alignItems: "flex-start" }}>
            {/* Sidebar TOC - hidden on mobile */}
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

            {/* Content */}
            <Box component="article" sx={{ flex: 1, minWidth: 0, maxWidth: 720 }}>
              <Box id="introduction" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  1. Introduction
                </Typography>
                <Typography sx={BODY_SX}>
                  Welcome to TheOceanGame. These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of our
                  website, including all content, features, and services offered on or through theoceangame.com (the
                  &quot;Website&quot;).
                </Typography>
                <Typography sx={BODY_SX}>
                  By accessing or using the Website, you agree to be bound by these Terms. If you do not agree to these
                  Terms, please do not use the Website.
                </Typography>
                <Typography sx={BODY_SX}>
                  TheOceanGame is an informational platform providing casino reviews, game guides, industry news, and
                  educational content related to online iGaming and iGaming. We do not operate any iGaming services
                  directly.
                </Typography>
              </Box>

              <Box id="eligibility" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  2. Eligibility
                </Typography>
                <Typography sx={BODY_SX}>
                  You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to use this
                  Website. By using the Website, you represent and warrant that:
                </Typography>
                <Box component="ul" sx={UL_SX}>
                  <li>You are of legal age to access iGaming-related content in your jurisdiction</li>
                  <li>You will comply with all applicable local, state, national, and international laws</li>
                  <li>You will not use the Website for any unlawful purpose</li>
                  <li>All information you provide is accurate and current</li>
                </Box>
                <Typography sx={BODY_SX}>
                  We reserve the right to verify your age and identity at any time. Failure to comply may result in
                  immediate termination of your access to the Website.
                </Typography>
              </Box>

              <Box id="use-of-website" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  3. Use of Website
                </Typography>
                <Typography component="h3" sx={{ fontSize: "1rem", fontWeight: 600, color: "grey.900", mb: 1 }}>
                  3.1 Permitted Use
                </Typography>
                <Typography sx={BODY_SX}>
                  You may use the Website for personal, non-commercial purposes to access information about online
                  casinos, games, bonuses, and industry news. You may read, share, and reference our content with proper
                  attribution.
                </Typography>
                <Typography component="h3" sx={{ fontSize: "1rem", fontWeight: 600, color: "grey.900", mb: 1 }}>
                  3.2 Prohibited Activities
                </Typography>
                <Typography sx={BODY_SX}>
                  You agree not to:
                </Typography>
                <Box component="ul" sx={UL_SX}>
                  <li>Copy, reproduce, or redistribute our content without permission</li>
                  <li>Use automated systems (bots, scrapers) to access the Website</li>
                  <li>Attempt to gain unauthorized access to any part of the Website</li>
                  <li>Transmit viruses, malware, or harmful code</li>
                  <li>Impersonate any person or entity</li>
                  <li>Interfere with the proper functioning of the Website</li>
                  <li>Use the Website for any illegal or fraudulent activity</li>
                </Box>
              </Box>

              <Box id="intellectual-property" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  4. Intellectual Property
                </Typography>
                <Typography sx={BODY_SX}>
                  All content on the Website, including but not limited to text, graphics, logos, images, videos,
                  software, and compilation of data (collectively, &quot;Content&quot;), is the property of TheOceanGame or its
                  content suppliers and is protected by international copyright, trademark, and other intellectual
                  property laws.
                </Typography>
                <Typography sx={BODY_SX}>
                  The TheOceanGame name, logo, and all related names, logos, product and service names, designs, and
                  slogans are trademarks of TheOceanGame. You may not use such marks without our prior written
                  permission.
                </Typography>
                <Typography sx={BODY_SX}>
                  Third-party trademarks, logos, and brand names appearing on the Website are the property of their
                  respective owners and are used for informational and editorial purposes only.
                </Typography>
              </Box>

              <Box id="affiliate-disclaimer" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  5. Affiliate Disclaimer
                </Typography>
                <Typography sx={BODY_SX}>
                  TheOceanGame participates in affiliate marketing programs. This means we may receive compensation when
                  you click on certain links or sign up with online casinos featured on our Website.
                </Typography>
                <Typography sx={BODY_SX}>
                  Important: Our affiliate relationships do not influence our editorial content, reviews, or rankings. We
                  maintain strict editorial independence and provide honest, unbiased assessments based on thorough
                  research and analysis.
                </Typography>
                <Typography sx={BODY_SX}>
                  We only recommend casinos and services that meet our quality standards. However, we encourage you to
                  conduct your own research and read the terms and conditions of any casino before registering or
                  depositing funds.
                </Typography>
                <Typography sx={BODY_SX}>
                  Affiliate commissions help us maintain and improve the Website, allowing us to provide free,
                  high-quality content to our users.
                </Typography>
              </Box>

              <Box id="third-party-links" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  6. Third-Party Links
                </Typography>
                <Typography sx={BODY_SX}>
                  The Website contains links to third-party websites, including online casinos, game providers, and other
                  iGaming-related services. These links are provided for your convenience and information only.
                </Typography>
                <Typography sx={BODY_SX}>
                  We do not control, endorse, or assume responsibility for the content, privacy policies, or practices
                  of any third-party websites. You acknowledge and agree that TheOceanGame shall not be liable for any
                  damage or loss caused by your use of any third-party website.
                </Typography>
                <Typography sx={BODY_SX}>
                  When you leave our Website, we encourage you to read the terms and conditions and privacy policy of
                  each website you visit. Your interactions with third-party websites are solely between you and that
                  third party.
                </Typography>
              </Box>

              <Box id="limitation-of-liability" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  7. Limitation of Liability
                </Typography>
                <Typography sx={BODY_SX}>
                  The Website and all content are provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
                  either express or implied, including but not limited to warranties of merchantability, fitness for a
                  particular purpose, or non-infringement.
                </Typography>
                <Typography sx={BODY_SX}>
                  TheOceanGame does not warrant that:
                </Typography>
                <Box component="ul" sx={UL_SX}>
                  <li>The Website will be uninterrupted, secure, or error-free</li>
                  <li>The information provided is accurate, complete, or current</li>
                  <li>Any defects or errors will be corrected</li>
                  <li>The Website is free of viruses or harmful components</li>
                </Box>
                <Typography sx={BODY_SX}>
                  To the fullest extent permitted by law, TheOceanGame shall not be liable for any direct, indirect,
                  incidental, special, consequential, or punitive damages arising from your use of or inability to use
                  the Website, including but not limited to:
                </Typography>
                <Box component="ul" sx={UL_SX}>
                  <li>Loss of profits, revenue, or data</li>
                  <li>iGaming losses at third-party casinos</li>
                  <li>Errors or omissions in content</li>
                  <li>Unauthorized access to your information</li>
                </Box>
                <Typography sx={BODY_SX}>
                  Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so the
                  above limitations may not apply to you.
                </Typography>
              </Box>

              <Box id="governing-law" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  8. Governing Law
                </Typography>
                <Typography sx={BODY_SX}>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which
                  TheOceanGame operates, without regard to its conflict of law provisions. Any disputes arising from these
                  Terms or your use of the Website shall be resolved through binding arbitration in accordance with the
                  rules of the applicable arbitration association, except where prohibited by law. You agree to submit to
                  the personal jurisdiction of the courts located within our operating jurisdiction for the purpose of
                  litigating all such claims or disputes.
                </Typography>
              </Box>

              <Box id="changes-to-terms" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  9. Changes to Terms
                </Typography>
                <Typography sx={BODY_SX}>
                  We reserve the right to modify or replace these Terms at any time at our sole discretion. We will
                  provide notice of any material changes by:
                </Typography>
                <Box component="ul" sx={UL_SX}>
                  <li>Updating the &quot;Last Updated&quot; date at the top of this page</li>
                  <li>Posting a notice on the Website homepage</li>
                  <li>Sending an email notification to registered users (if applicable)</li>
                </Box>
                <Typography sx={BODY_SX}>
                  Your continued use of the Website after any changes to these Terms constitutes your acceptance of the
                  new Terms. If you do not agree to the revised Terms, you must stop using the Website. We encourage you
                  to review these Terms periodically to stay informed of any updates.
                </Typography>
              </Box>

              <Box id="contact-information" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  10. Contact Information
                </Typography>
                <Typography sx={BODY_SX}>
                  If you have any questions, concerns, or feedback regarding these Terms and Conditions, please contact
                  us at:{" "}
                  <Typography component="a" href="mailto:support@theoceangame.com" sx={{ color: "primary.main" }}>
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
