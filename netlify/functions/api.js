// Netlify: /api/* chega aqui. Painel em /admin/*; extensão em /verify, /login, /release, /backup e /order.
const { createLicenseService } = require('../../src/licenses');
const { blobsStore } = require('../../src/store');

const json = (status, body) => ({ statusCode: status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, body: JSON.stringify(body) });

let service;
exports.handler = async (event) => {
  // Netlify entrega o contexto do Blobs no evento; sem isso o armazenamento não encontra o site.
  try { require('@netlify/blobs').connectLambda(event); } catch (_) {}
  try {
    if (!service) service = createLicenseService({ store: blobsStore(), secret: process.env.TOKEN_SECRET, adminPassword: process.env.ADMIN_PASSWORD });
    const path = (event.path || '').replace(/^.*\/\.netlify\/functions\/api/, '').replace(/^\/api/, '').replace(/\/+$/, '') || '/';
    const body = event.body ? JSON.parse(event.body) : {};
    const token = (event.headers.authorization || event.headers.Authorization || '').replace(/^Bearer\s+/i, '');
    return json(200, await service.route(event.httpMethod, path, body, token));
  } catch (e) {
    if (e.status) return json(e.status, { ok: false, message: e.message });
    console.error('[api]', e && e.stack ? e.stack : e);
    return json(500, { ok: false, message: 'Erro interno. Tente de novo.' });
  }
};
