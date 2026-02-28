require('dotenv').config();
const express = require('express');
const cors = require('cors');

const gradoRoutes = require('./routes/gradoRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const personalRoutes = require('./routes/personalRoutes');
const asistenciaRoutes = require('./routes/asistenciaRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

/* ==============================
   MIDDLEWARES GLOBALES
============================== */
app.use(cors());
app.use(express.json());

/* ==============================
   RUTAS API
============================== */
app.use('/api/grados', gradoRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/tutores', tutorRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/docentes', docenteRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/asistencias', asistenciaRoutes);

/* ==============================
   HEALTHCHECK
============================== */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API SECUNDARIA_ASISTENCIAS funcionando correctamente'
  });
});

/* ==============================
   MANEJO GLOBAL DE ERRORES
============================== */
app.use(errorHandler);

/* ==============================
   SERVIDOR
============================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});