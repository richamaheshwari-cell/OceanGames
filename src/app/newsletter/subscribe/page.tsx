"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { ENDPOINTS } from "@/lib/api";

export default function NewsletterSubscribePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }
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
        setMessage({ type: "error", text: "Too many requests. Please try again later." });
        return;
      }

      if (!res.ok) {
        setMessage({ type: "error", text: (json as { error?: { message?: string } })?.error?.message ?? "Subscription failed. Please try again." });
        return;
      }

      const data = json.data ?? json;
      setMessage({ type: "success", text: data.message ?? "Thanks! Check your email to confirm your subscription." });
      setEmail("");
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, py: 6 }}>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Subscribe to Newsletter
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Get the latest casino news, bonus offers, and expert guides in your inbox.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          fullWidth
          autoComplete="email"
          disabled={loading}
        />
        <Button type="submit" variant="contained" color="primary" endIcon={<EmailIcon />} disabled={loading}>
          {loading ? "Subscribing…" : "Subscribe"}
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Want to stop receiving emails?{" "}
        <Link href="/newsletter/unsubscribe" style={{ color: "inherit", textDecoration: "underline" }}>
          Unsubscribe
        </Link>
      </Typography>
    </Box>
  );
}
