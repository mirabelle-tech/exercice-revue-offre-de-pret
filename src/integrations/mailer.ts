// Envoi d'e-mails transactionnels (simulé).

export type TemplateMail = "offre-emise" | "offre-recue" | "offre-acceptee" | "offre-expiree";

export const mailer = {
  async envoyer(destinataire: string, template: TemplateMail, _donnees: Record<string, unknown>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 5));
    console.info(`[mailer] ${template} envoyé à ${destinataire}`);
  },
};
