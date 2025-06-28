# Návod na nasazení

Tento dokument obsahuje podrobné instrukce pro nasazení aplikace na různé platformy.

## 🏗️ Příprava buildu

Před nasazením je potřeba vytvořit produkční build:

```bash
npm run build
```

Tento příkaz vytvoří složku `dist/` s optimalizovanými soubory připravenými pro nasazení.

## 🌐 GitHub Pages

### Automatické nasazení pomocí GitHub Actions

1. Vytvořte soubor `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. V nastavení repozitáře povolte GitHub Pages pro branch `gh-pages`

### Manuální nasazení

1. Vytvořte build: `npm run build`
2. Nahrajte obsah složky `dist/` do branch `gh-pages`
3. Povolte GitHub Pages v nastavení repozitáře

## 📦 Tiiny.host

1. Vytvořte produkční build:
```bash
npm run build
```

2. Zabalte celý obsah složky `dist/` do ZIP souboru

3. Přejděte na https://tiiny.host/

4. Nahrajte ZIP soubor a získejte URL

5. Aplikace bude dostupná na poskytnuté adrese

## ⚡ Netlify

### Automatické nasazení z GitHubu

1. Přihlaste se na https://netlify.com
2. Klikněte na "New site from Git"
3. Vyberte váš GitHub repozitář
4. Nastavte:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Klikněte na "Deploy site"

### Manuální nasazení

1. Vytvořte build: `npm run build`
2. Přetáhněte složku `dist/` na Netlify dashboard
3. Aplikace bude automaticky nasazena

## 🔺 Vercel

### Automatické nasazení z GitHubu

1. Přihlaste se na https://vercel.com
2. Klikněte na "New Project"
3. Importujte váš GitHub repozitář
4. Vercel automaticky detekuje Vite projekt
5. Klikněte na "Deploy"

### Manuální nasazení pomocí CLI

1. Nainstalujte Vercel CLI:
```bash
npm i -g vercel
```

2. Přihlaste se:
```bash
vercel login
```

3. Nasaďte aplikaci:
```bash
vercel --prod
```

## 🐳 Docker

Vytvořte `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Sestavte a spusťte:
```bash
docker build -t rezervacni-system .
docker run -p 80:80 rezervacni-system
```

## 🔧 Konfigurace pro různá prostředí

### Base URL pro GitHub Pages

Pokud nasazujete na GitHub Pages s custom cestou, upravte `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/nazev-repozitare/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### Environment Variables

Pro různá prostředí můžete vytvořit soubory:
- `.env.development`
- `.env.production`
- `.env.local`

## 📊 Monitoring a Analytics

Po nasazení můžete přidat:

1. **Google Analytics** - přidejte tracking kód do `index.html`
2. **Sentry** - pro monitoring chyb
3. **Hotjar** - pro analýzu uživatelského chování

## 🔒 Bezpečnost v produkci

1. **HTTPS** - všechny moderní platformy poskytují HTTPS automaticky
2. **CSP Headers** - nastavte Content Security Policy
3. **Environment Variables** - nikdy necommitujte citlivé údaje

## 🚀 Optimalizace výkonu

1. **Lazy Loading** - komponenty se načítají podle potřeby
2. **Code Splitting** - automatické rozdělení kódu
3. **Asset Optimization** - Vite automaticky optimalizuje assety
4. **Caching** - nastavte správné cache headers

## 📱 PWA (Progressive Web App)

Pro přidání PWA funkcionalit nainstalujte:

```bash
npm install vite-plugin-pwa
```

A upravte `vite.config.ts`:

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
})
```

## 🆘 Řešení problémů

### Chyba 404 při refresh stránky

Přidejte `_redirects` soubor do `public/` složky:
```
/*    /index.html   200
```

### Problémy s routing

Ujistěte se, že server je nakonfigurován pro SPA aplikace.

### Build chyby

1. Zkontrolujte Node.js verzi (doporučeno 18+)
2. Smažte `node_modules` a `package-lock.json`
3. Spusťte `npm install` znovu