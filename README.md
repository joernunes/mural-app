# Mural

Site + API pronta para a Vercel. As notas ficam guardadas numa base de dados
KV (Redis) partilhada — é por isso que qualquer visitante vê o mesmo mural.

## Estrutura

- `index.html` — a página (visual, formulário, mural).
- `api/notes.js` — função serverless: GET lê as notas, POST cria uma nota,
  PATCH marca "lido por".
- `package.json` — só precisa do pacote `@vercel/kv`.

## Publicar (passo a passo)

1. **Cria um repositório no GitHub** e envia esta pasta para lá:
   ```
   git init
   git add .
   git commit -m "mural inicial"
   git branch -M main
   git remote add origin <o-teu-repositorio-github>
   git push -u origin main
   ```

2. **Importa o repositório na Vercel**
   - Vai a vercel.com → *Add New* → *Project* → escolhe o repositório.
   - Framework preset: deixa em "Other" (não precisa de build command).
   - Clica em *Deploy*. Vai ficar online, mas o mural ainda não vai
     guardar nada — falta ligar a base de dados (passo seguinte).

3. **Cria a base de dados KV**
   - Dentro do projeto na Vercel, vai ao separador **Storage**.
   - *Create Database* → escolhe **KV** (Redis, tem plano gratuito).
   - Dá-lhe um nome e liga-a a este projeto quando for pedido — a Vercel
     adiciona automaticamente as variáveis de ambiente necessárias
     (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.).

4. **Volta a publicar**
   - Separador **Deployments** → nos três pontinhos do último deployment →
     *Redeploy*. (Precisa disto porque as variáveis de ambiente só entram
     em vigor depois de um novo deployment.)

5. Abre o URL do projeto — o mural já guarda e mostra as notas para
   qualquer pessoa que visite o link.

## Testar localmente (opcional)

```
npm install -g vercel
npm install
vercel dev
```
A Vercel CLI liga automaticamente à mesma base de dados KV do projeto
(depois de fazeres `vercel link`).

## Onde mexer a seguir

- Preços e planos: no `<section id="precos">` do `index.html` — por agora
  os botões de checkout não estão ligados a nada, é preciso um sistema de
  pagamentos (ex. Stripe) para cobrar de verdade.
- Limite de notas do plano grátis, moderação, contas de utilizador: ainda
  não existem — o mural atual é público e sem autenticação.
