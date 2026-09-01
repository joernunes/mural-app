<div align="center">

# 📌 mural

**escreve. deixa. alguém vai encontrar.**

Um placar digital aberto onde qualquer pessoa pode deixar uma nota anónima — e qualquer pessoa pode ler. Sem contas, sem passwords, sem complicações. Só palavras num mural partilhado.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/joernunes/mural-app)

</div>

---

## ✨ O que torna o mural especial

| | Funcionalidade | Descrição |
|---|---|---|
| 🎨 | **Cores únicas** | Cada nota tem uma cor determinística baseada no seu ID — nunca se repetem, sempre consistentes |
| 👁️ | **Quem leu** | Cada vez que alguém abre uma nota, o seu nome fica registado como leitor |
| 💬 | **Respostas** | Qualquer pessoa pode responder a uma nota — conversas espontâneas entre desconhecidos |
| 🖼️ | **Preview social** | Links partilhados no WhatsApp, Twitter ou Discord geram uma imagem de preview dinâmica com o texto da nota |
| 🔗 | **Deep links** | Cada nota tem o seu próprio URL — partilha uma nota específica com qualquer pessoa |
| 🔍 | **Pesquisa** | Encontra notas por texto ou autor na galeria |
| 📱 | **Responsivo** | Funciona lindamente em qualquer ecrã — desktop, tablet ou telemóvel |

---

## 🖥️ Como funciona

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│             │     │              │     │             │
│  index.html │────▶│  /api/notes  │────▶│  Redis (KV) │
│  galeria.html│    │  /api/og     │     │             │
│             │     │  /api/nota/* │     │             │
└─────────────┘     └──────────────┘     └─────────────┘
    Frontend          Serverless API        Base de dados
```

- **`index.html`** — Landing page com hero animado, formulário para escrever notas e pré-visualização do mural
- **`galeria.html`** — Galeria completa com masonry grid, pesquisa em tempo real e contadores animados
- **`api/notes.js`** — `GET` lê notas · `POST` cria nota ou comentário · `PATCH` marca leitura
- **`api/og.js`** — Gera imagens de preview 1200×630 com o texto, autor e cor da nota
- **`api/nota/[id].js`** — Serve meta tags Open Graph para crawlers e redireciona humanos para a nota

---

## 🚀 Deploy em 3 minutos

### 1. Clona e envia para o GitHub

```bash
git clone https://github.com/joernunes/mural-app.git
cd mural-app
```

### 2. Importa na Vercel

- Vai a [vercel.com](https://vercel.com) → **Add New** → **Project**
- Escolhe o repositório `mural-app`
- Framework: **Other** (não precisa de build)
- Clica em **Deploy** 🎉

### 3. Liga a base de dados

- No projeto Vercel → separador **Storage**
- **Create Database** → escolhe **KV (Redis)** (plano gratuito disponível)
- Liga ao projeto — as variáveis de ambiente são adicionadas automaticamente
- Faz **Redeploy** para que as variáveis entrem em vigor

> 💡 **Alternativa**: Se já tens um Redis próprio, define a variável `REDIS_URL` nas Environment Variables do projeto.

---

## 🛠️ Desenvolvimento local

```bash
# Instala as dependências
npm install

# Liga ao projeto Vercel (necessário para acesso à KV)
npx vercel link

# Corre localmente
npx vercel dev
```

O servidor arranca em `http://localhost:3000` com acesso à mesma base de dados do projeto na Vercel.

---

## 📁 Estrutura do projeto

```
mural-app/
├── index.html          # Landing page + mural interativo
├── galeria.html        # Galeria de todas as notas
├── api/
│   ├── _db.js          # Conexão Redis/KV partilhada + helpers
│   ├── notes.js        # API de notas (CRUD + comentários)
│   ├── og.js           # Gerador de imagens Open Graph
│   └── nota/
│       └── [id].js     # Deep links com meta tags sociais
├── package.json
└── README.md
```

---

## 🎨 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML + CSS + JS vanilla (zero frameworks) |
| Tipografia | Space Grotesk + IBM Plex Mono |
| Backend | Vercel Serverless Functions (Node.js) |
| Base de dados | Redis via `ioredis` ou Vercel KV |
| Imagens OG | `@vercel/og` (geração dinâmica) |
| Hosting | Vercel (edge global) |

---

## 💡 Ideias futuras

- [ ] Moderação de conteúdo com palavras bloqueadas
- [ ] Reações com emojis nas notas
- [ ] Notificações quando alguém responde à tua nota
- [ ] Temas de cor personalizáveis por mural
- [ ] Murais privados com link secreto
- [ ] Export do mural como imagem ou PDF

---

<div align="center">

**feito com ❤️ por quem acredita que as palavras merecem um sítio para ficar**

*[mural-app-eight.vercel.app](https://mural-app-eight.vercel.app)*

</div>
