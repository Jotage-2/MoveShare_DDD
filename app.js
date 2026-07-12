// app.js
// Punto de entrada principal de MoveShare

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./src/contexts/identity/interfaces/authRoutes');
const dashboardRoutes = require('./src/contexts/dashboard/interfaces/dashboardRoutes');
const routeRoutes = require('./src/contexts/trips/interfaces/routeRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// MIDDLEWARE GLOBAL
// ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
const isProduction =
    process.env.NODE_ENV === 'production';

if (isProduction) {
    app.set('trust proxy', 1);
}

app.use(session({
    secret:
        process.env.SESSION_SECRET ||
        'moveshare_secret_key_dev',

    resave: false,
    saveUninitialized: false,

    cookie: {
        secure: isProduction,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// ─────────────────────────────────────────────────────────────
// RUTAS
// ─────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/trips', routeRoutes);
// Página principal (login/registro)
// Landing page principal
app.get('/', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }

  res.sendFile(path.join(__dirname, 'views', 'landing_page.html'));
});

// Página de login / registro
app.get('/login', (req, res) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }

  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ─────────────────────────────────────────────────────────────
// INICIO DEL SERVIDOR
// ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║         MoveShare - Servidor         ║');
  console.log(`  ║   Corriendo en: http://localhost:${PORT}  ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  console.log('  📧 Email configurado:', process.env.EMAIL_USER || '⚠️  No configurado (.env)');
  console.log('');
});

module.exports = app;
