const pool = require('../models/db');

// OBTENER TODOS
const getAllGrados = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM GRADOS');
    res.json(rows);
  } catch (error) {
    console.error('ERROR getAllGrados:', error);
    res.status(500).json({ error: error.message });
  }
};

// OBTENER POR ID
const getGradoById = async (req, res) => {
  try {
    const id = req.params.id;

    const [rows] = await pool.query(
      'SELECT * FROM GRADOS WHERE ID_GRADO = ?',
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Grado no encontrado' });

    res.json(rows[0]);
  } catch (error) {
    console.error('ERROR getGradoById:', error);
    res.status(500).json({ error: error.message });
  }
};

// CREAR
const createGrado = async (req, res) => {
  try {
    const { nombre_grado, turno } = req.body;

    const [result] = await pool.query(
      'INSERT INTO GRADOS (NOMBRE_GRADO, TURNO) VALUES (?, ?)',
      [nombre_grado, turno]
    );

    res.status(201).json({
      id: result.insertId,
      nombre_grado,
      turno
    });
  } catch (error) {
    console.error('ERROR createGrado:', error);
    res.status(500).json({ error: error.message });
  }
};

// ACTUALIZAR
const updateGrado = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre_grado, turno } = req.body;

    const [exist] = await pool.query('SELECT ID_GRADO FROM GRADOS WHERE ID_GRADO = ?', [id]);
    if (exist.length === 0) return res.status(404).json({ error: 'Grado no encontrado' });

    await pool.query(
      'UPDATE GRADOS SET NOMBRE_GRADO = ?, TURNO = ? WHERE ID_GRADO = ?',
      [nombre_grado, turno, id]
    );

    res.json({ message: 'Grado actualizado' });
  } catch (error) {
    console.error('ERROR updateGrado:', error);
    res.status(500).json({ error: error.message });
  }
};

// ELIMINAR
const deleteGrado = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query('DELETE FROM GRADOS WHERE ID_GRADO = ?', [id]);

    res.json({ message: 'Grado eliminado' });
  } catch (error) {
    console.error('ERROR deleteGrado:', error);
    if (error.errno === 1451)
      return res.status(409).json({ error: 'No se puede eliminar: tiene grupos relacionados' });

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGrados,
  createGrado,
  getGradoById,
  updateGrado,
  deleteGrado
};