"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Link from "next/link";
import { ENDPOINTS } from "@/lib/api";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(ENDPOINTS.newsletterSubscribe, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (res.status === 429) {
        setMessage({
          type: "error",
          text: "Too many requests. Try again later.",
        });
        return;
      }
      if (!res.ok) {
        setMessage({
          type: "error",
          text: json?.error?.message ?? "Subscription failed.",
        });
        return;
      }
      const data = json.data ?? json;
      setMessage({
        type: "success",
        text: data.message ?? "Subscribed successfully!",
      });
      setEmail("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, mb: 1.5, color: "grey.300" }}
      >
        Newsletter
      </Typography>
      <Typography variant="body2" sx={{ color: "grey.400", mb: 1.5 }}>
        Subscribe to get the latest casino bonuses and exclusive offers
        delivered to your inbox.
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubscribe}
        sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
      >
        <TextField
          size="small"
          placeholder="Your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          sx={{
            flex: 1,
            minWidth: 140,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.08)",
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
              "&:hover fieldset": {
                borderColor: "rgba(255,255,255,0.3)",
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ minWidth: 44, px: 1 }}
          aria-label="Subscribe"
          disabled={loading}
        >
          <SendIcon fontSize="small" />
        </Button>
      </Box>
      {message && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            color: message.type === "success" ? "success.main" : "error.main",
          }}
        >
          {message.text}
        </Typography>
      )}
      <Typography
        component={Link}
        href="/newsletter/unsubscribe"
        variant="caption"
        sx={{
          display: "block",
          mt: 0.5,
          color: "grey.500",
          "&:hover": { color: "grey.400" },
        }}
      >
        Unsubscribe
      </Typography>
    </>
  );
}
