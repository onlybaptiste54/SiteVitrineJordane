# Deploiement VPS — vendreavecmerino.com

## Architecture

```
Internet
  │
  ▼
vendreavecmerino.com (DNS → 31.97.37.2)
  │
  ▼
┌─────────────────────────────────────────────────┐
│  VPS (31.97.37.2)                               │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Traefik (reverse proxy)                  │  │
│  │  - tourne dans ~/n8n-stack/compose.yml    │  │
│  │  - ecoute sur :80 et :443                 │  │
│  │  - certificat SSL auto (Let's Encrypt)    │  │
│  │  - certresolver = mytlschallenge          │  │
│  │  - redirect www → apex                    │  │
│  │  - redirect HTTP → HTTPS                  │  │
│  └──────────┬────────────────────────────────┘  │
│             │                                   │
│             │ reseau Docker "n8n-stack_default"  │
│             │ (tous les conteneurs Traefik-     │
│             │  routables sont sur ce reseau)     │
│             │                                   │
│  ┌──────────▼────────────────────────────────┐  │
│  │  Conteneur vendreavecmerino               │  │
│  │  - Next.js 16 (standalone)                │  │
│  │  - node server.js sur :3000               │  │
│  │  - Alpine Linux (~50MB)                   │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Pourquoi Docker + Traefik ?

Traefik tourne deja sur le VPS (dans `~/n8n-stack/compose.yml`). Il ecoute les ports 80/443
et route le trafic vers les conteneurs Docker en se basant sur les **labels**.

Pour qu'un nouveau site soit accessible en HTTPS, il suffit de :
1. Lancer un conteneur sur le meme reseau Docker que Traefik (`n8n-stack_default`)
2. Mettre les bons labels Traefik (domaine, certresolver, port)
3. Traefik detecte automatiquement le conteneur, genere le certificat SSL, et route le trafic

Pas besoin de nginx, pas besoin de certbot, pas besoin de config manuelle.

## Fichiers de deploiement

| Fichier | Role |
|---|---|
| `Dockerfile` | Build multi-stage de l'app Next.js (deps → build → runner) |
| `docker-compose.prod.yml` | Definit le conteneur + labels Traefik pour le routage et le SSL |
| `.dockerignore` | Exclut node_modules, .git, images, PDFs du build context |
| `jordanetunnel/next.config.ts` | `output: "standalone"` pour generer un serveur Node autonome |

### Dockerfile — 3 stages

1. **deps** : copie `package.json` + `package-lock.json` depuis `jordanetunnel/`, lance `npm ci`
2. **builder** : copie le code source de `jordanetunnel/`, lance `next build` → genere `.next/standalone`
3. **runner** : image finale legere (Alpine), copie uniquement le standalone + les statiques, tourne sous un user non-root `nextjs`

### docker-compose.prod.yml — labels Traefik

| Label | Role |
|---|---|
| `traefik.enable=true` | Traefik prend en charge ce conteneur |
| `traefik.http.routers.merino.rule=Host(...)` | Route les requetes pour le domaine |
| `traefik.http.routers.merino.entrypoints=websecure` | Entrypoint HTTPS (port 443) |
| `traefik.http.routers.merino.tls.certresolver=mytlschallenge` | Utilise le certresolver du VPS pour generer le certificat SSL |
| `traefik.http.middlewares.merino-www.*` | Redirige `www.` → apex (301 permanent) |
| `traefik.http.services.merino.loadbalancer.server.port=3000` | Port interne du conteneur |
| `traefik.docker.network=n8n-stack_default` | Force Traefik a utiliser ce reseau pour joindre le conteneur |

Le conteneur est connecte au reseau Docker `n8n-stack_default` — le meme que celui
ou tourne Traefik. C'est ce qui permet a Traefik de le decouvrir et de router le trafic.

## Valeurs specifiques au VPS

Ces valeurs viennent de la config Traefik dans `~/n8n-stack/compose.yml` :

| Parametre | Valeur | Origine |
|---|---|---|
| Reseau Docker | `n8n-stack_default` | Reseau cree par le compose n8n-stack |
| Certresolver | `mytlschallenge` | Nom defini dans les args Traefik (`--certificatesresolvers.mytlschallenge.acme.tlschallenge=true`) |
| Entrypoint HTTPS | `websecure` | Entrypoint defini dans les args Traefik |

Si ces valeurs changent sur le VPS, il faudra les mettre a jour dans `docker-compose.prod.yml`.

## Prerequis sur le VPS

- Docker et Docker Compose installes
- Traefik en place (via `~/n8n-stack/compose.yml`) avec :
  - le reseau `n8n-stack_default`
  - le certresolver `mytlschallenge`
  - les entrypoints `web` (80) et `websecure` (443)

## DNS

Chez Hostinger, enregistrements pour `vendreavecmerino.com` :

| Type | Nom | Valeur |
|---|---|---|
| A | @ | 31.97.37.2 |
| CNAME | www | @ |

## Deploiement

```bash
cd ~/SiteVitrineJordane
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Mise a jour du site

Meme commande — Docker rebuild uniquement les layers qui ont change :

```bash
cd ~/SiteVitrineJordane
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Commandes utiles

```bash
# Voir les logs en temps reel
docker logs -f vendreavecmerino

# Redemarrer le conteneur
docker compose -f docker-compose.prod.yml restart

# Arreter le site
docker compose -f docker-compose.prod.yml down

# Rebuild complet (supprime le cache)
docker compose -f docker-compose.prod.yml up -d --build --force-recreate

# Voir les conteneurs actifs
docker ps | grep merino
```

## Verification apres deploiement

```bash
# DNS ok ?
nslookup vendreavecmerino.com

# Conteneur tourne ?
docker ps | grep merino

# Site repond en HTTPS ?
curl -I https://vendreavecmerino.com

# Logs pas d'erreurs ?
docker logs --tail 20 vendreavecmerino
```

## Troubleshooting

| Probleme | Commande / Solution |
|---|---|
| Conteneur ne demarre pas | `docker logs vendreavecmerino` pour voir l'erreur |
| SSL pas genere | Verifier que le DNS pointe vers le VPS : `nslookup vendreavecmerino.com` |
| 502 Bad Gateway | Le conteneur est down ou Traefik ne le voit pas : `docker network inspect n8n-stack_default` — verifier que le conteneur y est |
| 404 Traefik | Les labels sont mal configures ou le reseau est pas le bon |
| Reseau/certresolver change | Verifier avec `docker network ls` et `cat ~/n8n-stack/compose.yml` |
