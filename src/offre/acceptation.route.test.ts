import { describe, it, expect, vi } from "vitest";
import { app } from "../app";
import { creerOffre } from "../test/fixtures";

describe("POST /offres/:id/acceptation", () => {
  it("accepte une offre dans le délai", async () => {
    const offre = await creerOffre({
      statut: "RECUE",
      dateEmission: new Date("2026-01-01"),
      dateReception: new Date("2026-01-02"),
    });
    vi.setSystemTime(new Date("2026-01-20"));

    const res = await app.request(`/offres/${offre.id}/acceptation`, {
      method: "POST",
      body: JSON.stringify({ signatureId: "sig_123", offreId: offre.id }),
    });

    expect(res.status).toBe(200);
  });
});
