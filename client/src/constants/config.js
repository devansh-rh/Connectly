const rawServer = import.meta.env.VITE_SERVER?.trim();
const hasValidProtocol = /^https?:\/\//i.test(rawServer || "");
const defaultDevServer = "http://localhost:3000";

// In production (e.g. Vercel), VITE_SERVER should point to your deployed backend URL.
export const server = (
	hasValidProtocol
		? rawServer
		: import.meta.env.DEV
			? defaultDevServer
			: ""
).replace(/\/+$/, "");

if (!server && import.meta.env.PROD) {
	console.warn("VITE_SERVER is missing or invalid. Configure it in your deployment environment.");
}