const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfig');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const filmRoutes = require('./routes/filmRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    // tes options existantes
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    frameguard:     { action: 'deny' },
    xssFilter: true,
    noSniff:   true,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    hidePoweredBy: true,
    dnsPrefetchControl: { allow: false },
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },

    /* 🔑  Ajoute l’une des deux lignes ci-dessous */

    // ① Ouvrir uniquement CORP (recommandé) :
    crossOriginResourcePolicy: { policy: 'cross-origin' },

    // ② – ou – désactiver complètement le module :
    // crossOriginResourcePolicy: false,
  })
);


app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/films', filmRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/chat', chatRoutes);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ██████╗██╗███╗   ██╗███████╗███████╗███████╗██████╗ ███████╗
 ██╔════╝██║████╗  ██║██╔════╝██╔════╝██╔════╝██╔══██╗██╔════╝
 ██║     ██║██╔██╗ ██║█████╗  █████╗  █████╗  ██████╔╝███████╗
 ██║     ██║██║╚██╗██║██╔══╝  ██╔══╝  ██╔══╝  ██╔══██╗╚════██║
 ╚██████╗██║██║ ╚████║███████╗██║     ███████╗██║  ██║███████║
  ╚═════╝╚═╝╚═╝  ╚═══╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝

 🎬 CineSphere Server Started
 🔗 http://localhost:${PORT}
 📘 Swagger Docs: http://localhost:${PORT}/api-docs
`);
});

