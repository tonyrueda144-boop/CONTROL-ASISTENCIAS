const pool = require('../models/db');

// OBTENER TODOS
const getAllAlumnos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*,
             g.NOMBRE_GRUPO,
             gr.NOMBRE_GRADO,
             gr.TURNO,
             t.NOMBRE AS TUTOR_NOMBRE,
             t.APELLIDO_PATERNO AS TUTOR_APELLIDO
      FROM ALUMNOS a
      JOIN GRUPOS g ON a.ID_GRUPO = g.ID_GRUPO
      JOIN GRADOS gr ON g.ID_GRADO = gr.ID_GRADO
      JOIN TUTORES t ON a.ID_TUTOR = t.ID_TUTOR
      LIMIT 200
    `);

    res.json(rows);
  } catch (error) {
    console.error('ERROR getAllAlumnos:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAlumnoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT A.*, 
              G.NOMBRE_GRUPO, 
              GR.NOMBRE_GRADO,
              T.NOMBRE AS NOMBRE_TUTOR
       FROM ALUMNOS A
       JOIN GRUPOS G ON A.ID_GRUPO = G.ID_GRUPO
       JOIN GRADOS GR ON G.ID_GRADO = GR.ID_GRADO
       JOIN TUTORES T ON A.ID_TUTOR = T.ID_TUTOR
       WHERE A.ID_ALUMNO = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Alumno no encontrado' });

    res.json(rows[0]);

  } catch (error) {
    console.error('ERROR getAlumnoById:', error);
    res.status(500).json({ error: error.message });
  }
};
// CREAR
const createAlumno = async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      id_grupo,
      id_tutor
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO ALUMNOS 
       (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, FECHA_NACIMIENTO, SEXO, CURP, ID_GRUPO, ID_TUTOR)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, id_grupo, id_tutor]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('ERROR createAlumno:', error);
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'La CURP ya está registrada' });

    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR
const updateAlumno = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      id_grupo,
      id_tutor
    } = req.body;

    const [exist] = await pool.query('SELECT ID_ALUMNO FROM ALUMNOS WHERE ID_ALUMNO=?', [id]);
    if (!exist.length)
      return res.status(404).json({ error: 'Alumno no encontrado' });

    await pool.query(
      `UPDATE ALUMNOS SET
       NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?, FECHA_NACIMIENTO=?,
       SEXO=?, CURP=?, ID_GRUPO=?, ID_TUTOR=?
       WHERE ID_ALUMNO=?`,
      [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, id_grupo, id_tutor, id]
    );

    res.json({ message: 'Alumno actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR
const deleteAlumno = async (req, res) => {
  try {
    const id = req.params.id;

    const [result] = await pool.query('DELETE FROM ALUMNOS WHERE ID_ALUMNO=?', [id]);

    if (!result.affectedRows)
      return res.status(404).json({ error: 'Alumno no encontrado' });

    res.json({ message: 'Alumno eliminado (asistencias eliminadas en cascada)' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAlumnos,
  createAlumno,
  getAlumnoById,
  updateAlumno,
  deleteAlumno
};