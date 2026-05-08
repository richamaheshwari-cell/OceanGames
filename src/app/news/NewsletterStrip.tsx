"use client";

import { useState } from "react";
import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { ENDPOINTS } from "@/lib/api";

export function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(ENDPOINTS.newsletterSubscribe, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage((json as { error?: { message?: string } }).error?.message ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setMessage("Thanks! Check your email to confirm.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <Box id="newsletter" component="section" sx={{ py: 4, px: 2, bgcolor: "grey.900", color: "white" }}>
      <Box sx={{ maxWidth: 560, mx: "auto", textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          Subscribe to News Updates
        </Typography>
        <Typography variant="body2" sx={{ color: "grey.400", mb: 2 }}>
          Get the latest casino industry news and breaking stories in your inbox.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1, maxWidth: 400, mx: "auto" }}>
            <TextField
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              required
              size="small"
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "grey.800",
                  color: "white",
                  "& fieldset": { borderColor: "grey.600" },
                  "&:hover fieldset": { borderColor: "grey.500" },
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={status === "loading"} sx={{ minWidth: 120 }}>
              {status === "loading" ? <CircularProgress size={24} color="inherit" /> : "Subscribe"}
            </Button>
          </Box>
          {message && (
            <Typography variant="body2" sx={{ mt: 1.5, color: status === "success" ? "primary.light" : "error.light" }}>
              {message}
            </Typography>
          )}
        </form>
      </Box>
    </Box>
  );
}
