const db = require('./db');

class Grupo {

  static async findAll() {
    const [rows] = await db.query(`
      SELECT g.*, gr.NOMBRE_GRADO, gr.TURNO
      FROM GRUPOS g
      JOIN GRADOS gr ON g.ID_GRADO = gr.ID_GRADO
      ORDER BY g.ID_GRUPO DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT g.*, gr.NOMBRE_GRADO, gr.TURNO
      FROM GRUPOS g
      JOIN GRADOS gr ON g.ID_GRADO = gr.ID_GRADO
      WHERE g.ID_GRUPO = ?
    `, [id]);
    return rows[0];
  }

  static async create({ nombre_grupo, id_grado }) {
    const [result] = await db.query(
      'INSERT INTO GRUPOS (NOMBRE_GRUPO, ID_GRADO) VALUES (?, ?)',
      [nombre_grupo, id_grado]
    );
    return { id: result.insertId };
  }

  static async update(id, { nombre_grupo, id_grado }) {
    const [result] = await db.query(
      'UPDATE GRUPOS SET NOMBRE_GRUPO=?, ID_GRADO=? WHERE ID_GRUPO=?',
      [nombre_grupo, id_grado, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM GRUPOS WHERE ID_GRUPO=?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Grupo;