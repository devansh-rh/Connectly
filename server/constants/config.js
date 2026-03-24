const normalizeOrigin = (value = "") => value.trim().replace(/\/+$/, "");

const configuredClientOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || "").split(","),
]
  .map((origin) => normalizeOrigin(origin || ""))
  .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  ...configuredClientOrigins,
];

const isTrustedVercelOrigin = (origin = "") =>
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);

const isOriginAllowed = (origin = "") => {
  const normalized = normalizeOrigin(origin);
  if (!normalized) return true;

  return (
    allowedOrigins.includes(normalized) || isTrustedVercelOrigin(normalized)
  );
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) return callback(null, true);

    return callback(new Error("CORS origin not allowed"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

const CONNECTLY_TOKEN = "connectly-token";

export { corsOptions, CONNECTLY_TOKEN, allowedOrigins, isOriginAllowed };