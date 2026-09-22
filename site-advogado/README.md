# Site — [Nome do Escritório]

Site estático (HTML/CSS/JS puro, sem build tools) pronto para deploy no Cloudflare Pages via GitHub.

## Estrutura

```
site-advogado/
├── index.html              → Página inicial
├── sobre.html               → Sobre o advogado/escritório
├── areas-de-pratica.html    → Detalhe das áreas de prática
├── contacto.html             → Contacto + formulário
├── css/
│   └── style.css             → Design system (cores, tipografia, componentes)
├── js/
│   └── main.js                → Menu mobile, ano automático, envio do formulário
└── README.md
```

Não há passo de build — os ficheiros podem ser servidos diretamente como estão.

## 1. Substituir os placeholders

Todo o conteúdo de exemplo está marcado entre parênteses retos, ex: `[Nome do Escritório]`,
`[email@escritorio.pt]`. Os principais pontos a rever, ficheiro a ficheiro:

- **Todas as páginas** (repetido no `<header>` e no `<footer>` de cada `.html`):
  - `[Nome]` na marca do cabeçalho
  - `[Nome do Escritório]`, morada, número de inscrição na Ordem, email e telefone no rodapé
  - `<title>` e `<meta name="description">` no `<head>`
- **index.html**: título do hero, estatísticas (`[XX] anos`, `[XXX]+ casos`, nº de Ordem), texto de "Sobre" resumido
- **sobre.html**: biografia, formação académica, credenciais
- **areas-de-pratica.html**: parágrafos `[Detalhar exemplos concretos…]` em cada área
- **contacto.html**: morada, telefone, horário, e o `action` do formulário (ver secção 2)

Dica: procura por `[` em todos os ficheiros do projeto para encontrar rapidamente tudo o que falta editar:

```bash
grep -rn "\[" --include="*.html" .
```

### Fotografias

Há dois placeholders de imagem (`.bio-photo` em `index.html` e `sobre.html`). Substituir o
`<div class="bio-photo">…</div>` por uma tag `<img src="assets/foto.jpg" alt="...">` depois de
colocar a fotografia real na pasta `assets/`.

### Mapa

Em `contacto.html`, o bloco `.map-placeholder` pode ser substituído por um `<iframe>` do
Google Maps depois de teres a morada real (Google Maps → Partilhar → Incorporar um mapa).

## 2. Configurar o formulário de contacto (Formspree)

O formulário envia o email via [Formspree](https://formspree.io) — um serviço gratuito (até
50 submissões/mês no plano free) que recebe o POST do formulário e reencaminha para o email
configurado. Não é necessário servidor próprio.

1. Criar conta gratuita em https://formspree.io
2. Criar um novo formulário ("New Form") e indicar o email de destino
3. Copiar o ID do formulário (algo como `xyzabcde`)
4. Em `contacto.html`, substituir `YOUR_FORM_ID` no atributo `action` do `<form>`:

   ```html
   <form id="contact-form" action="https://formspree.io/f/xyzabcde" method="POST">
   ```

5. Guardar e publicar

**Para trocar o email de destino mais tarde**, não é preciso editar código nenhum — basta
alterar o email associado ao formulário no painel do Formspree (Settings → Email).

O formulário já inclui:
- Envio via JavaScript (AJAX) com mensagem de sucesso/erro sem sair da página
- Um campo "honeypot" simples anti-spam (`_gotcha`, invisível para utilizadores)
- Fallback: mesmo sem JavaScript ativo, o formulário submete de forma nativa para o Formspree

> Alternativas ao Formspree, caso prefiras: [Web3Forms](https://web3forms.com) (gratuito, sem
> conta obrigatória) ou uma Cloudflare Pages Function própria, caso queiras mais controlo.

## 3. Deploy via GitHub + Cloudflare Pages

1. Criar um repositório novo no GitHub e enviar esta pasta:

   ```bash
   cd site-advogado
   git init
   git add .
   git commit -m "Site inicial"
   git branch -M main
   git remote add origin https://github.com/<utilizador>/<repositorio>.git
   git push -u origin main
   ```

2. Em [Cloudflare Pages](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Selecionar o repositório
4. Nas definições de build:
   - **Framework preset**: `None`
   - **Build command**: (deixar vazio)
   - **Build output directory**: `/`
5. **Save and Deploy**

Qualquer `git push` para `main` a partir daqui faz deploy automático da nova versão.

### Domínio próprio

Depois do primeiro deploy, em **Custom domains** no projeto Cloudflare Pages, associar o
domínio do escritório (o domínio deve estar gerido na mesma conta Cloudflare, ou apontar o
DNS conforme as instruções apresentadas).

## Notas técnicas

- Tipografia: Google Fonts (Playfair Display + Inter), carregada via `<link>` no `<head>`
- Sem dependências/frameworks — apenas HTML, CSS e JavaScript vanilla
- Layout responsivo (testado mentalmente para breakpoints em ~860px e ~640px); o menu mobile
  usa um botão hambúrguer definido em `js/main.js`
- Cores e espaçamentos centralizados em variáveis CSS no topo de `css/style.css`
  (`:root { --color-navy-900: …; }`) — alterar ali é suficiente para atualizar o tema em todas
  as páginas
