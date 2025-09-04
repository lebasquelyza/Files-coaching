
# Files — Monorepo (Web + Mobile) dans **1 seul dossier**

- `apps/web` : Next.js 14 (tout le dashboard + fonctionnalités)
- `apps/mobile` : Expo React Native (écrans équivalents)
- `packages/ui` : **thème partagé** (couleurs, rayons, typos) — modifie `packages/ui/themes/default.css` pour refléter EXACTEMENT le thème de files-coaching.com
- `packages/config` : preset Tailwind & tsconfig

## Démarrage
```bash
pnpm i
pnpm dev:web       # lance le site web
pnpm dev:mobile    # lance Expo (app mobile)
```

## Thème identique au site
Ouvre `packages/ui/themes/default.css` et renseigne les variables `--brand`, `--bg`, `--surface`, `--text`, etc. avec les valeurs de files-coaching.com (tu auras automatiquement le même rendu web & mobile).

## Déploiement
- Web : Vercel recommandé (Next.js 14).
- Mobile : Expo EAS (Android/iOS).

## Fonctions à brancher pour la prod
Auth sécurisée, Google Sheets, push notifications serveur, stockage vidéo, connecteurs Santé/Fit.


## Landing publique
La page `/` affiche un header/hero alignés sur ton style (burger + badges + stats).