const API = "http://localhost:3000/api";

const viewContainer = document.getElementById("view-container");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("closeModal");
const currentViewTitle = document.getElementById("current-view-title");

closeModal.onclick = () => {
  modal.classList.add("hidden");
  setTimeout(() => modalBody.innerHTML = "", 200); // clear after animation
};

/* ================= ICONS SVG ================= */
const icons = {
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
  plus: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`
};

/* ================= AUXILIARES ================= */
async function obtenerOpciones(endpoint) {
  try {
    const res = await fetch(`${API}/${endpoint}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error(`Error obteniendo ${endpoint}:`, err);
    return [];
  }
}

function etiquetaAmigable(campo) {
  const map = {
    nombre_grado: "Nombre del Grado",
    turno: "Turno",
    nombre_grupo: "Nombre del Grupo",
    id_grado: "Grado",
    nombre: "Nombre",
    apellido_paterno: "Apellido Paterno",
    apellido_materno: "Apellido Materno",
    id_grupo: "Grupo",
    id_tutor: "Tutor",
    telefono: "Teléfono",
    correo: "Correo",
    fecha: "Fecha",
    estado: "Estado",
    parentesco: "Parentesco",
    cargo: "Cargo"
  };
  return map[campo] || (campo.charAt(0).toUpperCase() + campo.slice(1).replace(/_/g, ' '));
}

/* ================= DASHBOARD ================= */
async function renderDashboard() {
  currentViewTitle.textContent = "Dashboard General";
  try {
    const endpoints = ["grados", "grupos", "alumnos", "tutores", "docentes", "personal", "asistencias"];
    const responses = await Promise.all(endpoints.map(e => fetch(`${API}/${e}`)));
    const data = await Promise.all(responses.map(r => r.json()));

    const statEmojis = ["📚", "🏷️", "👨‍🎓", "👨‍👩‍👧", "👨‍🏫", "👷‍♂️", "✅"];
    const statNames = ["Grados", "Grupos", "Alumnos Registrados", "Tutores", "Docentes", "Personal Admin", "Asistencias Hoy"];

    viewContainer.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">Resumen de la Plataforma</h2>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">Información general gestionada en el sistema.</p>
        </div>
      </div>
      <div class="dashboard-grid">
        ${data.map((d, i) => `
          <div class="stat-card">
            <div class="stat-icon">${statEmojis[i]}</div>
            <div class="stat-info">
              <p>${statNames[i]}</p>
              <h2>${Array.isArray(d) ? d.length : (d.data?.length || 0)}</h2>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  } catch (error) {
    console.error(error);
    viewContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3>Error de Conexión</h3>
        <p>No se pudo conectar con el servidor Backend (Express). Asegúrate de que está corriendo en el puerto 3000.</p>
        <button class="btn btn-primary" style="margin-top: 16px;" onclick="renderDashboard()">Reintentar</button>
      </div>`;
  }
}

/* ================= TABLA GENERICA ================= */
async function generarTabla(data, columnas, entidad) {

  if (!data || !data.length) return `
    <div class="empty-state">
      <div class="empty-state-icon">📁</div>
      <h3>No hay registros</h3>
      <p>Aún no has agregado ningún elemento en esta sección.</p>
    </div>
  `;

  // Para mostrar nombres de relaciones
  if (entidad === "grupos") {
    const grados = await obtenerOpciones("grados");
    data.forEach(g => {
      const grado = grados.find(gr => gr.ID_GRADO === g.ID_GRADO);
      g.GRADO = grado ? `${grado.NOMBRE_GRADO} - ${grado.TURNO}` : "N/A";
    });
  }

  if (entidad === "alumnos") {
    const grupos = await obtenerOpciones("grupos");
    const tutores = await obtenerOpciones("tutores");
    data.forEach(a => {
      const grupo = grupos.find(g => g.ID_GRUPO === a.ID_GRUPO);
      const tutor = tutores.find(t => t.ID_TUTOR === a.ID_TUTOR);
      a.GRUPO = grupo ? grupo.NOMBRE_GRUPO : "N/A";
      a.TUTOR = tutor ? `${tutor.NOMBRE} ${tutor.APELLIDO_PATERNO}` : "N/A";
    });
  }

  if (entidad === "asistencias") {
    const alumnos = await obtenerOpciones("alumnos");
    data.forEach(a => {
      const alumno = alumnos.find(al => al.ID_ALUMNO === a.ID_ALUMNO);
      a.ALUMNO = alumno ? `${alumno.NOMBRE} ${alumno.APELLIDO_PATERNO}` : "";

      // Formatear Fecha
      if (a.FECHA) {
        const date = new Date(a.FECHA);
        a.FECHA_FMT = date.toLocaleDateString();
      }
    });

    columnas = columnas.map(c => c === 'FECHA' ? 'FECHA_FMT' : c);
  }

  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            ${columnas.map(c => `<th>${c.replace('_FMT', '')}</th>`).join("")}
            <th style="width: 100px; text-align: center;">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columnas.map(c => {
    let val = row[c] ?? row[c.toUpperCase()];
    if (c.toUpperCase() === 'ESTADO') {
      const badgeClass = val === 'PRESENTE' ? 'badge-active' : 'badge-inactive';
      val = `<span class="badge ${badgeClass}">${val}</span>`;
    }
    return `<td>${val || "-"}</td>`;
  }).join("")}
              <td>
                <div class="table-actions">
                  <button class="btn btn-icon btn-edit" title="Editar"
                    onclick="editarRegistro('${entidad}', ${row[Object.keys(row).find(k => k.startsWith('ID'))]})">${icons.edit}</button>
                  <button class="btn btn-icon btn-delete" title="Eliminar"
                    onclick="confirmarEliminar('${entidad}', ${row[Object.keys(row).find(k => k.startsWith('ID'))]})">${icons.delete}</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* ================= RENDER ENTIDAD ================= */
async function renderEntidad(entidad, columnas) {
  currentViewTitle.textContent = "Gestión de " + (entidad.charAt(0).toUpperCase() + entidad.slice(1));
  try {
    const res = await fetch(`${API}/${entidad}`);
    if (!res.ok) throw new Error("Error servidor");
    const data = await res.json();

    const tablaHTML = await generarTabla(data, columnas, entidad);

    viewContainer.innerHTML = `
      <div class="section-header">
        <div>
          <h2 class="section-title">Listado de ${entidad.charAt(0).toUpperCase() + entidad.slice(1)}</h2>
        </div>
        <button class="btn btn-primary" onclick="modalCrear('${entidad}')">
          ${icons.plus} Nuevo Registro
        </button>
      </div>
      ${tablaHTML}
    `;
  } catch (error) {
    console.error(error);
    viewContainer.innerHTML = "<p>Error al cargar datos. Verifica la conexión con el servidor.</p>";
  }
}

/* ================= CAMPOS POR ENTIDAD ================= */
function obtenerCampos(entidad) {
  const config = {
    grados: ["nombre_grado", "turno"],
    grupos: ["nombre_grupo", "id_grado"],
    tutores: ["nombre", "apellido_paterno", "apellido_materno", "parentesco", "telefono", "correo"],
    alumnos: ["nombre", "apellido_paterno", "apellido_materno", "id_grupo", "id_tutor"],
    docentes: ["nombre", "apellido_paterno", "apellido_materno", "telefono", "correo"],
    personal: ["nombre", "apellido_paterno", "apellido_materno", "cargo", "telefono"],
    asistencias: ["id_alumno", "fecha", "estado", "observaciones"]
  };
  return config[entidad] || [];
}

/* ================= CREAR ================= */
async function modalCrear(entidad) {
  modalTitle.textContent = `Registrar ${entidad.slice(0, -1)}`;

  let camposHTML = "";

  if (entidad === "grados") {
    camposHTML = `
      <div class="form-group">
        <label>${etiquetaAmigable("nombre_grado")}</label>
        <input class="form-control" name="nombre_grado" required placeholder="Ej: Primero">
      </div>
      <div class="form-group">
        <label>${etiquetaAmigable("turno")}</label>
        <select class="form-control" name="turno" required>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
        </select>
      </div>
    `;
  } else if (entidad === "grupos") {
    const grados = await obtenerOpciones("grados");
    camposHTML = `
      <div class="form-group">
        <label>${etiquetaAmigable("nombre_grupo")}</label>
        <input class="form-control" name="nombre_grupo" required placeholder="Ej: A">
      </div>
      <div class="form-group">
        <label>${etiquetaAmigable("id_grado")}</label>
        <select class="form-control" name="id_grado" required>
          <option value="" disabled selected>Seleccione un grado</option>
          ${grados.map(g => `<option value="${g.ID_GRADO}">${g.NOMBRE_GRADO} - ${g.TURNO}</option>`).join("")}
        </select>
      </div>
    `;
  } else if (entidad === "alumnos") {
    const grupos = await obtenerOpciones("grupos");
    const tutores = await obtenerOpciones("tutores");
    camposHTML = `
      <div class="form-group">
        <label>${etiquetaAmigable("nombre")}</label>
        <input class="form-control" name="nombre" required>
      </div>
      <div class="form-group" style="display:flex; gap:12px;">
        <div style="flex:1;">
            <label>${etiquetaAmigable("apellido_paterno")}</label>
            <input class="form-control" name="apellido_paterno" required>
        </div>
        <div style="flex:1;">
            <label>${etiquetaAmigable("apellido_materno")}</label>
            <input class="form-control" name="apellido_materno" required>
        </div>
      </div>
      <div class="form-group">
        <label>${etiquetaAmigable("id_grupo")}</label>
        <select class="form-control" name="id_grupo" required>
          <option value="" disabled selected>Seleccione un grupo</option>
          ${grupos.map(g => `<option value="${g.ID_GRUPO}">${g.NOMBRE_GRUPO}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>${etiquetaAmigable("id_tutor")}</label>
        <select class="form-control" name="id_tutor" required>
          <option value="" disabled selected>Seleccione un tutor</option>
          ${tutores.map(t => `<option value="${t.ID_TUTOR}">${t.NOMBRE} ${t.APELLIDO_PATERNO}</option>`).join("")}
        </select>
      </div>
    `;
  } else if (entidad === "asistencias") {
    const alumnos = await obtenerOpciones("alumnos");
    camposHTML = `
      <div class="form-group">
        <label>${etiquetaAmigable("id_alumno")}</label>
        <select class="form-control" name="id_alumno" required>
          <option value="" disabled selected>Seleccione un alumno</option>
          ${alumnos.map(a => `<option value="${a.ID_ALUMNO}">${a.NOMBRE} ${a.APELLIDO_PATERNO}</option>`).join("")}
        </select>
      </div>
      <div class="form-group">
        <label>${etiquetaAmigable("fecha")}</label>
        <input class="form-control" type="date" name="fecha" required>
      </div>
      <div class="form-group">
        <label>${etiquetaAmigable("estado")}</label>
        <select class="form-control" name="estado" required>
          <option value="PRESENTE">PRESENTE</option>
          <option value="FALTA">FALTA</option>
          <option value="RETARDO">RETARDO</option>
          <option value="JUSTIFICADO">JUSTIFICADO</option>
        </select>
      </div>
      <div class="form-group">
        <label>${etiquetaAmigable("observaciones")}</label>
        <input class="form-control" name="observaciones">
      </div>
    `;
  } else {
    // Generico para Docentes, Personal, Tutores
    camposHTML = obtenerCampos(entidad)
      .map(c => `
        <div class="form-group">
          <label>${etiquetaAmigable(c)}</label>
          <input class="form-control" name="${c}" required ${c === 'correo' ? 'type="email"' : ''}>
        </div>
      `).join("");
  }

  modalBody.innerHTML = `
    <form id="formCrear">
      ${camposHTML}
      <div class="modal-footer">
        <button type="button" class="btn" onclick="document.getElementById('closeModal').click()">Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar Registro</button>
      </div>
    </form>
  `;

  document.getElementById("formCrear").onsubmit = async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch(`${API}/${entidad}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Error al crear");
        return;
      }
      document.getElementById('closeModal').click();
      cargarVistaActual(entidad);
    } catch (error) {
      console.error(error);
      alert("Error en el servidor");
    }
  };

  modal.classList.remove("hidden");
}

/* ================= EDITAR ================= */
async function editarRegistro(entidad, id) {
  try {
    const res = await fetch(`${API}/${entidad}/${id}`);
    if (!res.ok) throw new Error("Error servidor");
    const datos = await res.json();

    let camposHTML = "";

    if (entidad === "grados") {
      camposHTML = `
        <div class="form-group">
          <label>${etiquetaAmigable("nombre_grado")}</label>
          <input class="form-control" name="nombre_grado" value="${datos.nombre_grado || datos.NOMBRE_GRADO}" required>
        </div>
        <div class="form-group">
          <label>${etiquetaAmigable("turno")}</label>
          <select class="form-control" name="turno" required>
            <option value="Matutino" ${(datos.turno || datos.TURNO) === "Matutino" ? "selected" : ""}>Matutino</option>
            <option value="Vespertino" ${(datos.turno || datos.TURNO) === "Vespertino" ? "selected" : ""}>Vespertino</option>
          </select>
        </div>
      `;
    } else if (entidad === "grupos") {
      const grados = await obtenerOpciones("grados");
      camposHTML = `
        <div class="form-group">
          <label>${etiquetaAmigable("nombre_grupo")}</label>
          <input class="form-control" name="nombre_grupo" value="${datos.nombre_grupo || datos.NOMBRE_GRUPO}" required>
        </div>
        <div class="form-group">
          <label>${etiquetaAmigable("id_grado")}</label>
          <select class="form-control" name="id_grado" required>
            ${grados.map(g => `<option value="${g.ID_GRADO}" ${g.ID_GRADO === (datos.id_grado || datos.ID_GRADO) ? "selected" : ""}>${g.NOMBRE_GRADO} - ${g.TURNO}</option>`).join("")}
          </select>
        </div>
      `;
    } else if (entidad === "alumnos") {
      const grupos = await obtenerOpciones("grupos");
      const tutores = await obtenerOpciones("tutores");
      camposHTML = `
         <div class="form-group">
          <label>${etiquetaAmigable("nombre")}</label>
          <input class="form-control" name="nombre" value="${datos.nombre || datos.NOMBRE}" required>
        </div>
        <div class="form-group" style="display:flex; gap:12px;">
          <div style="flex:1;">
              <label>${etiquetaAmigable("apellido_paterno")}</label>
              <input class="form-control" name="apellido_paterno" value="${datos.apellido_paterno || datos.APELLIDO_PATERNO}" required>
          </div>
          <div style="flex:1;">
              <label>${etiquetaAmigable("apellido_materno")}</label>
              <input class="form-control" name="apellido_materno" value="${datos.apellido_materno || datos.APELLIDO_MATERNO}" required>
          </div>
        </div>
        <div class="form-group">
          <label>${etiquetaAmigable("id_grupo")}</label>
          <select class="form-control" name="id_grupo" required>
            ${grupos.map(g => `<option value="${g.ID_GRUPO}" ${g.ID_GRUPO === (datos.id_grupo || datos.ID_GRUPO) ? "selected" : ""}>${g.NOMBRE_GRUPO}</option>`).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>${etiquetaAmigable("id_tutor")}</label>
          <select class="form-control" name="id_tutor" required>
            ${tutores.map(t => `<option value="${t.ID_TUTOR}" ${t.ID_TUTOR === (datos.id_tutor || datos.ID_TUTOR) ? "selected" : ""}>${t.NOMBRE} ${t.APELLIDO_PATERNO}</option>`).join("")}
          </select>
        </div>
      `;
    } else if (entidad === "asistencias") {
      const alumnos = await obtenerOpciones("alumnos");
      // Formatear date para el input
      let dateVal = "";
      if (datos.fecha || datos.FECHA) {
        const d = new Date(datos.fecha || datos.FECHA);
        dateVal = d.toISOString().split('T')[0];
      }

      camposHTML = `
          <div class="form-group">
            <label>${etiquetaAmigable("id_alumno")}</label>
            <select class="form-control" name="id_alumno" required>
              ${alumnos.map(a => `<option value="${a.ID_ALUMNO}" ${a.ID_ALUMNO === (datos.id_alumno || datos.ID_ALUMNO) ? "selected" : ""}>${a.NOMBRE} ${a.APELLIDO_PATERNO}</option>`).join("")}
            </select>
          </div>
          <div class="form-group">
            <label>${etiquetaAmigable("fecha")}</label>
            <input class="form-control" type="date" name="fecha" value="${dateVal}" required>
          </div>
          <div class="form-group">
            <label>${etiquetaAmigable("estado")}</label>
            <select class="form-control" name="estado" required>
              <option value="PRESENTE" ${(datos.estado || datos.ESTADO) === "PRESENTE" ? "selected" : ""}>PRESENTE</option>
              <option value="FALTA" ${(datos.estado || datos.ESTADO) === "FALTA" ? "selected" : ""}>FALTA</option>
              <option value="RETARDO" ${(datos.estado || datos.ESTADO) === "RETARDO" ? "selected" : ""}>RETARDO</option>
              <option value="JUSTIFICADO" ${(datos.estado || datos.ESTADO) === "JUSTIFICADO" ? "selected" : ""}>JUSTIFICADO</option>
            </select>
          </div>
          <div class="form-group">
            <label>${etiquetaAmigable("observaciones")}</label>
            <input class="form-control" name="observaciones" value="${datos.observaciones || datos.OBSERVACIONES || ""}">
          </div>
        `;
    } else {
      camposHTML = obtenerCampos(entidad)
        .map(c => `
          <div class="form-group">
            <label>${etiquetaAmigable(c)}</label>
            <input class="form-control" name="${c}" value="${datos[c] ?? datos[c.toUpperCase()] ?? ""}" required ${c === 'correo' ? 'type="email"' : ''}>
          </div>
        `).join("");
    }

    modalTitle.textContent = `Actualizar Información`;
    modalBody.innerHTML = `
      <form id="formEditar">
        ${camposHTML}
        <div class="modal-footer">
            <button type="button" class="btn" onclick="document.getElementById('closeModal').click()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Actualizar Cambios</button>
        </div>
      </form>
    `;

    document.getElementById("formEditar").onsubmit = async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));

      const update = await fetch(`${API}/${entidad}/${id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!update.ok) {
        const error = await update.json();
        alert(error.error || "Error al actualizar");
        return;
      }

      document.getElementById('closeModal').click();
      cargarVistaActual(entidad);
    };

    modal.classList.remove("hidden");

  } catch (error) {
    console.error(error);
    alert("Error al cargar registro");
  }
}

/* ================= ELIMINAR ================= */
async function eliminarRegistro(entidad, id) {
  try {
    const res = await fetch(`${API}/${entidad}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const error = await res.json();
      alert(error.error || "Error al eliminar. Puede que el registro esté siendo usado en otra tabla.");
      return;
    }
    document.getElementById('closeModal').click();
    cargarVistaActual(entidad);
  } catch (error) {
    console.error(error);
    alert("Error del servidor");
  }
}

function confirmarEliminar(entidad, id) {
  modalTitle.textContent = "Confirmar Acción";
  modalBody.innerHTML = `
    <div style="text-align:center; padding: 20px 0;">
      <div style="font-size: 40px; margin-bottom: 16px;">⚠️</div>
      <p style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 8px;">¿Seguro que deseas eliminar este registro?</p>
      <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 24px;">Esta acción no se puede deshacer y eliminará permanentemente la información.</p>
      
      <div style="display:flex; justify-content:center; gap:12px;">
        <button class="btn" onclick="document.getElementById('closeModal').click()">Cancelar</button>
        <button class="btn btn-danger" id="btnConfirmDelete">Sí, Eliminar</button>
      </div>
    </div>
  `;
  document.getElementById("btnConfirmDelete").onclick = () => eliminarRegistro(entidad, id);
  modal.classList.remove("hidden");
}

/* ================= NAVEGACION ================= */
function cargarVistaActual(entidad) {
  const config = {
    grados: ["ID_GRADO", "NOMBRE_GRADO", "TURNO"],
    grupos: ["ID_GRUPO", "NOMBRE_GRUPO", "GRADO"],
    tutores: ["ID_TUTOR", "NOMBRE", "APELLIDO_PATERNO", "APELLIDO_MATERNO", "PARENTESCO", "TELEFONO"],
    alumnos: ["ID_ALUMNO", "NOMBRE", "APELLIDO_PATERNO", "APELLIDO_MATERNO", "GRUPO", "TUTOR"],
    docentes: ["ID_DOCENTE", "NOMBRE", "APELLIDO_PATERNO", "APELLIDO_MATERNO", "TELEFONO", "CORREO"],
    personal: ["ID_PERSONAL", "NOMBRE", "APELLIDO_PATERNO", "APELLIDO_MATERNO", "CARGO", "TELEFONO"],
    asistencias: ["ID_ASISTENCIA", "ALUMNO", "FECHA", "ESTADO", "OBSERVACIONES"]
  };
  renderEntidad(entidad, config[entidad]);
}

/* ================= EVENTOS ================= */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sidebar-nav li[data-view]").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelector(".active")?.classList.remove("active");
      item.classList.add("active");
      const view = item.dataset.view;
      if (view === "dashboard") renderDashboard();
      else cargarVistaActual(view);
    });
  });
  renderDashboard();
  document.querySelector('[data-view="dashboard"]')?.classList.add("active");
});