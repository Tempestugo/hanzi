/**
 * Ponto de entrada principal exigido pelo painel da Hostinger.
 * Ele redireciona a execução para o nosso código Node.js compilado.
 */
import fs from 'fs';
import http from 'http';

const serverFile = './dist/server/index.js';

// Se a pasta compilada não existir, cria um "mini-servidor" de resgate para não dar 503
if (!fs.existsSync(serverFile)) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <div style="font-family: system-ui, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #ef4444;">Aplica&ccedil;&atilde;o n&atilde;o compilada</h2>
        <p>O servidor Node.js iniciou com sucesso, mas os arquivos da pasta <strong>dist/</strong> n&atilde;o existem.</p>
        <p>V&aacute; no hPanel da Hostinger, na se&ccedil;&atilde;o do Web App Node.js, e preencha o campo <strong>Comando de Build (Build command)</strong> com:</p>
        <code style="background: #f1f5f9; padding: 12px; border-radius: 6px; display: block; margin: 16px 0; font-size: 16px; font-weight: bold; text-align: center;">npm run build</code>
        <p>Depois, clique em Salvar e Reinicie o aplicativo.</p>
      </div>
    `);
  });
  
  server.listen(process.env.PORT || 3000);
} else {
  // Se o build deu certo, executa o servidor real
  await import(serverFile);
}