import { Hono } from "hono";
import { db } from "../db";
import { notaireClient } from "../integrations/notaire";
import { mailer } from "../integrations/mailer";

const DIX_JOURS_MS = 10 * 24 * 60 * 60 * 1000;
const TRENTE_JOURS_MS = 30 * 24 * 60 * 60 * 1000;

export const acceptationRoute = new Hono();

acceptationRoute.post("/offres/:id/acceptation", async (c) => {
  try {
    const offreId = c.req.param("id");
    const body = await c.req.json();

    const offre = await db.offre.findUnique({
      where: { id: offreId },
      include: { emprunteur: true, dossier: true },
    });

    if (!offre) {
      throw new Error("Offre introuvable");
    }

    console.log("Acceptation offre", { offre, signature: body });

    if (offre.statut === "ACCEPTEE") {
      throw new Error("Offre déjà acceptée");
    }

    const maintenant = new Date();
    const finDelaiReflexion = new Date(offre.dateReception!.getTime() + DIX_JOURS_MS);
    const dateExpiration = new Date(offre.dateEmission.getTime() + TRENTE_JOURS_MS);

    if (maintenant < finDelaiReflexion) {
      throw new Error("Délai de réflexion non écoulé");
    }
    if (maintenant > dateExpiration) {
      throw new Error("Offre expirée");
    }

    await db.offre.update({
      where: { id: offreId },
      data: {
        statut: "ACCEPTEE",
        dateAcceptation: maintenant,
        signatureId: body.signatureId,
      },
    });

    notaireClient.transmettreOffreAcceptee(offre.dossier.notaireId, offre);
    await mailer.envoyer(offre.emprunteur.email, "offre-acceptee", { offre });

    return c.json({ ok: true });
  } catch (e) {
    return c.json({ error: (e as Error).message }, 400);
  }
});
