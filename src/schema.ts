// Modèle de données (équivalent de notre schéma Prisma, simplifié pour l'exercice).

export type StatutOffre =
  | "EMISE"
  | "ENVOYEE"
  | "RECUE"
  | "ACCEPTEE"
  | "EXPIREE"
  | "REMPLACEE";

export interface Emprunteur {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  dateNaissance: Date;
}

export interface Dossier {
  id: string;
  reference: string;
  emprunteurId: string;
  notaireId: string;
}

export interface Offre {
  id: string;
  dossierId: string;
  emprunteurId: string;
  version: number;
  /** Offre remplacée par celle-ci, le cas échéant. */
  remplaceOffreId: string | null;
  statut: StatutOffre;
  montant: number;
  tauxAnnuel: number;
  dateEmission: Date;
  /** Renseignée quand Youtrust nous notifie la réception de l'offre par l'emprunteur. */
  dateReception: Date | null;
  dateAcceptation: Date | null;
  /** Identifiant de la signature Youtrust. */
  signatureId: string | null;
}
