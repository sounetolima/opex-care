# Opex Care — licenças e painel do administrador

Clone do painel de licenças do Opex Agent, adaptado para o Opex Care (versão Light).

- `/admin`: painel com licenças, pedidos, bloqueio, computadores, senha do cliente e **nome da empresa e logo por cliente**.
- `/api/verify`, `/api/login`, `/api/release`: usados pela extensão. Devolvem a marca (nome e logo) do cliente.
- `/api/order`: pedido vindo do site (fica pendente até o administrador aprovar).

## Variáveis de ambiente (Netlify)
- `TOKEN_SECRET`: segredo longo para assinar a sessão do painel.
- `ADMIN_PASSWORD`: senha do primeiro acesso. Depois que entrar, troque em "Alterar senha".

## Testes
    npm test
