import { db } from "../db";
import type { Offre } from "../schema";

export async function creerOffre(overrides: Partial<Omit<Offre, "id" | "dossierId" | "emprunteurId">> = {}): Promise<Offre> {
  const emprunteur = await db.emprunteur.create({
    data: {
      prenom: "Jeanne",
      nom: "Martin",
      email: "jeanne.martin@example.com",
      dateNaissance: new Date("1948-03-12"),
    },
  });
  const dossier = await db.dossier.create({
    data: { reference: "DOS-2026-0042", emprunteurId: emprunteur.id, notaireId: "not_paris_08" },
  });
  return db.offre.create({
    data: {
      dossierId: dossier.id,
      emprunteurId: emprunteur.id,
      version: 1,
      remplaceOffreId: null,
      statut: "EMISE",
      montant: 180_000,
      tauxAnnuel: 0.0545,
      dateEmission: new Date("2026-01-01"),
      dateReception: null,
      dateAcceptation: null,
      signatureId: null,
      ...overrides,
    },
  });
}
