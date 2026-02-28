const pool = require('../models/db');

const getAllTutores = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM TUTORES');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTutorById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM TUTORES WHERE ID_TUTOR = ?',
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Tutor no encontrado' });

    res.json(rows[0]);

  } catch (error) {
    console.error('ERROR getTutorById:', error);
    res.status(500).json({ error: error.message });
  }
};

const createTutor = async (req, res) => {
  try {
    const { nombre, apellido_paterno, apellido_materno, telefono, correo, direccion, parentesco } = req.body;

    const [result] = await pool.query(
      `INSERT INTO TUTORES (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO, DIRECCION, PARENTESCO)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, telefono, correo, direccion, parentesco]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTutor = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre, apellido_paterno, apellido_materno, telefono, correo, direccion, parentesco } = req.body;

    await pool.query(
      `UPDATE TUTORES SET 
       NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?, TELEFONO=?, CORREO=?, DIRECCION=?, PARENTESCO=?
       WHERE ID_TUTOR=?`,
      [nombre, apellido_paterno, apellido_materno, telefono, correo, direccion, parentesco, id]
    );

    res.json({ message: 'Tutor actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTutor = async (req, res) => {
  try {
    await pool.query('DELETE FROM TUTORES WHERE ID_TUTOR=?', [req.params.id]);
    res.json({ message: 'Tutor eliminado' });
  } catch (error) {
    if (error.errno === 1451)
      return res.status(409).json({ error: 'No se puede eliminar: tiene alumnos asociados' });

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllTutores,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor
};