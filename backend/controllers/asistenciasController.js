const pool = require('../models/db');

const getAllAsistencias = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, 
             al.NOMBRE AS ALUMNO_NOMBRE
      FROM ASISTENCIAS a
      JOIN ALUMNOS al ON a.ID_ALUMNO = al.ID_ALUMNO
      ORDER BY a.FECHA DESC
      LIMIT 300
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAsistenciaById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT ASI.*, 
              A.NOMBRE AS NOMBRE_ALUMNO
       FROM ASISTENCIAS ASI
       JOIN ALUMNOS A ON ASI.ID_ALUMNO = A.ID_ALUMNO
       WHERE ASI.ID_ASISTENCIA = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Asistencia no encontrada' });

    res.json(rows[0]);

  } catch (error) {
    console.error('ERROR getAsistenciaById:', error);
    res.status(500).json({ error: error.message });
  }
};

const createAsistencia = async (req, res) => {
  try {
    const { id_alumno, fecha, estado, observaciones } = req.body;

    const [result] = await pool.query(
      `INSERT INTO ASISTENCIAS
       (ID_ALUMNO, FECHA, ESTADO, OBSERVACIONES)
       VALUES (?, ?, ?, ?)`,
      [id_alumno, fecha, estado, observaciones || null]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'El alumno ya tiene asistencia registrada en esa fecha' });

    res.status(500).json({ error: error.message });
  }
};

const updateAsistencia = async (req, res) => {
  try {
    const id = req.params.id;
    const { id_alumno, fecha, estado, observaciones } = req.body;

    await pool.query(
      `UPDATE ASISTENCIAS SET
       ID_ALUMNO=?, FECHA=?, ESTADO=?, OBSERVACIONES=?
       WHERE ID_ASISTENCIA=?`,
      [id_alumno, fecha, estado, observaciones || null, id]
    );

    res.json({ message: 'Asistencia actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAsistencia = async (req, res) => {
  try {
    await pool.query('DELETE FROM ASISTENCIAS WHERE ID_ASISTENCIA=?', [req.params.id]);
    res.json({ message: 'Asistencia eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAsistencias,
  getAsistenciaById,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia
};