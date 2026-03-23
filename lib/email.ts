type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const RESEND_API_BASE = "https://api.resend.com/emails";

function getSender() {
  return process.env.EMAIL_FROM || "BuildLink <no-reply@buildlink.local>";
}

function getApiKey() {
  return process.env.RESEND_API_KEY || "";
}

export async function sendTransactionalEmail(payload: EmailPayload) {
  const apiKey = getApiKey();
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("RESEND_API_KEY is missing; skipping email send.");
    }
    return;
  }

  const res = await fetch(RESEND_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getSender(),
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Failed to send transactional email", res.status, body);
  }
}
