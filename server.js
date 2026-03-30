/**
 * Ponto de entrada principal exigido pelo painel da Hostinger.
 * Ele redireciona a execução para o nosso código Node.js compilado.
 */
import fs from 'fs';
import http from 'http';

const serverFile = './dist/server/index.js';

async function start() {
  if (!fs.existsSync(serverFile)) {
    serveError("Aplica&ccedil;&atilde;o n&atilde;o compilada", "A pasta dist/server n&atilde;o foi encontrada. O build falhou.");
    return;
  }

  try {
    // Tenta ligar o servidor real com o Express
    await import(serverFile);
  } catch (err) {
    // Se o código crashar por falta de dependências, pega o erro e joga na tela
    serveError("Erro interno no Node.js", err.stack || err.message);
  }
}

function serveError(title, message) {
  const server = http.createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <div style="font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333;">
        <h2 style="color: #ef4444;">${title}</h2>
        <pre style="background: #f1f5f9; padding: 16px; border-radius: 6px; overflow-x: auto; font-size: 14px;">${message}</pre>
      </div>
    `);
  });
  server.listen(process.env.PORT || 3000);
}

start();