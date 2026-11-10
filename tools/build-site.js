// Gera o site de vendas do Opex Fideliza: página principal, uma página por segmento, instalação e páginas legais.
// Uso: node build-site.js <pasta de saída>
const fs = require('fs');
const path = require('path');
const out = process.argv[2];
if (!out) throw new Error('informe a pasta de saída');
fs.mkdirSync(path.join(out, 'segmentos'), { recursive: true });

const WA = '5579981697274';
const API = 'https://opex-care-licencas.netlify.app/api/order';
const DOWNLOAD = 'https://opex-care-licencas.netlify.app/download/opex-care.zip';
const wa = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

const CSS = `
:root{--navy:#060C1A;--navy2:#0B1630;--blue:#3D63DD;--gold:#D4AA46;--ink:#0F172A;--muted:#5B6B82;--line:#E2E8F0;--bg:#F5F8FF;--ok:#15803D;--bad:#B91C1C}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;font:16px/1.6 Inter,"Segoe UI",system-ui,sans-serif;color:var(--ink);background:#fff}
a{color:inherit}img{max-width:100%}
.wrap{max-width:1120px;margin:0 auto;padding:0 20px}
header.top{background:rgba(6,12,26,.96);color:#F8FAFC;position:sticky;top:0;z-index:20}
header.top .wrap{display:flex;align-items:center;justify-content:space-between;height:64px;gap:12px}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.06em;text-decoration:none;white-space:nowrap}
.brand img{width:34px;height:34px;border-radius:9px}.brand span{color:var(--gold)}
nav{display:flex;align-items:center}nav a{margin-left:20px;text-decoration:none;font-size:14px;opacity:.85}nav a:hover{opacity:1}
.btn{display:inline-block;padding:14px 22px;border-radius:12px;font-weight:700;text-decoration:none;font-size:15px;border:0;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;text-align:center}
.btn:hover{transform:translateY(-2px)}
.btn.primary{background:var(--blue);color:#fff}.btn.gold{background:var(--gold);color:var(--navy);box-shadow:0 10px 26px rgba(212,170,70,.3)}
.btn.ghost{border:1px solid var(--line);color:var(--ink);background:#fff}.btn.light{border:1px solid rgba(255,255,255,.28);color:#F8FAFC}
.btn.sm{padding:9px 16px;font-size:14px}.btn.block{display:block;width:100%}
.hero{background:radial-gradient(700px 360px at 85% 10%,rgba(61,99,221,.45),transparent 70%),linear-gradient(160deg,#04070E,#060C1A 55%,#0B1630);color:#F8FAFC;padding:64px 0 76px;overflow:hidden}
.hero .grid{display:grid;grid-template-columns:1.1fr .9fr;gap:44px;align-items:center}
.eyebrow{color:var(--gold);text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:700}
.hero h1{font-size:44px;line-height:1.12;margin:14px 0 16px;letter-spacing:-.01em}
.hero h1 em{font-style:normal;color:var(--gold)}
.hero p.lead{font-size:18px;opacity:.9;margin:0 0 26px;max-width:560px}
.ctas{display:flex;gap:12px;flex-wrap:wrap}
.trust{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13.5px;opacity:.85;margin-top:20px;padding:0;list-style:none}
.trust li:before{content:"✓ ";color:var(--gold);font-weight:800}
.phone{background:#0B1630;border:1px solid rgba(255,255,255,.1);border-radius:28px;padding:16px;box-shadow:0 30px 60px rgba(0,0,0,.45);max-width:350px;margin-left:auto}
.chat{background:#0E1A33;border-radius:18px;padding:16px}
.chat .head{display:flex;align-items:center;gap:10px;font-size:14px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:10px;margin-bottom:14px}
.chat .av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--gold),#F2C96B);display:flex;align-items:center;justify-content:center;color:var(--navy);font-weight:800;flex:none}
.bubble{background:#1E2F55;border-radius:14px 14px 14px 4px;padding:11px 13px;font-size:14px;max-width:92%;margin-bottom:10px}
.bubble.me{background:#2B4DB8;margin-left:auto;border-radius:14px 14px 4px 14px;width:fit-content}
.bubble small{display:block;opacity:.6;font-size:11px;margin-top:4px}
.tag{display:inline-block;background:rgba(212,170,70,.15);color:var(--gold);border-radius:999px;padding:2px 10px;font-size:12px;margin-bottom:6px}
section{padding:68px 0;scroll-margin-top:64px}#comecar{scroll-margin-top:84px}body:has(#pedido:focus-within) .mbar{display:none}section.alt{background:var(--bg)}
.kicker{color:var(--blue);text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:700}
h2{font-size:32px;line-height:1.2;margin:8px 0 12px;letter-spacing:-.01em}
.sub{color:var(--muted);max-width:700px;margin:0 0 36px;font-size:17px}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
.card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px}
.card h3{margin:0 0 8px;font-size:18px}.card p{margin:0;color:var(--muted);font-size:15px}
a.card{text-decoration:none;display:block;transition:box-shadow .2s,transform .2s}a.card:hover{box-shadow:0 14px 34px rgba(15,23,42,.08);transform:translateY(-3px)}
a.card .go{color:var(--blue);font-weight:700;font-size:14px;margin-top:12px;display:block}
.ico{font-size:24px;width:50px;height:50px;border-radius:14px;background:#EEF2FF;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.ba{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.ba .col{border-radius:18px;padding:26px;border:1px solid var(--line);background:#fff}
.ba .col.after{background:var(--navy);color:#F8FAFC;border-color:var(--navy)}
.ba h3{margin:0 0 14px;font-size:18px}.ba ul{margin:0;padding:0;list-style:none}
.ba li{padding:9px 0 9px 30px;position:relative;font-size:15.5px;border-top:1px solid var(--line)}
.ba li:first-child{border-top:0}.ba .after li{border-color:rgba(255,255,255,.1)}
.ba .before li:before{content:"✕";position:absolute;left:4px;color:var(--bad);font-weight:800}
.ba .after li:before{content:"✓";position:absolute;left:4px;color:var(--gold);font-weight:800}
.duo{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}
.duo .card h3{display:flex;align-items:center;gap:10px}
.duo ul{margin:10px 0 0;padding-left:20px;color:var(--muted);font-size:15.5px}.duo li{padding:4px 0}
.steps{display:grid;grid-template-columns:repeat(4,1fr);border-radius:18px;overflow:hidden;border:1px solid var(--line)}
.step{background:#fff;padding:24px 20px}.step+.step{border-left:1px solid var(--line)}
.step .n{font-size:13px;font-weight:800;color:var(--gold);background:var(--navy);border-radius:999px;padding:4px 10px;display:inline-block}
.step h4{margin:12px 0 6px;font-size:17px}.step p{margin:0;color:var(--muted);font-size:14.5px}
.plans{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;align-items:stretch}
.plan{border:1px solid var(--line);border-radius:20px;padding:24px 20px;background:#fff;display:flex;flex-direction:column;position:relative}
.plan.hl{border:2px solid var(--blue);box-shadow:0 18px 40px rgba(61,99,221,.18)}
.plan .badge{position:absolute;top:-12px;left:20px;background:var(--gold);color:var(--navy);font-size:12px;font-weight:800;border-radius:999px;padding:4px 12px}
.plan .name{font-weight:800;font-size:17px}.plan .price{font-size:34px;font-weight:800;margin:8px 0 0}
.plan .price small{font-size:14px;font-weight:500;color:var(--muted)}.plan .per{font-size:13.5px;color:var(--ok);font-weight:600;min-height:22px}
.plan ul{margin:14px 0 20px;padding:0;list-style:none;color:var(--muted);font-size:14.5px;flex:1}
.plan li{padding:5px 0}.plan li:before{content:"✓ ";color:var(--ok);font-weight:800}
.order{display:grid;grid-template-columns:.9fr 1.1fr;gap:28px;align-items:start;margin-top:40px}
.order .pitch{background:var(--navy);color:#F8FAFC;border-radius:20px;padding:28px}
.order .pitch h3{margin:0 0 10px;font-size:22px}.order .pitch ol{margin:14px 0 0;padding-left:20px;opacity:.92}.order .pitch li{padding:5px 0}
form.box{background:#fff;border:1px solid var(--line);border-radius:20px;padding:26px;box-shadow:0 18px 40px rgba(15,23,42,.06)}
form.box h3{margin:0 0 4px;font-size:20px}
label.f{display:block;font-size:13px;font-weight:600;margin:14px 0 5px}
input.in,select.in{width:100%;padding:13px 14px;border-radius:11px;border:1px solid #CBD5E1;font:inherit;font-size:16px;background:#fff;color:var(--ink)}
input.in:focus,select.in:focus{outline:2px solid var(--blue);outline-offset:1px;border-color:var(--blue)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.fmsg{font-size:14px;margin-top:12px;min-height:20px}.fmsg.err{color:var(--bad)}
.small{font-size:13px;color:var(--muted)}
.done{display:none}.done h3{color:var(--ok)}.done ol{padding-left:20px}.done li{padding:6px 0}
.faq details{border-bottom:1px solid var(--line);padding:16px 0}.faq summary{cursor:pointer;font-weight:700}.faq p{color:var(--muted);margin:10px 0 0}
.cta{background:radial-gradient(600px 280px at 50% 0%,rgba(212,170,70,.18),transparent 70%),linear-gradient(160deg,#04070E,#0B1630);color:#F8FAFC;text-align:center;padding:72px 0}
.cta p{opacity:.88;max-width:620px;margin:12px auto 26px}
footer{background:#04070E;color:#94A3B8;padding:28px 0 90px;font-size:14px}
footer .wrap{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}footer a{margin-left:14px}
.mbar{display:none}
.doc{max-width:780px}.doc h1{font-size:32px;line-height:1.2}.doc h2{font-size:21px;margin-top:30px}.doc li{padding:4px 0}
.warn{background:#FFF7E6;border:1px solid #F3D38A;border-radius:12px;padding:14px 16px;font-size:15px}
.shot{background:#0B1630;color:#E2E8F0;border-radius:12px;padding:12px 14px;font:14px/1.5 ui-monospace,Menlo,Consolas,monospace;overflow-x:auto}
@media (max-width:900px){
 .hero{padding:44px 0 56px}.hero .grid{grid-template-columns:1fr;gap:34px}.phone{margin:0 auto}
 .hero h1{font-size:32px}h2{font-size:26px}section{padding:52px 0}
 .grid3,.grid2,.plans,.ba,.duo,.order,.two{grid-template-columns:1fr}.steps{grid-template-columns:1fr}
 .step+.step{border-left:none;border-top:1px solid var(--line)}
 nav a.lk{display:none}
 .mbar{display:flex;gap:10px;position:fixed;left:0;right:0;bottom:0;z-index:30;background:rgba(6,12,26,.97);padding:10px 14px calc(10px + env(safe-area-inset-bottom))}
 .mbar .btn{flex:1;padding:13px 10px}
}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.btn,a.card{transition:none}}
`;

const SEGS = {
  clinicas: {
    file: 'clinicas', label: 'Clínicas e odontologia', emoji: '🦷', who: 'paciente', whoPl: 'pacientes',
    title: 'Opex Fideliza para clínicas e consultórios — menos faltas, mais retornos',
    desc: 'Lembrete automático da consulta no WhatsApp, pós-atendimento programado e histórico de cada paciente. Teste grátis por 3 dias.',
    eyebrow: 'Para clínicas, consultórios e odontologia',
    h1: 'Agenda cheia de quem <em>realmente aparece</em>.',
    lead: 'O Opex Fideliza lê a Google Agenda da sua clínica e avisa cada paciente no WhatsApp, com o procedimento, o horário e o profissional. Depois do atendimento, ele mesmo pergunta como o paciente está e chama para o retorno.',
    company: 'Clínica Sorriso',
    bubbles: [['📅 Lembrete', 'Boa tarde, Maria! Lembrete: amanhã (07/11) às 15:00 você tem limpeza completa na Clínica Sorriso com a Dra. Ana. Estamos aguardando a sua presença! 😊', '16:04'], ['me', 'Confirmado, obrigada! 👍', '16:05'], ['💬 Pós-atendimento', 'Maria, tudo bem por aí? Passando para saber como você está depois do procedimento.', '2 horas depois']],
    before: ['A recepção perde a manhã ligando para confirmar consulta', 'Paciente falta e o horário fica vazio', 'Depois do procedimento ninguém pergunta como ele ficou', 'O retorno de 6 meses depende da memória de alguém'],
    after: ['O lembrete sai sozinho 1 dia antes e, à tarde, de novo 6 horas antes', 'Cada mensagem cita o procedimento, o profissional e a unidade', 'Em 2 horas, 7 e 15 dias o paciente recebe o acompanhamento', 'O retorno fica programado para até 6 meses depois'],
    feats: [['🗓️', 'Uma agenda por unidade', 'Cada unidade usa a própria Google Agenda. O profissional e o procedimento vêm do evento.'], ['🩺', 'Pós-atendimento em ciclo', 'Até 4 mensagens depois da consulta, com intervalos de 2 horas a 6 meses. Você edita os textos e as datas.'], ['📋', 'Histórico do paciente', 'Consultas passadas e futuras, lembretes enviados e atendimentos com protocolo, tudo em um cartão.']],
  },
  saloes: {
    file: 'saloes', label: 'Salões e barbearias', emoji: '💈', who: 'cliente', whoPl: 'clientes',
    title: 'Opex Fideliza para salões e barbearias — cliente voltando todo mês',
    desc: 'Lembrete do horário no WhatsApp, aviso de retorno e aniversariantes para salão de beleza e barbearia. Teste grátis por 3 dias.',
    eyebrow: 'Para salões de beleza e barbearias',
    h1: 'Cadeira ocupada e cliente <em>voltando todo mês</em>.',
    lead: 'O Opex Fideliza avisa o cliente do horário, com o serviço e o profissional. Trinta dias depois, ele lembra que está na hora de voltar. Você cuida do atendimento e o WhatsApp cuida da agenda.',
    company: 'Barbearia Dom',
    bubbles: [['📅 Lembrete', 'Boa tarde, Rafael! Amanhã às 18:30 você tem horário: corte e barba com o Léo na Barbearia Dom. Te esperamos! ✂️', '17:10'], ['me', 'Fechado! 💈', '17:12'], ['🔁 Retorno', 'Rafael, já faz um mês do seu último corte. Quer que eu separe um horário para você esta semana?', '30 dias depois']],
    before: ['Cliente esquece o horário e a cadeira fica parada', 'Você descobre o cancelamento em cima da hora', 'Quem veio uma vez não é chamado de volta', 'Aniversário do cliente passa em branco'],
    after: ['Lembrete com serviço, profissional e hora, sem você digitar', 'Etapa "Lista de espera" para encaixar quem quer horário', 'Aviso de retorno programado para 30 dias depois', 'Aniversariantes do mês em dois toques, com 4 variações de mensagem'],
    feats: [['✂️', 'Serviços com duração e valor', 'Cadastre corte, barba, coloração. Ao marcar, o serviço entra na agenda e no lembrete.'], ['🔁', 'Cliente sumido volta', 'O funil mostra quem é fiel e quem sumiu. O ciclo de retorno chama de volta no tempo certo.'], ['🎂', 'Aniversariantes', 'Filtre por hoje, 7 dias, 30 dias ou período e mande os parabéns com ritmo seguro.']],
  },
  seguros: {
    file: 'seguros', label: 'Corretoras de seguros', emoji: '🛡️', who: 'segurado', whoPl: 'segurados',
    title: 'Opex Fideliza para corretoras de seguros — renovação na hora certa',
    desc: 'Funil de cotação, aviso de renovação e histórico de cada segurado dentro do WhatsApp Web. Teste grátis por 3 dias.',
    eyebrow: 'Para corretoras e corretores de seguros',
    h1: 'Nenhuma renovação <em>perdida por esquecimento</em>.',
    lead: 'O Opex Fideliza organiza a sua carteira dentro do WhatsApp Web: do lead à apólice ativa. O vencimento marcado na agenda vira aviso automático para o segurado, e cada conversa fica registrada com protocolo.',
    company: 'Corretora Aliança',
    bubbles: [['🛡️ Renovação', 'Bom dia, Carla! Sua apólice de seguro auto vence em 12/11. Quer que eu cuide da renovação para você? 😊', '09:00'], ['me', 'Quero sim, pode mandar a proposta', '09:14'], ['💬 Pós-venda', 'Carla, sua apólice já está ativa. Qualquer dúvida sobre cobertura ou sinistro, é só chamar por aqui.', '2 horas depois']],
    before: ['O vencimento passa e o cliente renova com outro corretor', 'Cotação enviada fica sem retorno', 'Cada corretor guarda a carteira em uma planilha diferente', 'Ninguém sabe o que foi combinado na última conversa'],
    after: ['Aviso de renovação sai sozinho antes do vencimento', 'Funil: lead, cotação, proposta, apólice ativa e renovação', 'Retorno programado depois da proposta, para não esfriar', 'Atendimento com protocolo e histórico por segurado'],
    feats: [['📆', 'Vencimentos na agenda', 'Marque o vencimento na Google Agenda e o aviso sai 1 dia antes e no dia.'], ['📊', 'Funil de cotação', 'Veja em colunas quem está em cotação, com proposta e quem já fechou.'], ['🧾', 'Protocolo de atendimento', 'Cada atendimento finalizado ganha número de protocolo e fica no histórico.']],
  },
  varejo: {
    file: 'varejo', label: 'Varejo e lojas', emoji: '🛍️', who: 'cliente', whoPl: 'clientes',
    title: 'Opex Fideliza para lojas e varejo — quem comprou volta a comprar',
    desc: 'Pós-venda automático, recompra, aniversariantes e funil de vendas dentro do WhatsApp Web. Teste grátis por 3 dias.',
    eyebrow: 'Para lojas, ópticas e varejo',
    h1: 'Quem comprou uma vez <em>volta a comprar</em>.',
    lead: 'O Opex Fideliza registra cada venda no WhatsApp Web e programa o pós-venda: como foi a compra, hora de repor, aniversário. Seu vendedor atende; as mensagens de relacionamento saem sozinhas.',
    company: 'Óptica Visão',
    bubbles: [['🛍️ Pós-venda', 'Boa tarde, João! Tudo certo com os seus óculos novos? Se precisar de qualquer ajuste, é só passar aqui. 😊', '2 horas depois'], ['me', 'Ficaram ótimos, obrigado!', '15:40'], ['🎂 Aniversário', 'João, feliz aniversário! 🎉 Que este novo ano traga muitas coisas boas. Obrigado por confiar na gente.', '08:00']],
    before: ['A venda termina no caixa e o cliente some', 'Ninguém avisa quando é hora de repor ou revisar', 'Promoção vai para todo mundo, igual, e o número é bloqueado', 'O vendedor sai e o histórico vai embora com ele'],
    after: ['Registrou a venda, o pós-venda já fica programado', 'Lembrete de recompra em 30, 60 ou 90 dias', 'Envios com intervalo, pausas, limite diário e 4 variações de texto', 'Histórico de compras e conversas fica no cartão do cliente'],
    feats: [['🧾', 'Venda registrada em um toque', 'Valor e descrição ficam no histórico do cliente e disparam o pós-venda.'], ['🔁', 'Ciclo de recompra', 'Programe até 4 mensagens entre 2 horas e 6 meses depois da compra.'], ['📊', 'Funil de vendas', 'Lead, interessado, comprou, pós-venda e recompra, lado a lado.']],
  },
};

const GENERIC = {
  label: '', who: 'cliente', whoPl: 'clientes',
  title: 'Opex Fideliza — lembretes, pós-atendimento e relacionamento no WhatsApp Web',
  desc: 'O CRM leve que vive dentro do WhatsApp Web: lembretes da agenda, pós-atendimento automático, aniversariantes e histórico de cada cliente. Teste grátis por 3 dias.',
  eyebrow: 'Clínicas · Salões · Barbearias · Corretoras · Lojas',
  h1: 'Seu WhatsApp lembra, acompanha e <em>traz o cliente de volta</em>.',
  lead: 'O Opex Fideliza é um painel que abre dentro do WhatsApp Web que você já usa. Ele avisa o cliente do horário, pergunta como foi depois do atendimento e chama para voltar — enquanto você cuida de quem está na sua frente.',
  company: 'Sua empresa',
  bubbles: [['📅 Lembrete', 'Boa tarde, Maria! Lembrete: amanhã (07/11) às 15:00 você tem limpeza completa na Clínica Sorriso. Estamos aguardando a sua presença! 😊', '16:04'], ['me', 'Confirmado, obrigada! 👍', '16:05'], ['💬 Pós-atendimento', 'Maria, tudo bem por aí? Passando para saber como você está depois do atendimento.', '2 horas depois']],
  before: ['Alguém da equipe para tudo para confirmar horário, um por um', 'Cliente falta, ninguém foi avisado e o horário fica vazio', 'Depois do atendimento ou da venda, o contato acaba', 'O histórico do cliente está na cabeça de quem atendeu'],
  after: ['O lembrete sai sozinho, com serviço, hora e profissional', 'Você vê o que já foi enviado e o que está programado', 'O pós-atendimento roda em ciclo, de 2 horas a 6 meses', 'Cada cliente tem um cartão com tudo o que já aconteceu'],
  feats: null,
};

const FEATS = [
  ['🗓️', 'Lembretes pela Google Agenda', 'Uma agenda por unidade. O lembrete sai 1 dia antes e, para horários da tarde e da noite, de novo 6 horas antes.'],
  ['📝', 'Marcar e confirmar na hora', 'Marque o horário pelo painel, escolha o serviço e o cliente já recebe a confirmação com os dados.'],
  ['🔁', 'Pós-atendimento em ciclo', 'Até 4 mensagens depois do atendimento, da visita ou da venda. Intervalos de 2 horas a 6 meses, editáveis.'],
  ['🎂', 'Aniversariantes', 'Filtre por hoje, 7 dias, 30 dias ou período. Quatro variações de texto para não mandar tudo igual.'],
  ['📋', 'Cartão do cliente', 'Agendamentos passados e futuros, lembretes, retornos e atendimentos com protocolo em um só lugar.'],
  ['📊', 'Funil e etiquetas', 'Etapas e etiquetas prontas para o seu ramo. Veja quem é novo, quem fechou e quem sumiu.'],
];

const head = (p, root) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:type" content="website">
<meta property="og:image" content="https://opex-fideliza-site.netlify.app/img/logo.png">
<link rel="icon" href="${root}img/favicon.png">
<style>${CSS}</style>
</head>
<body>`;

const topbar = (root, cta = true) => `
<header class="top"><div class="wrap">
  <a class="brand" href="${root}index.html"><img src="${root}img/logo.png" alt="" width="34" height="34"><span>OPEX</span>&nbsp;CARE</a>
  <nav><a class="lk" href="${root}index.html#diferencial">Por que funciona</a><a class="lk" href="${root}index.html#recursos">Recursos</a><a class="lk" href="${root}index.html#planos">Planos</a><a class="lk" href="${root}index.html#faq">Dúvidas</a>
  ${cta ? '<a class="btn gold sm" href="#comecar">Testar grátis</a>' : `<a class="btn gold sm" href="${root}index.html#comecar">Testar grátis</a>`}</nav>
</div></header>`;

const footer = (root) => `
<footer><div class="wrap">
  <div>© 2026 Opex Fideliza · OPEX Business Growth · Aracaju/SE</div>
  <div><a href="${root}instalar.html">Como instalar</a><a href="${root}privacidade.html">Privacidade</a><a href="${root}termos.html">Termos de uso</a></div>
</div></footer>`;

const bubbles = (p) => p.bubbles.map(([tag, text, time]) => tag === 'me'
  ? `<div class="bubble me">${text}<small>${time}</small></div>`
  : `<div class="bubble"><span class="tag">${tag}</span><br>${text}<small>${time} ✓✓</small></div>`).join('');

const orderScript = `
<script>
(function(){
  var API=${JSON.stringify(API)},DL=${JSON.stringify(DOWNLOAD)},WA=${JSON.stringify(WA)};
  var f=document.getElementById('pedido');if(!f)return;
  var plan=document.getElementById('p-plan'),btn=document.getElementById('p-btn'),msg=document.getElementById('p-msg'),done=document.getElementById('p-done');
  function label(){btn.textContent=plan.value==='Teste'?'Liberar meu teste grátis':'Fazer meu pedido';}
  plan.addEventListener('change',label);label();
  document.querySelectorAll('[data-plan]').forEach(function(a){a.addEventListener('click',function(){plan.value=a.getAttribute('data-plan');label();});});
  function wa(t){return 'https://wa.me/'+WA+'?text='+encodeURIComponent(t);}
  f.addEventListener('submit',function(e){
    e.preventDefault();msg.className='fmsg';msg.textContent='';
    var d={name:f.name.value.trim(),phone:f.phone.value.trim(),email:f.email.value.trim(),segment:f.segment.value,plan:plan.value,password:f.password.value,website:f.website.value};
    if(d.password.length<8){msg.className='fmsg err';msg.textContent='A senha precisa ter pelo menos 8 caracteres.';return;}
    btn.disabled=true;var old=btn.textContent;btn.textContent='Enviando…';
    fetch(API,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(d)})
     .then(function(r){return r.json().then(function(j){return {s:r.status,j:j};});})
     .then(function(x){
       if(!x.j.ok){btn.disabled=false;btn.textContent=old;msg.className='fmsg err';msg.innerHTML=(x.j.message||'Não foi possível enviar.')+(x.s===409?' <a href="'+wa('Olá! Já tenho cadastro no Opex Fideliza e quero liberar meu acesso.')+'" target="_blank" rel="noopener">Chamar no WhatsApp</a>':'');return;}
       f.style.display='none';done.style.display='block';
       var first=d.name.split(' ')[0];
       if(x.j.trial){
         done.innerHTML='<h3>Teste liberado, '+first.replace(/[<>&]/g,'')+'! ✅</h3><p>Você tem 3 dias com todos os recursos. Faltam 3 passos:</p><ol><li><a class="btn gold sm" href="'+(x.j.downloadUrl||DL)+'">Baixar a extensão</a></li><li>Instale no Chrome seguindo o <a href="'+(location.pathname.indexOf('/segmentos/')>-1?'../':'')+'instalar.html" target="_blank">passo a passo (2 minutos)</a>.</li><li>Abra o WhatsApp Web e entre no painel com o e-mail <b></b> e a senha que você acabou de criar.</li></ol><p class="small">Precisa de ajuda para instalar? <a href="'+wa('Olá! Liberei meu teste do Opex Fideliza e quero ajuda para instalar.')+'" target="_blank" rel="noopener">Chame a gente no WhatsApp</a>.</p>';
         done.querySelector('b').textContent=d.email;
       }else{
         done.innerHTML='<h3>Pedido recebido, '+first.replace(/[<>&]/g,'')+'! ✅</h3><p>Seu cadastro do plano <b></b> está feito. Para liberar hoje mesmo, chame a gente no WhatsApp e receba os dados de pagamento.</p><p><a class="btn gold" target="_blank" rel="noopener" href="'+wa('Olá! Fiz o pedido do Opex Fideliza, plano '+d.plan+', no nome '+d.name+'. Quero os dados para pagamento.')+'">Receber dados de pagamento no WhatsApp</a></p>';
         done.querySelector('b').textContent=d.plan;
       }
       done.scrollIntoView({block:'center'});
     })
     .catch(function(){btn.disabled=false;btn.textContent=old;msg.className='fmsg err';msg.innerHTML='Sem conexão com o servidor. <a href="'+wa('Olá! Quero testar o Opex Fideliza.')+'" target="_blank" rel="noopener">Peça pelo WhatsApp</a>.';});
  });
})();
</script>`;

const segOptions = (sel) => [['clinicas', 'Clínica ou consultório'], ['saloes', 'Salão ou barbearia'], ['seguros', 'Corretora de seguros'], ['varejo', 'Loja ou varejo'], ['outro', 'Outro']]
  .map(([v, l]) => `<option value="${v}" ${sel === v ? 'selected' : ''}>${l}</option>`).join('');

function page(p, root, segKey) {
  const feats = p.feats || FEATS;
  const segCards = Object.values(SEGS).map((s) => `<a class="card" href="${root}segmentos/${s.file}.html"><div class="ico">${s.emoji}</div><h3>${s.label}</h3><p>${s.desc.split('.')[0]}.</p><span class="go">Ver como funciona →</span></a>`).join('');
  return `${head(p, root)}
${topbar(root)}

<section class="hero"><div class="wrap grid">
  <div>
    <div class="eyebrow">${p.eyebrow}</div>
    <h1>${p.h1}</h1>
    <p class="lead">${p.lead}</p>
    <div class="ctas">
      <a class="btn gold" href="#comecar" data-plan="Teste">Começar teste grátis de 3 dias</a>
      <a class="btn light" href="#diferencial">Ver como funciona</a>
    </div>
    <ul class="trust"><li>Sem cartão</li><li>Instala em 2 minutos</li><li>Funciona no WhatsApp que você já usa</li></ul>
  </div>
  <div class="phone" aria-hidden="true"><div class="chat">
    <div class="head"><div class="av">${p.company[0]}</div><div><b>${p.company}</b><br><small style="opacity:.6">mensagens automáticas</small></div></div>
    ${bubbles(p)}
  </div></div>
</div></section>

<section id="diferencial"><div class="wrap">
  <div class="kicker">O que muda</div>
  <h2>O mesmo dia de trabalho, sem a parte que ninguém tem tempo de fazer</h2>
  <p class="sub">Relacionamento com ${p.who} não falha por falta de vontade. Falha porque depende de alguém lembrar. O Opex Fideliza tira isso da memória da equipe.</p>
  <div class="ba">
    <div class="col before"><h3>Hoje</h3><ul>${p.before.map((x) => `<li>${x}</li>`).join('')}</ul></div>
    <div class="col after"><h3>Com o Opex Fideliza</h3><ul>${p.after.map((x) => `<li>${x}</li>`).join('')}</ul></div>
  </div>
  <div class="duo">
    <div class="card"><h3><span>🧑‍💼</span> O seu dia melhora</h3><ul>
      <li>Menos horário vazio: o ${p.who} é avisado antes, sem ninguém parar para isso.</li>
      <li>Sua equipe atende em vez de digitar a mesma mensagem dezenas de vezes.</li>
      <li>Você abre o painel e vê o que saiu, o que está programado e quem está sem retorno.</li>
      <li>Se um funcionário sai, o histórico dos ${p.whoPl} fica.</li>
    </ul></div>
    <div class="card"><h3><span>🙂</span> A experiência do seu ${p.who} melhora</h3><ul>
      <li>Recebe a confirmação na hora em que marca.</li>
      <li>É lembrado com o serviço, o horário e o nome de quem vai atender.</li>
      <li>Alguém pergunta como foi depois. Quase ninguém faz isso.</li>
      <li>É chamado pelo nome e lembrado no aniversário.</li>
    </ul></div>
  </div>
</div></section>

<section class="alt"><div class="wrap">
  <div class="kicker">Nosso diferencial</div>
  <h2>Por que o Opex Fideliza e não mais um sistema</h2>
  <p class="sub">Ferramentas grandes pedem migração, treinamento e mensalidade por usuário. O Opex Fideliza foi feito para quem quer resultado no mesmo dia.</p>
  <div class="grid3">
    <div class="card"><div class="ico">💬</div><h3>Vive dentro do WhatsApp Web</h3><p>Não troca seu número, não exige API paga e não tem outro sistema para abrir. O painel aparece ao lado das suas conversas.</p></div>
    <div class="card"><div class="ico">🔒</div><h3>Seus dados ficam com você</h3><p>Clientes e histórico ficam no seu navegador, com backup na sua conta do Google Drive. Nossa parte guarda só a sua licença.</p></div>
    <div class="card"><div class="ico">🛡️</div><h3>Envio com ritmo seguro</h3><p>Intervalos aleatórios, pausas, limite diário e variações de texto. Pensado para proteger o seu número.</p></div>
    <div class="card"><div class="ico">🎯</div><h3>Pronto para o seu ramo</h3><p>Escolha o segmento e o funil, as etiquetas e os textos já vêm ajustados. Você muda o que quiser depois.</p></div>
    <div class="card"><div class="ico">🏷️</div><h3>Com a sua marca</h3><p>O painel abre com o nome e o logo da sua empresa. Sua equipe trabalha na ferramenta da casa.</p></div>
    <div class="card"><div class="ico">💰</div><h3>Preço fixo e baixo</h3><p>A partir de R$ 29 por mês no plano anual. Sem taxa por mensagem e sem cobrança por contato.</p></div>
  </div>
</div></section>

<section id="funciona"><div class="wrap">
  <div class="kicker">Como funciona</div>
  <h2>Você marca uma vez. O resto acontece sozinho.</h2>
  <p class="sub">Quatro momentos em que o seu ${p.who} é lembrado de que você existe.</p>
  <div class="steps">
    <div class="step"><span class="n">01</span><h4>Marcar</h4><p>Marque pelo painel ou direto na Google Agenda. O serviço e o profissional vão junto.</p></div>
    <div class="step"><span class="n">02</span><h4>Confirmar</h4><p>O ${p.who} recebe a confirmação no WhatsApp com data, hora e serviço.</p></div>
    <div class="step"><span class="n">03</span><h4>Lembrar</h4><p>Lembrete 1 dia antes. Para a tarde e a noite, outro 6 horas antes.</p></div>
    <div class="step"><span class="n">04</span><h4>Acompanhar</h4><p>Depois do atendimento, o ciclo de retorno começa: 2 horas, 7 dias, 15 dias ou o que você definir.</p></div>
  </div>
</div></section>

<section id="recursos" class="alt"><div class="wrap">
  <div class="kicker">Recursos</div>
  <h2>${segKey ? 'O que mais ajuda no seu ramo' : 'Só o que a sua equipe usa de verdade'}</h2>
  <p class="sub">${segKey ? 'E todos os outros recursos do Opex Fideliza continuam disponíveis.' : 'Sem módulo que ninguém abre. Tudo em um painel ao lado das conversas.'}</p>
  <div class="grid3">${feats.map(([i, t, d]) => `<div class="card"><div class="ico">${i}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>
  ${segKey ? `<p style="margin-top:22px"><a href="${root}index.html#recursos" style="color:var(--blue);font-weight:700">Ver todos os recursos →</a></p>` : ''}
</div></section>

${segKey ? '' : `<section id="para-quem"><div class="wrap">
  <div class="kicker">Para quem</div>
  <h2>Uma ferramenta, ajustada para o seu ramo</h2>
  <p class="sub">Veja como fica no seu tipo de negócio.</p>
  <div class="grid2">${segCards}</div>
</div></section>`}

<section id="planos" ${segKey ? '' : 'class="alt"'}><div class="wrap">
  <div class="kicker">Planos</div>
  <h2>Teste 3 dias. Se um cliente voltar, já se pagou.</h2>
  <p class="sub">Todos os planos têm todos os recursos. Muda só o prazo e o preço.</p>
  <div class="plans">
    <div class="plan"><div class="name">Teste grátis</div><div class="price">R$ 0 <small>/ 3 dias</small></div><div class="per">Sem cartão</div>
      <ul><li>Todos os recursos</li><li>Liberação na hora</li><li>Sem compromisso</li></ul><a class="btn ghost" href="#comecar" data-plan="Teste">Começar o teste</a></div>
    <div class="plan"><div class="name">Mensal</div><div class="price">R$ 40 <small>/ mês</small></div><div class="per">&nbsp;</div>
      <ul><li>Todos os recursos</li><li>Suporte pelo WhatsApp</li><li>Sem fidelidade</li></ul><a class="btn ghost" href="#comecar" data-plan="Mensal">Quero o mensal</a></div>
    <div class="plan"><div class="name">Semestral</div><div class="price">R$ 200 <small>/ 6 meses</small></div><div class="per">Sai a R$ 33,33 por mês · economize R$ 40</div>
      <ul><li>Todos os recursos</li><li>Suporte pelo WhatsApp</li><li>Preço garantido por 6 meses</li></ul><a class="btn ghost" href="#comecar" data-plan="Semestral">Quero o semestral</a></div>
    <div class="plan hl"><span class="badge">MELHOR PREÇO</span><div class="name">Anual</div><div class="price">R$ 350 <small>/ ano</small></div><div class="per">Sai a R$ 29 por mês · economize R$ 180</div>
      <ul><li>Todos os recursos</li><li>Suporte pelo WhatsApp</li><li>Preço garantido por 12 meses</li></ul><a class="btn primary" href="#comecar" data-plan="Anual">Quero o anual</a></div>
  </div>

  <div class="order" id="comecar">
    <div class="pitch">
      <h3>Comece agora. Leva 2 minutos.</h3>
      <p style="opacity:.9;margin:0">Você cria seu acesso aqui, instala a extensão no Chrome e o painel abre dentro do seu WhatsApp Web.</p>
      <ol><li>Preencha os dados ao lado.</li><li>Baixe e instale a extensão.</li><li>Entre com seu e-mail e a senha que você criou.</li></ol>
      <p class="small" style="color:#CBD5E1;margin:16px 0 0">Prefere falar com alguém? <a href="${wa('Olá! Quero conhecer o Opex Fideliza' + (segKey ? ' para ' + p.label.toLowerCase() : '') + '.')}" target="_blank" rel="noopener" style="color:var(--gold)">Chame no WhatsApp</a>.</p>
    </div>
    <div>
      <form class="box" id="pedido" novalidate>
        <h3>Criar meu acesso</h3><div class="small">O teste é liberado na hora. Planos pagos são liberados após o pagamento.</div>
        <label class="f" for="p-name">Seu nome ou da empresa</label><input class="in" id="p-name" name="name" required autocomplete="name">
        <div class="two">
          <div><label class="f" for="p-phone">WhatsApp com DDD</label><input class="in" id="p-phone" name="phone" type="tel" inputmode="tel" required autocomplete="tel" placeholder="(79) 99999-9999"></div>
          <div><label class="f" for="p-email">E-mail</label><input class="in" id="p-email" name="email" type="email" required autocomplete="email"></div>
        </div>
        <div class="two">
          <div><label class="f" for="p-seg">Seu ramo</label><select class="in" id="p-seg" name="segment">${segOptions(segKey)}</select></div>
          <div><label class="f" for="p-plan">Plano</label><select class="in" id="p-plan" name="plan"><option value="Teste">Teste grátis · 3 dias</option><option value="Mensal">Mensal · R$ 40</option><option value="Semestral">Semestral · R$ 200</option><option value="Anual">Anual · R$ 350</option></select></div>
        </div>
        <label class="f" for="p-pass">Crie uma senha (mínimo 8 caracteres)</label><input class="in" id="p-pass" name="password" type="password" minlength="8" required autocomplete="new-password">
        <div class="hp" aria-hidden="true"><label>Não preencha<input name="website" tabindex="-1" autocomplete="off"></label></div>
        <div style="margin-top:18px"><button class="btn gold block" id="p-btn" type="submit">Liberar meu teste grátis</button></div>
        <div class="fmsg" id="p-msg" role="alert"></div>
        <div class="small">Ao continuar você concorda com os <a href="${root}termos.html">termos de uso</a> e a <a href="${root}privacidade.html">política de privacidade</a>.</div>
      </form>
      <div class="box done" id="p-done" style="background:#fff;border:1px solid var(--line);border-radius:20px;padding:26px"></div>
    </div>
  </div>
</div></section>

<section id="faq" ${segKey ? 'class="alt"' : ''}><div class="wrap">
  <div class="kicker">Dúvidas</div>
  <h2>Perguntas frequentes</h2>
  <div class="faq" style="max-width:840px">
    <details><summary>Preciso trocar de número ou de sistema?</summary><p>Não. O Opex Fideliza é uma extensão do Chrome que abre dentro do WhatsApp Web, com o número que você já usa. A agenda continua sendo a sua Google Agenda.</p></details>
    <details><summary>As mensagens saem com o computador desligado?</summary><p>Não. Os envios saem pelo seu WhatsApp Web, então o Chrome precisa estar aberto com o WhatsApp conectado. Se estiver fechado na hora, a mensagem sai assim que você abrir, e o Chrome avisa que há envios aguardando.</p></details>
    <details><summary>Meu número pode ser bloqueado?</summary><p>O envio usa intervalos aleatórios, pausas, limite diário e variações de texto, que reduzem o risco. Nenhuma ferramenta garante que o WhatsApp não bloqueie. Envie mensagens de serviço para quem é seu cliente e respeite quem pede para não receber.</p></details>
    <details><summary>Onde ficam os dados dos meus clientes?</summary><p>No seu navegador, com backup automático na sua conta do Google Drive, se você ativar. O servidor da OPEX guarda apenas os dados da sua licença: nome, contato e plano.</p></details>
    <details><summary>Em quantos computadores posso usar?</summary><p>Cada licença vale para um computador. Se você precisa de mais, fale com a gente e ajustamos a licença.</p></details>
    <details><summary>O que acontece depois dos 3 dias de teste?</summary><p>O painel trava até você escolher um plano. Seus clientes e históricos continuam guardados e voltam assim que a licença é liberada.</p></details>
    <details><summary>Um cliente pode pedir para não receber lembretes?</summary><p>Sim. Escreva "sem lembrete" na descrição do evento da agenda e o sistema não envia para aquele horário.</p></details>
  </div>
</div></section>

<section class="cta"><div class="wrap">
  <h2>Veja funcionando no seu WhatsApp ainda hoje</h2>
  <p>Três dias com todos os recursos, sem cartão. Se não fizer diferença no seu dia, é só não continuar.</p>
  <div class="ctas" style="justify-content:center"><a class="btn gold" href="#comecar" data-plan="Teste">Começar teste grátis</a><a class="btn light" href="${wa('Olá! Quero tirar uma dúvida sobre o Opex Fideliza.')}" target="_blank" rel="noopener">Tirar dúvida no WhatsApp</a></div>
</div></section>
${footer(root)}
<div class="mbar"><a class="btn gold" href="#comecar" data-plan="Teste">Testar grátis</a><a class="btn light" href="${wa('Olá! Quero conhecer o Opex Fideliza.')}" target="_blank" rel="noopener">WhatsApp</a></div>
${orderScript}
</body></html>`;
}

const doc = (title, desc, root, body) => `${head({ title, desc }, root)}${topbar(root, false)}<section><div class="wrap doc">${body}</div></section>${footer(root)}</body></html>`;

const instalar = doc('Como instalar o Opex Fideliza no Chrome', 'Passo a passo para instalar a extensão Opex Fideliza e entrar no painel pelo WhatsApp Web.', '', `
<div class="kicker">Instalação</div>
<h1>Como instalar o Opex Fideliza</h1>
<p>Leva cerca de 2 minutos. Você precisa de um computador com o Google Chrome e o WhatsApp Web.</p>
<p><a class="btn gold" href="${DOWNLOAD}">Baixar a extensão (arquivo .zip)</a></p>
<h2>Passo a passo</h2>
<ol>
  <li><b>Descompacte o arquivo</b> em uma pasta que você não vá apagar, por exemplo <i>Documentos › Opex Fideliza</i>.</li>
  <li>No Chrome, digite na barra de endereço: <div class="shot">chrome://extensions</div></li>
  <li>Ligue a chave <b>Modo do desenvolvedor</b>, no canto superior direito.</li>
  <li>Clique em <b>Carregar sem compactação</b> e escolha a pasta que você descompactou.</li>
  <li>Abra o <a href="https://web.whatsapp.com" target="_blank" rel="noopener">WhatsApp Web</a>. O painel do Opex Fideliza aparece no lado direito.</li>
  <li>Entre com o <b>e-mail ou WhatsApp</b> e a <b>senha</b> que você criou no cadastro.</li>
</ol>
<h2>Primeiros ajustes</h2>
<ol>
  <li>Em <b>Ajustes › Segmento</b>, escolha o seu ramo e toque em <b>Aplicar perfil</b>.</li>
  <li>Em <b>Ajustes › Serviços</b>, cadastre o que você oferece, com valor e duração.</li>
  <li>Em <b>Agenda</b>, conecte a Google Agenda e marque a agenda de cada unidade.</li>
  <li>Em <b>Ajustes › Pós-atendimento</b>, revise os textos e os intervalos do ciclo.</li>
</ol>
<div class="warn"><b>Importante:</b> não apague nem mova a pasta depois de instalar, senão o Chrome desativa a extensão. Se o Chrome mostrar um aviso sobre extensões em modo de desenvolvedor ao abrir, é só fechar o aviso.</div>
<h2>Precisa de ajuda?</h2>
<p><a class="btn primary" href="${wa('Olá! Preciso de ajuda para instalar o Opex Fideliza.')}" target="_blank" rel="noopener">Falar com o suporte no WhatsApp</a></p>`);

const privacidade = doc('Política de privacidade — Opex Fideliza', 'Como o Opex Fideliza trata os dados da empresa contratante e dos clientes dela.', '', `
<div class="kicker">Opex Fideliza</div>
<h1>Política de privacidade</h1>
<p class="small">Última atualização: 9 de novembro de 2026.</p>
<p>Esta política explica quais dados o Opex Fideliza usa, onde eles ficam e para quê. O Opex Fideliza é uma extensão do Google Chrome que funciona dentro do WhatsApp Web, oferecida pela OPEX Business Growth, de Aracaju/SE.</p>
<h2>1. Quem é responsável pelos dados</h2>
<p>A empresa que contrata o Opex Fideliza (clínica, salão, corretora, loja) é a controladora dos dados dos seus próprios clientes. A OPEX atua como operadora apenas dos dados de licença descritos no item 3.</p>
<h2>2. Dados que ficam no seu navegador</h2>
<p>A extensão guarda no armazenamento local do seu Chrome, no seu computador:</p>
<ul>
  <li>nome e telefone dos contatos que você atende pelo WhatsApp Web;</li>
  <li>data de nascimento, quando você cadastra, usada para o aviso de aniversário;</li>
  <li>etapa do funil, etiquetas, anotações, histórico de atendimentos, visitas e vendas;</li>
  <li>agendamentos lidos da sua Google Agenda e a fila de mensagens programadas;</li>
  <li>seus textos de mensagem, serviços e configurações.</li>
</ul>
<p>Esses dados <b>não são enviados aos servidores da OPEX</b>.</p>
<h2>3. Dados que a OPEX guarda</h2>
<p>Para controlar a licença, guardamos: nome ou razão social, e-mail, telefone, plano, validade, senha de acesso (armazenada de forma cifrada, com hash), um identificador aleatório de cada computador ativado, a versão da extensão e a data do último uso. Se você definir, guardamos também o nome e o logo da sua empresa para exibir no painel.</p>
<h2>4. Uso de dados da sua conta Google</h2>
<p>Quando você conecta sua conta Google, a extensão pede acesso a:</p>
<ul>
  <li><b>Google Agenda</b>: ler os eventos das agendas que você escolher, para programar lembretes e mostrar agendamentos, e criar eventos quando você marca um horário pelo painel;</li>
  <li><b>Google Drive</b> (apenas arquivos criados pela própria extensão): salvar e atualizar o arquivo de backup dos seus dados.</li>
</ul>
<p>Esses dados são usados somente para essas funções, dentro do seu navegador. Não são transferidos à OPEX nem a terceiros, não são usados para publicidade e não são lidos por pessoas. O uso de informações recebidas das APIs do Google segue a <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Política de Dados do Usuário dos Serviços de API do Google</a>, incluindo os requisitos de Uso Limitado.</p>
<h2>5. WhatsApp</h2>
<p>As mensagens são enviadas pelo seu próprio WhatsApp Web, com o seu número. A OPEX não tem acesso às suas conversas. O Opex Fideliza não é afiliado, patrocinado nem endossado pelo WhatsApp ou pela Meta.</p>
<h2>6. Compartilhamento</h2>
<p>Não vendemos nem compartilhamos dados para marketing. Os dados de licença ficam em provedor de hospedagem contratado pela OPEX (Netlify).</p>
<h2>7. Direitos dos titulares</h2>
<p>O cliente final pode pedir à empresa que o atende a confirmação, o acesso, a correção ou a exclusão dos seus dados, e pode pedir para não receber mensagens. A empresa contratante pode pedir à OPEX a exclusão dos seus dados de licença a qualquer momento.</p>
<h2>8. Guarda e exclusão</h2>
<p>Os dados locais ficam no seu navegador até você removê-los ou desinstalar a extensão. O backup fica na sua conta do Google Drive, sob o seu controle. Os dados de licença são mantidos enquanto a licença existir e apagados a pedido.</p>
<h2>9. Contato</h2>
<p>Dúvidas e pedidos: WhatsApp <a href="${wa('Olá! Tenho uma dúvida sobre privacidade no Opex Fideliza.')}" target="_blank" rel="noopener">(79) 98169-7274</a>.</p>`);

const termos = doc('Termos de uso — Opex Fideliza', 'Condições de uso da extensão Opex Fideliza.', '', `
<div class="kicker">Opex Fideliza</div>
<h1>Termos de uso</h1>
<p class="small">Última atualização: 9 de novembro de 2026.</p>
<h2>1. O serviço</h2>
<p>O Opex Fideliza é uma extensão do Google Chrome que acrescenta ao WhatsApp Web um painel de relacionamento: funil, etiquetas, histórico, lembretes pela Google Agenda, pós-atendimento programado e mensagens de aniversário. É oferecido pela OPEX Business Growth.</p>
<h2>2. Licença, teste e planos</h2>
<p>O teste grátis dura 3 dias e é limitado a um por empresa. Os planos são mensal (R$ 40), semestral (R$ 200) e anual (R$ 350), pagos antecipadamente. Cada licença vale para um computador, salvo combinação diferente. Ao fim do prazo sem renovação, o painel fica bloqueado; os dados locais permanecem no seu navegador.</p>
<h2>3. Uso responsável</h2>
<p>Você se compromete a enviar mensagens apenas a pessoas com quem tem relação de atendimento ou que autorizaram o contato, a respeitar pedidos para não receber mensagens e a cumprir a LGPD e os termos do WhatsApp. É proibido usar o Opex Fideliza para spam, golpes ou conteúdo ilegal. O descumprimento pode levar ao bloqueio da licença.</p>
<h2>4. WhatsApp e Google</h2>
<p>O Opex Fideliza depende do WhatsApp Web e de serviços do Google, que pertencem a terceiros e podem mudar sem aviso. O Opex Fideliza não é afiliado ao WhatsApp, à Meta nem ao Google. Não garantimos que o WhatsApp não restrinja ou bloqueie o seu número; o ritmo seguro de envio reduz o risco, mas não o elimina.</p>
<h2>5. Seus dados</h2>
<p>Os dados dos seus clientes ficam no seu navegador e, se você ativar, no seu Google Drive. Você é responsável por manter o backup ativo. Veja a <a href="privacidade.html">política de privacidade</a>.</p>
<h2>6. Disponibilidade e responsabilidade</h2>
<p>Trabalhamos para manter o serviço funcionando, mas ele é fornecido como está. A OPEX não responde por mensagens não entregues por falha do WhatsApp, do Google, da sua conexão ou por o computador estar desligado, nem por lucros cessantes. A responsabilidade da OPEX se limita ao valor pago pelo plano vigente.</p>
<h2>7. Cancelamento</h2>
<p>Você pode cancelar quando quiser; o acesso segue até o fim do período pago. Pedidos de reembolso em até 7 dias da primeira contratação são atendidos integralmente.</p>
<h2>8. Mudanças</h2>
<p>Estes termos podem ser atualizados. Mudanças relevantes são avisadas pelo painel ou pelo WhatsApp cadastrado.</p>
<h2>9. Contato e foro</h2>
<p>Contato: WhatsApp <a href="${wa('Olá! Tenho uma dúvida sobre os termos do Opex Fideliza.')}" target="_blank" rel="noopener">(79) 98169-7274</a>. Fica eleito o foro de Aracaju/SE.</p>`);

fs.writeFileSync(path.join(out, 'index.html'), page(GENERIC, '', ''));
for (const [k, s] of Object.entries(SEGS)) fs.writeFileSync(path.join(out, 'segmentos', s.file + '.html'), page(s, '../', k));
fs.writeFileSync(path.join(out, 'instalar.html'), instalar);
fs.writeFileSync(path.join(out, 'privacidade.html'), privacidade);
fs.writeFileSync(path.join(out, 'termos.html'), termos);
fs.writeFileSync(path.join(out, 'netlify.toml'), '[build]\n  command = "echo \'sem build\'"\n  publish = "."\n');
console.log('site gerado em', out);
