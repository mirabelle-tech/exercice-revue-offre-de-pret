import { Hono } from "hono";
import { acceptationRoute } from "./offre/acceptation.route";

export const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));
app.route("/", acceptationRoute);
