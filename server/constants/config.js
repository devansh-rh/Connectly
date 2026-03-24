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

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

const CONNECTLY_TOKEN = "connectly-token";

export { corsOptions, CONNECTLY_TOKEN };