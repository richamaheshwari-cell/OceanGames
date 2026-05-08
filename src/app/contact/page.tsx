"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/X";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { JsonLdScript } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo";

const META_TITLE = "Contact Us | TheOceanGame";
const META_DESC =
  "Get in touch with TheOceanGame. Send your questions, feedback, or partnership inquiries. We're here to help.";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Partnership",
  "Feedback",
  "Support",
  "Other",
];

const FAQ_ITEMS = [
  {
    q: "How do you review casinos?",
    a: "We evaluate casinos based on licensing, game variety, bonuses, payment methods, customer support, and user experience. Our team tests each site and compiles detailed, unbiased reviews.",
  },
  {
    q: "Are your reviews biased?",
    a: "No. We maintain editorial independence. While we may earn from affiliate links, our reviews and rankings are based on research and analysis. We only recommend sites that meet our quality standards.",
  },
  {
    q: "How can I submit a casino for review?",
    a: "You can suggest a casino for review by contacting us through this form. Select \"Partnership\" or \"General Inquiry\" and include the casino name and any relevant details. We consider all requests.",
  },
  {
    q: "Do you offer gaming advice?",
    a: "We provide informational content about games, bonuses, and responsible gaming. We do not give personalized financial or legal advice. For problem gaming support, see our Responsible Gaming page.",
  },
  {
    q: "How often do you update reviews?",
    a: "We review and update our content regularly to reflect current offers, terms, and site changes. Major reviews are revisited at least quarterly, and we note the last update date on each piece.",
  },
];

const SOCIAL = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: TwitterIcon, href: "#", label: "X" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: YouTubeIcon, href: "#", label: "YouTube" },
];

const MAX_MESSAGE_LENGTH = 500;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !subject || !message.trim()) return;
    setSent(true);
    setFullName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact" },
        ])}
      />
      <JsonLdScript
        data={buildWebPageJsonLd({ slug: "contact", title: META_TITLE, shortDesc: META_DESC }, "pages")}
      />

      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 6 }}>
        {/* Hero */}
        <Box sx={{ pt: { xs: 10, md: 16 }, pb: { xs: 6, md: 8 }, px: 2, bgcolor: "#0d0d0d" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Box sx={{ fontSize: "0.875rem", color: "grey.400", mb: 3 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ margin: "0 0.35rem" }}>/</span>
              <span style={{ color: "white" }}>Contact Us</span>
            </Box>
            <Typography
              component="h1"
              sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, color: "white", mb: 2 }}
            >
              Get in Touch
            </Typography>
            <Typography sx={{ color: "grey.300", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 720 }}>
              Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you. Our team is here to
              help.
            </Typography>
          </Box>
        </Box>

        {/* Main */}
        <Box component="main" sx={{ maxWidth: 1200, mx: "auto", pt: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 5 } }}>
          {sent && (
            <Alert
              severity="success"
              onClose={() => setSent(false)}
              sx={{ mb: 1 }}
            >
              Your message has been sent. We&apos;ll get back to you soon.
            </Alert>
          )}

          {/* Two columns: form + contact info & follow */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
              gap: 4,
              alignItems: "start",
              py: { xs: 3, md: 4 },
            }}
          >
            {/* Left: Form */}
            <Box sx={{ pr: { lg: 2 } }}>
              <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2.5 }}>
                Send Us a Message
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                <TextField
                  label="Full Name"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  label="Email Address"
                  required
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  select
                  label="Subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                >
                  <MenuItem value="">Select a subject</MenuItem>
                  {SUBJECT_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Message"
                  required
                  placeholder="Tell us how we can help you..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH))}
                  multiline
                  rows={5}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  inputProps={{ maxLength: MAX_MESSAGE_LENGTH }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Typography variant="body2" sx={{ color: "grey.500", mt: -1 }}>
                  Maximum {MAX_MESSAGE_LENGTH} characters
                </Typography>
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  size="large"
                  startIcon={<SendIcon />}
                  sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, borderRadius: 2, py: 1.5, px: 3 }}
                >
                  Send Message
                </Button>
              </Box>
            </Box>

            {/* Right: Contact info + Follow Us */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2.5 }}>
                  Contact Information
                </Typography>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    bgcolor: "grey.50",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: "rgba(211, 47, 47, 0.12)",
                        color: "error.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EmailOutlinedIcon />
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: "grey.900" }}>Email Us</Typography>
                  </Box>
                  <Typography
                    component="a"
                    href="mailto:support@theoceangame.com"
                    sx={{ color: "grey.700", fontSize: "0.9375rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                  >
                    support@theoceangame.com
                  </Typography>
                </Box>
              </Box>

            </Box>
          </Box>

          {/* FAQ - full width below */}
          <Box sx={{ mt: 1 }}>
            <Typography component="h2" sx={{ fontSize: "1.5rem", fontWeight: 700, color: "grey.900", mb: 3 }}>
              Frequently Asked Questions
            </Typography>
            <Box sx={{ "& .MuiAccordion-root": { boxShadow: "none", "&:before": { display: "none" }, border: "1px solid", borderColor: "grey.200", borderRadius: "8px !important", mb: 1.5, "&.Mui-expanded": { my: 0 } } }}>
              {FAQ_ITEMS.map((item, i) => (
                <Accordion key={i} defaultExpanded={i === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ "& .MuiAccordionSummary-content": { my: 1.5 } }}>
                    <Typography sx={{ fontWeight: 600, color: "grey.900" }}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                    <Typography sx={{ color: "grey.700", lineHeight: 1.7 }}>{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
