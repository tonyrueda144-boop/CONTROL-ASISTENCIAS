const db = require('./db');

class Docente {

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM DOCENTES ORDER BY ID_DOCENTE DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM DOCENTES WHERE ID_DOCENTE=?',
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
      especialidad,
      fecha_contratacion
    } = data;

    const [result] = await db.query(
      `INSERT INTO DOCENTES
      (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, TELEFONO, CORREO, ESPECIALIDAD, FECHA_CONTRATACION)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, telefono, correo, especialidad, fecha_contratacion]
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
      especialidad,
      fecha_contratacion
    } = data;

    const [result] = await db.query(
      `UPDATE DOCENTES SET
      NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?,
      TELEFONO=?, CORREO=?, ESPECIALIDAD=?, FECHA_CONTRATACION=?
      WHERE ID_DOCENTE=?`,
      [nombre, apellido_paterno, apellido_materno, telefono, correo, especialidad, fecha_contratacion, id]
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM DOCENTES WHERE ID_DOCENTE=?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Docente;