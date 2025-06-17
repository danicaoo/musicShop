const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '' // Сохраняем префикс
      },
      secure: false,
      onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'API server unavailable' });
      }
    })
  );
};