# TourVR — Painel administrativo

Painel web do TourVR, usado pela equipe para entrar no sistema e gerenciar o conteúdo.

**Stack:** React 19 · Vite 6 · TypeScript · Tailwind CSS 4 · React Router 7 · Axios.

## Como rodar

O caminho principal é pelo repositório orquestrador
[`quest-project`](https://github.com/Tour-VR/quest-project), que sobe MongoDB, backend e
painel com Docker Compose. Na raiz do `quest-project`:

```bash
bash scripts/setup.sh   # uma vez: baixa os submódulos
bash scripts/up.sh      # sobe tudo
```

Painel em http://localhost:3000. Para entrar, cadastre um usuário pelo Swagger do backend
(http://localhost:8000/docs, rota `POST /auth/register`).

**Alternativa sem Docker** (exige o backend rodando), dentro desta pasta:

```bash
npm ci
cp .env.example .env    # VITE_API_URL aponta para o backend
npm run dev             # http://localhost:3000
```

## Como testar

```bash
npm run lint    # checagem de tipos (tsc --noEmit)
```

## Documentação

A documentação do projeto fica no orquestrador, não aqui:

- Base de conhecimento: https://github.com/Tour-VR/quest-project/tree/main/docs
- Este serviço: [`docs/04-artefato-frontend.md`](https://github.com/Tour-VR/quest-project/blob/main/docs/04-artefato-frontend.md)
- Contrato da API: [`docs/06-contrato-api.md`](https://github.com/Tour-VR/quest-project/blob/main/docs/06-contrato-api.md)
