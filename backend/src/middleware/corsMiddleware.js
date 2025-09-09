// src/middleware/corsMiddleware.js
const cors = require('cors');

const getCorsOptions = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // URLs permitidas - ESPECÍFICO PARA CLOUDFLARE
  const allowedOrigins = [
    'https://julstracker.tech',
    'https://www.julstracker.tech',
    'http://julstracker.tech', // Cloudflare puede enviar HTTP internamente
    'http://www.julstracker.tech',
    process.env.FRONTEND_URL || 'https://julstracker.tech'
  ];

  // En desarrollo agregar localhost
  if (isDevelopment) {
    allowedOrigins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001'
    );
  }

  return {
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (aplicaciones móviles, Postman, Cloudflare, etc.)
      if (!origin) return callback(null, true);
      
      // En desarrollo, ser más permisivo
      if (isDevelopment) {
        return callback(null, true);
      }
      
      // Verificar lista de origins permitidos
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`⚠️ Origin bloqueado por CORS: ${origin}`);
        console.warn(`Allowed origins:`, allowedOrigins);
        return callback(null, true); // Ser permisivo con Cloudflare inicialmente
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'X-Real-IP',
      'X-Forwarded-For',
      'CF-Connecting-IP',
      'CF-Ray',
      'CF-Visitor'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    maxAge: 86400
  };
};

// Middleware para logging CORS específico para Cloudflare
const corsLogger = (req, res, next) => {
  const origin = req.headers.origin || 'No origin';
  const cfConnectingIp = req.headers['cf-connecting-ip'] || 'No CF-IP';
  const cfRay = req.headers['cf-ray'] || 'No CF-Ray';
  
  console.log(`🔗 CORS Request - Origin: ${origin}, CF-IP: ${cfConnectingIp}, CF-Ray: ${cfRay}, Method: ${req.method}, URL: ${req.url}`);
  next();
};

// Configuración para Socket.IO con Cloudflare
const getSocketCorsOptions = () => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  return {
    origin: isDevelopment ? "*" : [
      'https://julstracker.tech',
      'https://www.julstracker.tech',
      'http://julstracker.tech', // Cloudflare interno
      'http://www.julstracker.tech'
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true // Compatibilidad con versiones anteriores de Socket.IO
  };
};

module.exports = {
  corsMiddleware: cors(getCorsOptions()),
  corsLogger,
  getSocketCorsOptions
};