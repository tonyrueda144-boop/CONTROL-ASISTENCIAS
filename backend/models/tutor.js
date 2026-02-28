const db = require('./db');

class Tutor {

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM TUTORES ORDER BY ID_TUTOR DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM TUTORES WHERE ID_TUTOR = ?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      correo,
      direccion,
      parentesco
    } = data;

    const [result] = await db.query(
      `INSERT INTO TUTORES 
      (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO, DIRECCION, PARENTESCO)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, telefono, correo, direccion, parentesco]
    );

    return { id: result.insertId };
  }

  static async update(id, data) {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      correo,
      direccion,
      parentesco
    } = data;

    const [result] = await db.query(
      `UPDATE TUTORES SET
      NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?,
      TELEFONO=?, CORREO=?, DIRECCION=?, PARENTESCO=?
      WHERE ID_TUTOR=?`,
      [nombre, apellido_paterno, apellido_materno, telefono, correo, direccion, parentesco, id]
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM TUTORES WHERE ID_TUTOR=?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Tutor;