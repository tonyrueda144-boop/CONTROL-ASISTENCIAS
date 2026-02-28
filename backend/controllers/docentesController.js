const pool = require('../models/db');

const getAllDocentes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM DOCENTES');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDocenteById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM DOCENTES WHERE ID_DOCENTE = ?',
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Docente no encontrado' });

    res.json(rows[0]);

  } catch (error) {
    console.error('ERROR getDocenteById:', error);
    res.status(500).json({ error: error.message });
  }
};

const createDocente = async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      correo,
      especialidad,
      fecha_contratacion
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO DOCENTES
       (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO, ESPECIALIDAD, FECHA_CONTRATACION)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, telefono, correo, especialidad, fecha_contratacion]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDocente = async (req, res) => {
  try {
    const id = req.params.id;

    const [exist] = await pool.query('SELECT ID_DOCENTE FROM DOCENTES WHERE ID_DOCENTE=?', [id]);
    if (!exist.length)
      return res.status(404).json({ error: 'Docente no encontrado' });

    await pool.query(
      `UPDATE DOCENTES SET
       NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?, TELEFONO=?, CORREO=?,
       ESPECIALIDAD=?, FECHA_CONTRATACION=?
       WHERE ID_DOCENTE=?`,
      [...Object.values(req.body), id]
    );

    res.json({ message: 'Docente actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDocente = async (req, res) => {
  try {
    await pool.query('DELETE FROM DOCENTES WHERE ID_DOCENTE=?', [req.params.id]);
    res.json({ message: 'Docente eliminado' });
  } catch (error) {
    if (error.errno === 1451)
      return res.status(409).json({ error: 'No se puede eliminar: tiene asistencias registradas' });

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllDocentes,
  getDocenteById,
  createDocente,
  updateDocente,
  deleteDocente
};