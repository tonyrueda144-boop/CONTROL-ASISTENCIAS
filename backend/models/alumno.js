const db = require('./db');

class Alumno {

  static async findAll() {
    const [rows] = await db.query(`
      SELECT a.*,
             g.NOMBRE_GRUPO,
             gr.NOMBRE_GRADO,
             gr.TURNO,
             t.NOMBRE AS TUTOR_NOMBRE
      FROM ALUMNOS a
      JOIN GRUPOS g ON a.ID_GRUPO = g.ID_GRUPO
      JOIN GRADOS gr ON g.ID_GRADO = gr.ID_GRADO
      JOIN TUTORES t ON a.ID_TUTOR = t.ID_TUTOR
      ORDER BY a.ID_ALUMNO DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT * FROM ALUMNOS WHERE ID_ALUMNO = ?
    `, [id]);
    return rows[0];
  }

  static async create(data) {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      id_grupo,
      id_tutor
    } = data;

    const [result] = await db.query(
      `INSERT INTO ALUMNOS
      (NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO, FECHA_NACIMIENTO, SEXO, CURP, ID_GRUPO, ID_TUTOR)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, id_grupo, id_tutor]
    );

    return { id: result.insertId };
  }

  static async update(id, data) {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      curp,
      id_grupo,
      id_tutor
    } = data;

    const [result] = await db.query(
      `UPDATE ALUMNOS SET
      NOMBRE=?, APELLIDO_PATERNO=?, APELLIDO_MATERNO=?, FECHA_NACIMIENTO=?,
      SEXO=?, CURP=?, ID_GRUPO=?, ID_TUTOR=?
      WHERE ID_ALUMNO=?`,
      [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, curp, id_grupo, id_tutor, id]
    );

    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query(
      'DELETE FROM ALUMNOS WHERE ID_ALUMNO=?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Alumno;