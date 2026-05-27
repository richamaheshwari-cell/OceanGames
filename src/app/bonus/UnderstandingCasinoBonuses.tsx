import { Box, Typography } from "@mui/material";
import CardGiftcard from "@mui/icons-material/CardGiftcard";
import Sync from "@mui/icons-material/Sync";
import Description from "@mui/icons-material/Description";
import Percent from "@mui/icons-material/Percent";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Schedule from "@mui/icons-material/Schedule";
import Lightbulb from "@mui/icons-material/Lightbulb";

const CARDS = [
  {
    icon: CardGiftcard,
    iconBg: "#f97316",
    title: "What Are Casino Bonuses?",
    desc: "Promotional offers from online casinos to attract and reward players, including welcome bonuses, free spins, and cashback.",
  },
  {
    icon: Sync,
    iconBg: "#8b5cf6",
    title: "Wagering Requirements",
    desc: "The number of times you must play through a bonus before withdrawing. Lower requirements are more favorable.",
  },
  {
    icon: Description,
    iconBg: "#3b82f6",
    title: "Terms & Conditions",
    desc: "Key factors include minimum deposits, bet limits, game restrictions, expiration dates, and withdrawal limits.",
  },
  {
    icon: Percent,
    iconBg: "#22c55e",
    title: "RTP Impact",
    desc: "Higher RTP games give better odds of meeting wagering conditions. Choose wisely to maximize your bonus value.",
  },
  {
    icon: VerifiedUser,
    iconBg: "#eab308",
    title: "Bonus Verification",
    desc: "All bonuses are verified for authenticity, clear terms, and real value to ensure you get the best deals.",
  },
  {
    icon: Schedule,
    iconBg: "#ef4444",
    title: "Expiration Dates",
    desc: "Bonuses have time limits. Start with longer expiration periods to give yourself more time to meet requirements.",
  },
];

export function UnderstandingCasinoBonuses() {
  return (
    <Box component="section" sx={{ py: 6, px: 2, bgcolor: "background.paper" }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "grey.900", mb: 0.5 }}
          >
            Understanding Casino{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Bonuses
            </Box>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 560, mx: "auto" }}
          >
            Everything you need to know about casino bonuses, wagering
            requirements, and how to maximize your rewards
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 4,
          }}
        >
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Box
                key={card.title}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { borderColor: "primary.main", boxShadow: 1 },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    bgcolor: card.iconBg,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <Icon sx={{ fontSize: 24 }} />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 0.5, color: "grey.900" }}
                >
                  <Typography
                    component="h3"
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      color: "grey.900",
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                    }}
                  >
                    {card.title}
                  </Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.desc}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: "#fef7ed",
            borderLeft: "4px solid",
            borderColor: "primary.main",
          }}
        >
          <Lightbulb
            sx={{
              color: "primary.main",
              fontSize: 28,
              flexShrink: 0,
              mt: 0.25,
            }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 0.5, color: "grey.900" }}
            >
              <Typography
                component="h3"
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  color: "grey.900",
                  fontSize: { xs: "1.25rem", md: "1.5rem" },
                }}
              >
                Pro Tip
              </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Always start with bonuses that have lower wagering requirements
              and longer expiration periods. This gives you more time and better
              odds to meet the conditions and withdraw your winnings. Read the
              terms carefully and choose games with higher RTP to maximize your
              chances.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
