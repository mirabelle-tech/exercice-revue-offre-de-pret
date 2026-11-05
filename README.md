# Exercice — revue de code : offre de prêt

Extrait simplifié de notre plateforme de prêt viager hypothécaire, utilisé pendant l'entretien technique.

Tu n'as rien à préparer : on te présentera le contexte métier pendant l'entretien. Si tu veux jeter un œil avant, ou faire tourner le code pendant la revue :

```sh
npm install
npm test          # tests (Vitest)
npm run typecheck # vérification TypeScript
npm run dev       # API sur http://localhost:3000
```

Node 20 ou plus.

## Organisation

| Chemin | Rôle |
|---|---|
| `src/schema.ts` | Modèle de données (offre, dossier, emprunteur) |
| `src/db.ts` | Accès aux données ; en mémoire ici, Prisma + PostgreSQL en production |
| `src/integrations/` | Clients des services externes (notaire, e-mails), simulés |
| `src/app.ts` | Application [Hono](https://hono.dev) |
| `src/test/` | Fixtures et configuration des tests |

Les intégrations et la base sont simulées : le code tourne sans Docker ni accès réseau.
