const db = require('./db');

class Asistencia {

  static async findAll() {
    const [rows] = await db.query(`
      SELECT a.*,
             al.NOMBRE AS ALUMNO_NOMBRE,
             d.NOMBRE AS DOCENTE_NOMBRE
      FROM ASISTENCIAS a
      JOIN ALUMNOS al ON a.ID_ALUMNO = al.ID_ALUMNO
      JOIN DOCENTES d ON a.ID_DOCENTE = d.ID_DOCENTE
      ORDER BY a.FECHA DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM ASISTENCIAS WHERE ID_ASISTENCIA=?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const { id_alumno, id_docente, fecha, estado, observaciones } = data;

    const [result] = await db.query(
      `INSERT INTO ASISTENCIAS
      (ID_ALUMNO, ID_DOCENTE, FECHA, ESTADO, OBSERVACIONES)
      VALUES (?, ?, ?, ?, ?)`,
      [id_alumno, id_docente, fecha, estado, observaciones]
    );

    return { id: result.insertId };
  }

  static async update(id, data) {
    const { id_alumno, id_docente, fecha, estado, observaciones } = data;

    const [result] = await db.query(
      `UPDATE ASISTENCIAS SET
      ID_ALUMNO=?, ID_DOCENTE=?, FECHA=?, ESTADO=?, OBSERVACIONES=?
      WHERE ID_ASISTENCIA=?`,
      [id_alumno, id_docente, fecha, estado, observaciones, id]
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM ASISTENCIAS WHERE ID_ASISTENCIA=?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Asistencia;