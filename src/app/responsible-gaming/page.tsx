"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MoodBadIcon from "@mui/icons-material/MoodBad";
import HomeIcon from "@mui/icons-material/Home";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import BlockIcon from "@mui/icons-material/Block";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { JsonLdScript } from "@/components/JsonLd";
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from "@/lib/seo";

const META_TITLE = "Responsible Gaming | TheOceanGame";
const META_DESC =
  "At TheOceanGame we promote responsible gaming. Learn warning signs, self-assessment, and how to set your limits.";

const SECTIONS = [
  { id: "warning-signs", label: "Warning Signs" },
  { id: "self-assessment", label: "Self-Assessment" },
  { id: "set-your-limits", label: "Set Your Limits" },
];

const SCROLL_OFFSET = 120;

const SECTION_SX = { mb: 5, scrollMarginTop: SCROLL_OFFSET };
const H2_SX = { fontSize: "1.25rem", fontWeight: 700, color: "grey.900", mb: 2 };
const BODY_SX = { color: "grey.700", lineHeight: 1.8, mb: 2 };

const WARNING_SIGNS = [
  { icon: AccessTimeIcon, title: "Spending Too Much Time", text: "Gaming for longer periods than intended or losing track of time while playing." },
  { icon: AttachMoneyIcon, title: "Chasing Losses", text: "Trying to win back money you have lost by playing more, often with larger bets." },
  { icon: MoodBadIcon, title: "Neglecting Responsibilities", text: "Ignoring work, family, or personal obligations because of gaming activities." },
  { icon: HomeIcon, title: "Financial Problems", text: "Borrowing money, selling possessions, or struggling to pay bills due to gaming." },
  { icon: ChatBubbleOutlineIcon, title: "Lying About Gaming", text: "Hiding the extent of your gaming from family, friends, or loved ones." },
  { icon: FavoriteIcon, title: "Emotional Distress", text: "Feeling anxious, depressed, or irritable when not playing or after losing." },
];

const SELF_ASSESSMENT_QUESTIONS = [
  "Do you often play longer than you planned?",
  "Have you ever lied to family or friends about your gaming?",
  "Do you feel restless or irritable when trying to cut down on gaming?",
  "Have you tried to win back money you lost by playing more?",
  "Has gaming caused problems in your relationships or work?",
  "Have you borrowed money or sold possessions to play?",
  "Do you play to escape problems or relieve feelings of anxiety or depression?",
  "Have you jeopardized a job, relationship, or opportunity because of gaming?",
];

const LIMIT_CARDS = [
  { icon: AccountBalanceWalletIcon, title: "Deposit Limits", text: "Set a maximum amount you can deposit daily, weekly, or monthly to control spending." },
  { icon: ScheduleIcon, title: "Time Limits", text: "Decide in advance how long you will play and stick to it. Use alarms or reminders." },
  { icon: TrendingDownIcon, title: "Loss Limits", text: "Set a maximum amount you are willing to lose in a session and stop when reached." },
  { icon: BlockIcon, title: "Self-Exclusion", text: "Voluntarily ban yourself from gaming sites for a set period or permanently." },
];

const ADDITIONAL_TIPS = [
  "Never play with money you cannot afford to lose",
  "Do not play when under the influence of alcohol or drugs",
  "Take regular breaks and do not play for extended periods",
  "Balance gaming with other activities and hobbies",
  "Never chase your losses or try to win back money",
  "Keep track of the time and money you spend gaming",
];

export default function ResponsibleGamingPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: `-${SCROLL_OFFSET}px 0px -66% 0px` }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <JsonLdScript
        data={buildBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Responsible Gaming", url: "/responsible-gaming" },
        ])}
      />
      <JsonLdScript
        data={buildWebPageJsonLd(
          { slug: "responsible-gaming", title: META_TITLE, shortDesc: META_DESC },
          "pages"
        )}
      />

      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", pb: 6 }}>
        {/* Hero */}
        <Box sx={{ pt: { xs: 10, md: 16 }, pb: { xs: 6, md: 8 }, px: 2, bgcolor: "#b71c1c" }}>
          <Box sx={{ maxWidth: 1200, mx: "auto" }}>
            <Box sx={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", mb: 3 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Home
              </Link>
              <span style={{ margin: "0 0.35rem" }}>/</span>
              <span style={{ color: "white" }}>Responsible Gaming</span>
            </Box>
            <Typography component="h1" sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, fontWeight: 700, color: "white", mb: 2 }}>
              Responsible Gaming
            </Typography>
            <Typography sx={{ color: "white", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 720, mb: 3 }}>
              At TheOceanGame, we believe gaming should be entertaining and enjoyable. We are committed to promoting
              responsible gaming practices and providing resources to help players stay in control. If gaming stops
              being fun, it&apos;s time to take action.
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.2)",
                maxWidth: 520,
              }}
            >
              <InfoOutlinedIcon sx={{ color: "white", mt: 0.25, flexShrink: 0 }} />
              <Typography sx={{ color: "white", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                18+ Only — You must be 18 years or older to play. Underage gaming is illegal.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main: flex + sticky sidebar + content */}
        <Box component="main" sx={{ maxWidth: 1200, mx: "auto", pt: { xs: 10, md: 12 }, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", lg: "row" }, alignItems: "flex-start" }}>
            {/* Sidebar - On This Page, 3 tabs only; hidden on mobile */}
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
              <Box>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "grey.900",
                    mb: 1.5,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  On This Page
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                  {SECTIONS.map((s) => (
                    <Box
                      key={s.id}
                      component="button"
                      onClick={() => scrollToSection(s.id)}
                      sx={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                        px: 1.5,
                        py: 1,
                        borderRadius: 1,
                        fontSize: "0.875rem",
                        bgcolor: activeSection === s.id ? "rgba(211, 47, 47, 0.08)" : "transparent",
                        color: activeSection === s.id ? "error.main" : "grey.600",
                        fontWeight: activeSection === s.id ? 600 : 500,
                        "&:hover": {
                          bgcolor: activeSection === s.id ? "rgba(211, 47, 47, 0.08)" : "grey.100",
                          color: activeSection === s.id ? "error.main" : "grey.900",
                        },
                      }}
                    >
                      {s.label}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Content */}
            <Box component="article" sx={{ flex: 1, minWidth: 0, maxWidth: 720 }}>
              <Box id="warning-signs" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  Know the Warning Signs
                </Typography>
                <Typography sx={BODY_SX}>
                  Problem gaming can affect anyone. Recognizing the warning signs early is crucial for getting help
                  before gaming becomes a serious issue. If you or someone you know exhibits any of these behaviors, it
                  may be time to seek support.
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  {WARNING_SIGNS.map(({ icon: Icon, title, text }) => (
                    <Box
                      key={title}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        bgcolor: "grey.50",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "error.main", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography component="h3" sx={{ fontSize: "1rem", fontWeight: 600, color: "grey.900" }}>
                          {title}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "grey.700", lineHeight: 1.6 }}>{text}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box id="self-assessment" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  Self-Assessment Checklist
                </Typography>
                <Typography sx={BODY_SX}>
                  Answer these questions honestly. If you answer &quot;yes&quot; to several of these questions, you may have a
                  gaming problem and should consider seeking professional help.
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {SELF_ASSESSMENT_QUESTIONS.map((q, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        bgcolor: "grey.50",
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: "error.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </Box>
                      <Typography sx={{ fontSize: "0.9375rem", color: "grey.800", lineHeight: 1.6, pt: 0.25 }}>
                        {q}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "error.main",
                    color: "white",
                    mt: 3,
                  }}
                >
                  <InfoOutlinedIcon sx={{ flexShrink: 0, mt: 0.25 }} />
                  <Typography sx={{ fontSize: "0.9375rem", lineHeight: 1.6 }}>
                    Need Help? If you answered &quot;yes&quot; to 3 or more questions, we strongly recommend reaching out to a
                    professional support organization. Help is available, and recovery is possible.
                  </Typography>
                </Box>
              </Box>

              <Box id="set-your-limits" sx={SECTION_SX}>
                <Typography component="h2" sx={H2_SX}>
                  Set Your Limits
                </Typography>
                <Typography sx={BODY_SX}>
                  Setting limits is one of the most effective ways to play responsibly. Most reputable sites offer
                  tools to help you control your gaming behavior. Use these features to stay in control.
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 4 }}>
                  {LIMIT_CARDS.map(({ icon: Icon, title, text }) => (
                    <Box
                      key={title}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        bgcolor: "grey.50",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "error.main", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon sx={{ fontSize: 20 }} />
                        </Box>
                        <Typography component="h3" sx={{ fontSize: "1rem", fontWeight: 600, color: "grey.900" }}>
                          {title}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: "0.875rem", color: "grey.700", lineHeight: 1.6 }}>{text}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ p: 3, borderRadius: 2, bgcolor: "grey.900", color: "white" }}>
                  <Typography component="h3" sx={{ fontSize: "1.125rem", fontWeight: 700, mb: 2 }}>
                    Additional Tips for Safe Gaming
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 0, listStyle: "none", "& li": { display: "flex", alignItems: "flex-start", gap: 1, mb: 1, lineHeight: 1.6 } }}>
                    {ADDITIONAL_TIPS.map((tip, i) => (
                      <li key={i}>
                        <CheckCircleOutlineIcon sx={{ color: "inherit", fontSize: 20, mt: 0.2, flexShrink: 0 }} aria-hidden />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* CTA */}
              <Box sx={{ mt: 6, p: 3, borderRadius: 2, bgcolor: "error.main", color: "white", textAlign: "center" }}>
                <FavoriteBorderIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                <Typography component="h2" sx={{ fontSize: "1.25rem", fontWeight: 700, mb: 1.5 }}>
                  Remember: Help is Always Available
                </Typography>
                <Typography sx={{ fontSize: "0.9375rem", lineHeight: 1.6, mb: 2, maxWidth: 480, mx: "auto" }}>
                  Problem gaming is a serious issue, but recovery is possible. If you or someone you care about is
                  struggling, do not hesitate to reach out for support. You are not alone.
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
                  <Button component={Link} href="/contact" variant="outlined" sx={{ borderColor: "white", color: "white", "&:hover": { borderColor: "grey.300", bgcolor: "rgba(255,255,255,0.08)" } }}>
                    Contact Us
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
