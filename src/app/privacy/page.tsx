import Link from "next/link";
import { Box, Typography } from "@mui/material";
import { JsonLdScript } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo";
import { StickyToc } from "@/components/StickyToc";

const META_TITLE = "Privacy Policy | The Ocean Game Data Protection Hub";
const META_DESC =
  "Read The Ocean Game privacy policy to learn how we collect, use, and protect your data while ensuring transparency and user security.";

const SECTIONS = [
  { id: "introduction", label: "Introduction" },
  { id: "personal-information", label: "Personal Information We Collect" },
  { id: "how-we-use", label: "How We Use Information" },
  { id: "sharing", label: "Sharing Your Personal Information" },
  { id: "third-party", label: "Third-Party Collection of Information" },
  { id: "data-security", label: "Data Security" },
  { id: "retention", label: "Retention of Information" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "your-rights", label: "Your Rights and Choices" },
  { id: "cookie-policy", label: "Our Cookie Policy" },
  { id: "changes", label: "Changes to Policy" },
  { id: "contact", label: "Contact Us" },
];

const SCROLL_OFFSET = 120;

export default function PrivacyPage() {
  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" },
        ])}
      />
      <JsonLdScript data={buildWebPageJsonLd({ slug: "privacy", title: META_TITLE, shortDesc: META_DESC }, "pages")} />

      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 6 }}>
        {/* Hero */}
        <Box sx={{ pt: { xs: 10, md: 16 }, pb: { xs: 6, md: 8 }, px: 2, bgcolor: "#0d0d0d" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Box sx={{ fontSize: "0.875rem", color: "grey.400", mb: 3 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ margin: "0 0.35rem" }}>/</span>
              <span style={{ color: "white" }}>Privacy Policy</span>
            </Box>
            <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, color: "white", mb: 2 }}>
              Privacy Policy
            </Typography>
            <Typography sx={{ color: "grey.300", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 720, mb: 2 }}>
              Your privacy is important to us. Learn how we collect, use, and protect your data.
            </Typography>
            <Typography sx={{ fontSize: "0.875rem", color: "grey.400" }}>Last Updated: May 26, 2025</Typography>
          </Box>
        </Box>

        {/* Main: flex + sticky sidebar + content */}
        <Box component="main" sx={{ maxWidth: 1200, mx: "auto", pt: { xs: 10, md: 12 }, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", lg: "row" }, alignItems: "flex-start" }}>
            {/* Sidebar TOC - sticky left; alignSelf needed so aside height isn't stretched and sticky works */}
            <Box
              component="aside"
              sx={{
                display: { xs: "none", lg: "block" },
                width: 270,
                flexShrink: 0,
                alignSelf: "flex-start",
                position: "sticky",
                top: SCROLL_OFFSET + 8,
                maxHeight: `calc(100vh - ${SCROLL_OFFSET + 16}px)`
              }}
            >
              <StickyToc sections={SECTIONS} offset={SCROLL_OFFSET} />
            </Box>

            {/* Content */}
            <Box component="article" sx={{ flex: 1, minWidth: 0, maxWidth: 720 }}>
              <Box id="introduction" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  1. Introduction
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 2 }}>
                  At The Ocean Game, we are committed to protecting the privacy and personal information of our
                  users. This Privacy Policy outlines how we collect, use, share, and safeguard your personal
                  information when you visit our online iGaming and bonus review website. You accept the policies
                  outlined in this policy by using our services.
                </Typography>
              </Box>

              <Box id="personal-information" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  2. Personal Information We Collect
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 2 }}>
                  We may collect certain personal information from you when you navigate our website. This includes:
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, mb: 2, "& li": { mb: 0.5 } }}>
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Demographic data (for example, age, gender, and location)</li>
                  <li>IP address</li>
                  <li>Browser information</li>
                  <li>Usage data (such as pages visited and actions taken on the website)</li>
                </Box>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8 }}>
                  We collect this information when you voluntarily provide it to us, such as when you create an
                  account, subscribe to our newsletters, participate in surveys or promotions, or engage in other
                  activities on our website.
                </Typography>
              </Box>

              <Box id="how-we-use" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  3. How We Use Your Personal Information
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 2 }}>
                  We may use the personal information we have about you for the following purposes:
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 1 } }}>
                  <li><strong>a.</strong> To provide and personalize our services, including processing your account registration and managing your account.</li>
                  <li><strong>b.</strong> To communicate with you regarding your account, customer support inquiries, or to send you important updates and notifications.</li>
                  <li><strong>c.</strong> To improve our website and services, by analyzing user behavior and preferences, and enhancing our content and user experience.</li>
                  <li><strong>d.</strong> We may send you newsletters, marketing materials, and promotional offers that we think you&apos;ll find interesting. You have the option to stop receiving these communications at any time.</li>
                  <li><strong>e.</strong> To conduct research, surveys, and analysis to improve our services and better understand user preferences.</li>
                  <li><strong>f.</strong> To follow the law and uphold our terms of service.</li>
                </Box>
              </Box>

              <Box id="sharing" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  4. Sharing Your Personal Information
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 2 }}>
                  The following situations may involve us disclosing your personal information:
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 1 } }}>
                  <li><strong>a.</strong> With trusted third-party service providers who assist us in operating our website and providing our services. These third parties are obligated to protect your information and only use it for the purposes specified by us.</li>
                  <li><strong>b.</strong> We may share your information with our affiliates and partners for marketing and promotional purposes, but we will seek your explicit consent before sharing your information for such purposes.</li>
                  <li><strong>c.</strong> In response to a legal request, court order, or governmental authority requiring us to disclose your personal information.</li>
                  <li><strong>d.</strong> If we believe it is necessary to investigate, prevent, or take action regarding illegal activities, suspected fraud, or violations of our terms of service.</li>
                </Box>
              </Box>

              <Box id="third-party" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  5. Third-Party Collection of Information
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8 }}>
                  Links on our website may lead to third-party sites and services that are not under our control or
                  operation. These third parties may collect information about you through cookies, web beacons,
                  and other tracking technologies when you interact with their websites or services. We encourage
                  you to review the privacy policies of these third parties as we have no control over and are not
                  responsible for their practices.
                </Typography>
              </Box>

              <Box id="data-security" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  6. How We Safeguard and Transfer Your Information
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 1 } }}>
                  <li><strong>a.</strong> We employ industry-standard techniques and technologies to safeguard your personal information and ensure its protection against unauthorized access, disclosure, alteration, or destruction.</li>
                  <li><strong>b.</strong> We give utmost importance to the security of our Services and your information. We have implemented standard procedures and policies to safeguard your personal information and prevent unauthorized access. Our use of Secure Socket Layer (SSL) technology enhances security measures.</li>
                  <li><strong>c.</strong> We have put in place procedures to deal with and control a situation where there is a possible breach of personal information. We will promptly notify you and any relevant regulatory authorities about the breach if it is mandated by law.</li>
                  <li><strong>d.</strong> Implementation of industry-standard security protocols to safeguard against unauthorized access, disclosure, alteration, or destruction of your personal information.</li>
                </Box>
              </Box>

              <Box id="retention" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  7. Retention of Information
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8 }}>
                  We keep your personal information only for the duration required to fulfill the purposes stated
                  in this Privacy Policy, unless the law requires or permits a longer retention period. We will
                  either delete or encrypt your information once it is no longer required.
                </Typography>
              </Box>

              <Box id="childrens-privacy" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  8. Children&apos;s Privacy
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8 }}>
                  Our website and services are not intended for individuals under the age of 18 (or the legal age
                  for iGaming in your jurisdiction). We do not knowingly collect or ask for personal information
                  from individuals under this age. If you believe that we may have inadvertently collected personal
                  information from a minor, please contact us, and we will promptly delete such information.
                </Typography>
              </Box>

              <Box id="your-rights" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  9. Your Rights and Choices
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 2 }}>
                  You have several options and rights when it comes to your personal information. These comprise:
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 1 } }}>
                  <li>The right to access and review the personal information we hold about you.</li>
                  <li>The right to correct, update, or delete any inaccurate or incomplete information we have about you.</li>
                  <li>The right to withdraw your approval for the processing of your personal information, where we rely on your approval as the legal basis for processing.</li>
                  <li>The right to opt-out of receiving marketing communications from us.</li>
                </Box>
              </Box>

              <Box id="cookie-policy" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  10. Our Cookie Policy
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, "& li": { mb: 1 } }}>
                  <li><strong>a.</strong> You consent to the collection of information about your online activities, such as tracking web traffic, your most-visited websites, and the websites you visit, by agreeing to our website&apos;s use of cookies.</li>
                  <li><strong>b.</strong> The information collected through cookies is utilized to personalize our website according to your preferences. Once the data is used for statistical analysis, it is completely removed from our systems.</li>
                  <li><strong>c.</strong> Please note that cookies do not grant us control over your computer in any way. Their sole purpose is to track the pages you find valuable and those you do not, enabling us to enhance your overall experience.</li>
                  <li><strong>d.</strong> You can turn off cookies by going to the settings page for your web browser.</li>
                </Box>
              </Box>

              <Box id="changes" sx={{ mb: 5, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  11. Changes to This Privacy Policy
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 2 }}>
                  We hold the right to alter or modify this privacy statement at any time. Any modifications will
                  become effective immediately after being posted on our website. We recommend reviewing this
                  Privacy Policy regularly to stay informed about the collection, usage, sharing, and protection of
                  your personal information.
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8 }}>
                  The Ocean Game takes your privacy seriously and is committed to protecting your personal
                  information. By using our website and services, you approve the collection, use, and sharing of
                  your personal information as outlined in this Privacy Policy. We will continue to review and
                  update our practices to ensure the highest level of privacy protection for our users.
                </Typography>
              </Box>

              <Box id="contact" sx={{ mb: 2, scrollMarginTop: SCROLL_OFFSET }}>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 }}>
                  12. Contact Us
                </Typography>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mb: 2 }}>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data
                  practices, please contact us:
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Typography sx={{ color: "grey.700", lineHeight: 1.6 }}>
                    <strong>Privacy Inquiries:</strong>{" "}
                    <a href="mailto:support@theoceangame.com" style={{ color: "#c62828" }}>support@theoceangame.com</a>
                  </Typography>
                </Box>
                <Typography sx={{ color: "grey.700", lineHeight: 1.8, mt: 2 }}>
                  We are committed to resolving any privacy concerns promptly and transparently. We will respond to
                  all inquiries within 30 days.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
