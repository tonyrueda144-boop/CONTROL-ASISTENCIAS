const pool = require('../models/db');

const getAllGrupos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT g.*, gr.NOMBRE_GRADO, gr.TURNO
      FROM GRUPOS g
      JOIN GRADOS gr ON g.ID_GRADO = gr.ID_GRADO
    `);
    res.json(rows);
  } catch (error) {
    console.error('ERROR getAllGrupos:', error);
    res.status(500).json({ error: error.message });
  }
};

const getGrupoById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM GRUPOS WHERE ID_GRUPO = ?',
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Grupo no encontrado' });

    res.json(rows[0]);

  } catch (error) {
    console.error('ERROR getGrupoById:', error);
    res.status(500).json({ error: error.message });
  }
};

const createGrupo = async (req, res) => {
  try {
    const { nombre_grupo, id_grado } = req.body;

    const [result] = await pool.query(
      'INSERT INTO GRUPOS (NOMBRE_GRUPO, ID_GRADO) VALUES (?, ?)',
      [nombre_grupo, id_grado]
    );

    res.status(201).json({ id: result.insertId, nombre_grupo, id_grado });
  } catch (error) {
    console.error('ERROR createGrupo:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateGrupo = async (req, res) => {
  try {
    const id = req.params.id;
    const { nombre_grupo, id_grado } = req.body;

    const [exist] = await pool.query('SELECT ID_GRUPO FROM GRUPOS WHERE ID_GRUPO = ?', [id]);
    if (!exist.length) return res.status(404).json({ error: 'Grupo no encontrado' });

    await pool.query(
      'UPDATE GRUPOS SET NOMBRE_GRUPO = ?, ID_GRADO = ? WHERE ID_GRUPO = ?',
      [nombre_grupo, id_grado, id]
    );

    res.json({ message: 'Grupo actualizado' });
  } catch (error) {
    console.error('ERROR updateGrupo:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteGrupo = async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM GRUPOS WHERE ID_GRUPO = ?', [id]);
    res.json({ message: 'Grupo eliminado' });
  } catch (error) {
    if (error.errno === 1451)
      return res.status(409).json({ error: 'No se puede eliminar: tiene alumnos relacionados' });

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllGrupos,
  createGrupo,
  getGrupoById,
  updateGrupo,
  deleteGrupo
};