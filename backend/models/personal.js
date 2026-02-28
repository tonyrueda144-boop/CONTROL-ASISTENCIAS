const db = require('./db');

class Personal {

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM PERSONAL ORDER BY ID_PERSONAL DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM PERSONAL WHERE ID_PERSONAL=?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      cargo,
      telefono,
      correo,
      fecha_ingreso
    } = data;

    const [result] = await db.query(
      `INSERT INTO PERSONAL
      (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, CARGO, TELEFONO, CORREO, FECHA_INGRESO)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, cargo, telefono, correo, fecha_ingreso]
    );

    return { id: result.insertId };
  }

  static async update(id, data) {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      cargo,
      telefono,
      correo,
      fecha_ingreso
    } = data;

    const [result] = await db.query(
      `UPDATE PERSONAL SET
      NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?,
      CARGO=?, TELEFONO=?, CORREO=?, FECHA_INGRESO=?
      WHERE ID_PERSONAL=?`,
      [nombre, apellido_paterno, apellido_materno, cargo, telefono, correo, fecha_ingreso, id]
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM PERSONAL WHERE ID_PERSONAL=?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Personal;