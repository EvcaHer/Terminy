# Rezervační systém termínů

Moderní webová aplikace pro správu a rezervaci termínů vytvořená v React.js s TypeScript a Tailwind CSS.

## 🚀 Funkce

- **Veřejný pohled** - zobrazení dostupných termínů a registrace
- **Administrátorský panel** - správa termínů, přehled účastníků
- **Responzivní design** - optimalizováno pro všechna zařízení
- **Lokální úložiště** - data se ukládají v prohlížeči
- **Validace formulářů** - kontrola vstupních dat
- **Moderní UI** - čisté a intuitivní uživatelské rozhraní

## 📋 Požadavky

- Node.js (verze 18 nebo vyšší)
- npm nebo yarn

## 🛠️ Instalace

1. Klonujte repozitář:
```bash
git clone https://github.com/[username]/rezervacni-system.git
cd rezervacni-system
```

2. Nainstalujte závislosti:
```bash
npm install
```

3. Spusťte vývojový server:
```bash
npm run dev
```

4. Otevřete prohlížeč na adrese `http://localhost:5173`

## 🔧 Dostupné příkazy

- `npm run dev` - spustí vývojový server
- `npm run build` - vytvoří produkční build
- `npm run preview` - náhled produkčního buildu
- `npm run lint` - kontrola kódu pomocí ESLint

## 👤 Administrátorské přihlášení

Pro přístup k administrátorskému panelu použijte:
- **Uživatelské jméno:** `admin`
- **Heslo:** `admin123`

## 🏗️ Struktura projektu

```
src/
├── components/          # React komponenty
│   ├── AdminLogin.tsx   # Přihlašovací formulář
│   ├── AdminPanel.tsx   # Administrátorský panel
│   ├── Header.tsx       # Hlavička aplikace
│   ├── PublicView.tsx   # Veřejný pohled
│   ├── RegistrationModal.tsx # Modal pro registraci
│   ├── TerminCard.tsx   # Karta termínu
│   └── TerminForm.tsx   # Formulář pro termíny
├── contexts/            # React kontexty
│   └── AuthContext.tsx  # Autentizační kontext
├── hooks/               # Custom React hooks
│   └── useLocalStorage.ts # Hook pro localStorage
├── types/               # TypeScript typy
│   └── index.ts         # Definice typů
├── App.tsx              # Hlavní komponenta
├── main.tsx             # Entry point
└── index.css            # Globální styly
```

## 🎨 Technologie

- **React 18** - UI knihovna
- **TypeScript** - typovaný JavaScript
- **Tailwind CSS** - utility-first CSS framework
- **Vite** - build tool a dev server
- **Lucide React** - ikony

## 📱 Funkčnost

### Veřejný pohled
- Zobrazení všech dostupných termínů
- Filtrování a vyhledávání termínů
- Registrace na termíny
- Zobrazení počtu volných míst
- Responsive design

### Administrátorský panel
- Vytváření nových termínů
- Úprava existujících termínů
- Mazání termínů
- Přehled všech registrovaných účastníků
- Statistiky a přehledy

## 🔒 Bezpečnost

- Jednoduchá autentizace pro demo účely
- Validace všech formulářových dat
- Ochrana proti duplicitním registracím
- Kontrola kapacity termínů

## 📦 Deployment

### GitHub Pages
1. Vytvořte build: `npm run build`
2. Nahrajte obsah složky `dist/` na GitHub Pages

### Tiiny.host
1. Vytvořte build: `npm run build`
2. Zabalte obsah složky `dist/` do ZIP souboru
3. Nahrajte na https://tiiny.host/

### Netlify/Vercel
1. Připojte GitHub repozitář
2. Nastavte build command: `npm run build`
3. Nastavte publish directory: `dist`

## 🤝 Přispívání

1. Forkněte projekt
2. Vytvořte feature branch (`git checkout -b feature/nova-funkcnost`)
3. Commitněte změny (`git commit -am 'Přidána nová funkcnost'`)
4. Pushněte do branch (`git push origin feature/nova-funkcnost`)
5. Vytvořte Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí - viz [LICENSE](LICENSE) soubor pro detaily.

## 📞 Kontakt

Pro otázky nebo návrhy vytvořte issue v tomto repozitáři.