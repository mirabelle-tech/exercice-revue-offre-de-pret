// Client de l'API du notaire partenaire (simulé).

import type { Offre } from "../schema";

export const notaireClient = {
  async transmettreOffreAcceptee(notaireId: string, offre: Offre): Promise<void> {
    // En production : POST https://api.notaire-partenaire.fr/v1/dossiers
    await new Promise((resolve) => setTimeout(resolve, 10));
    console.info(`[notaire] offre ${offre.id} transmise au notaire ${notaireId}`);
  },
};
