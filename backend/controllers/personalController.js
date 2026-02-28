const pool = require('../models/db');

const getAllPersonal = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM PERSONAL');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPersonalById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM PERSONAL WHERE ID_PERSONAL = ?',
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Personal no encontrado' });

    res.json(rows[0]);

  } catch (error) {
    console.error('ERROR getPersonalById:', error);
    res.status(500).json({ error: error.message });
  }
};

const createPersonal = async (req, res) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      cargo,
      telefono,
      correo,
      fecha_ingreso
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO PERSONAL
       (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, CARGO, TELEFONO, CORREO, FECHA_INGRESO)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, cargo, telefono, correo, fecha_ingreso]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePersonal = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query(
      `UPDATE PERSONAL SET
       NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?, CARGO=?, TELEFONO=?,
       CORREO=?, FECHA_INGRESO=?
       WHERE ID_PERSONAL=?`,
      [...Object.values(req.body), id]
    );

    res.json({ message: 'Personal actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePersonal = async (req, res) => {
  try {
    await pool.query('DELETE FROM PERSONAL WHERE ID_PERSONAL=?', [req.params.id]);
    res.json({ message: 'Personal eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPersonal,
  getPersonalById,
  createPersonal,
  updatePersonal,
  deletePersonal
};