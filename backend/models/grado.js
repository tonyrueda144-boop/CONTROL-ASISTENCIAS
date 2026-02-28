const db = require('./db');

class Grado {

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM GRADOS ORDER BY ID_GRADO DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM GRADOS WHERE ID_GRADO = ?',
      [id]
    );
    return rows[0];
  }

  static async create({ nombre_grado, turno }) {
    const [result] = await db.query(
      'INSERT INTO GRADOS (NOMBRE_GRADO, TURNO) VALUES (?, ?)',
      [nombre_grado, turno]
    );
    return { id: result.insertId, nombre_grado, turno };
  }

  static async update(id, { nombre_grado, turno }) {
    const [result] = await db.query(
      'UPDATE GRADOS SET NOMBRE_GRADO = ?, TURNO = ? WHERE ID_GRADO = ?',
      [nombre_grado, turno, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM GRADOS WHERE ID_GRADO = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Grado;