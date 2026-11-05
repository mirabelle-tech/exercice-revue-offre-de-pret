// Accès aux données. En production : Prisma + PostgreSQL.
// Ici, une implémentation en mémoire qui expose la même API, pour que le projet
// tourne sans base de données.

import type { Dossier, Emprunteur, Offre } from "./schema";

type OffreInclude = { emprunteur?: boolean; dossier?: boolean };

type OffreAvec<I extends OffreInclude | undefined> = Offre &
  (I extends { emprunteur: true } ? { emprunteur: Emprunteur } : {}) &
  (I extends { dossier: true } ? { dossier: Dossier } : {});

const tables = {
  emprunteurs: new Map<string, Emprunteur>(),
  dossiers: new Map<string, Dossier>(),
  offres: new Map<string, Offre>(),
};

let sequence = 0;
const nouvelId = (prefixe: string) => `${prefixe}_${(++sequence).toString().padStart(4, "0")}`;

export const db = {
  emprunteur: {
    async create({ data }: { data: Omit<Emprunteur, "id"> }): Promise<Emprunteur> {
      const emprunteur = { id: nouvelId("emp"), ...data };
      tables.emprunteurs.set(emprunteur.id, emprunteur);
      return structuredClone(emprunteur);
    },
  },

  dossier: {
    async create({ data }: { data: Omit<Dossier, "id"> }): Promise<Dossier> {
      const dossier = { id: nouvelId("dos"), ...data };
      tables.dossiers.set(dossier.id, dossier);
      return structuredClone(dossier);
    },
  },

  offre: {
    async create({ data }: { data: Omit<Offre, "id"> }): Promise<Offre> {
      const offre = { id: nouvelId("off"), ...data };
      tables.offres.set(offre.id, offre);
      return structuredClone(offre);
    },

    async findUnique<I extends OffreInclude | undefined = undefined>(args: {
      where: { id: string };
      include?: I;
    }): Promise<OffreAvec<I> | null> {
      const offre = tables.offres.get(args.where.id);
      if (!offre) return null;
      const resultat: Offre & Record<string, unknown> = { ...structuredClone(offre) };
      if (args.include?.emprunteur) {
        resultat.emprunteur = structuredClone(tables.emprunteurs.get(offre.emprunteurId));
      }
      if (args.include?.dossier) {
        resultat.dossier = structuredClone(tables.dossiers.get(offre.dossierId));
      }
      return resultat as OffreAvec<I>;
    },

    async update({ where, data }: { where: { id: string }; data: Partial<Omit<Offre, "id">> }): Promise<Offre> {
      const offre = tables.offres.get(where.id);
      if (!offre) throw new Error(`Record to update not found (offre ${where.id})`);
      const misAJour = { ...offre, ...data };
      tables.offres.set(where.id, misAJour);
      return structuredClone(misAJour);
    },
  },

  /** Vide toutes les tables (tests uniquement). */
  async reset(): Promise<void> {
    tables.emprunteurs.clear();
    tables.dossiers.clear();
    tables.offres.clear();
    sequence = 0;
  },
};
