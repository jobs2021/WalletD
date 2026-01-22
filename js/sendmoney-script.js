/* ================================
   SCRIPT SENDMONEY PAGE - MAXIWALLET
   ================================ */

$(document).ready(function () {
  // Obtener el saldo neto desde localStorage (guardado en transactions.html)
  const netBalance = parseFloat(localStorage.getItem('netBalance')) || 799.75;
  $('#maxAmountDisplay').text('$' + netBalance.toFixed(2));
  console.log('Saldo neto obtenido desde localStorage:', netBalance);

  // Array de contactos disponibles
  const contacts = [
    { label: "Juan Pérez (juan_perez)", value: "juan_perez" },
    { label: "María García (maria_garcia)", value: "maria_garcia" },
    { label: "Carlos López (carlos_lopez)", value: "carlos_lopez" },
    { label: "Ana Martínez (ana_martinez)", value: "ana_martinez" },
    { label: "Pedro Ruiz (pedro_ruiz)", value: "pedro_ruiz" },
    { label: "Laura Sánchez (laura_sanchez)", value: "laura_sanchez" },
    { label: "Roberto Díaz (roberto_diaz)", value: "roberto_diaz" },
    { label: "Sofía Torres (sofia_torres)", value: "sofia_torres" },
  ];

  // Inicializar autocomplete
  $("#recipient").autocomplete({
    source: function (request, response) {
      const term = request.term.toLowerCase();
      const filtered = contacts.filter(function (contact) {
        return (
          contact.label.toLowerCase().includes(term) ||
          contact.value.toLowerCase().includes(term)
        );
      });
      response(filtered);
    },
    minLength: 1,
    select: function (event, ui) {
      $(this).val(ui.item.label);
      return false;
    },
  });

  // Botón para agregar nuevo contacto
  $("#addContactBtn").on("click", function () {
    showAddContactModal();
  });

  //NOTA: Problemas con el SHOWALERT, porque no me muestra el mensaje por encima del formulario, adicionalmente busque y encontre la propiedad z-index, pero no me soluciono el problema.

  // Validaciones del formulario
  $("#sendMoneyForm").on("submit", function (e) {
    e.preventDefault();

    // Validar que se haya seleccionado un destinatario
    const recipient = $("#recipient").val().trim();
    if (!recipient) {
      showAlert("Por favor selecciona un destinatario", "danger");
      return;
    }

    // Validar que el monto sea válido
    const amount = parseFloat($("#amount").val());
    if (isNaN(amount) || amount <= 0) {
      showAlert("Por favor ingresa un monto válido mayor a 0", "danger");
      return;
    }

    if (amount > 5000) {
      showAlert(
        "El monto máximo por transferencia es de $5000.00",
        "danger"
      );
      return;
    }

    // Validar que se haya confirmado la transferencia
    if (!$("#confirmTransfer").is(":checked")) {
      showAlert(
        "Por favor confirma que los datos son correctos",
        "danger"
      );
      return;
    }

    // Si todas las validaciones pasaron
    processTransfer(recipient, amount);
  });

  // Validación en tiempo real del monto
  $("#amount").on("input", function () {
    const value = parseFloat($(this).val());
    if (!isNaN(value) && value > 5000) {
      $(this).addClass("is-invalid");
      $("#amount").next("small").text("Monto máximo: $5000.00");
    } else if (!isNaN(value) && value > 0) {
      $(this).removeClass("is-invalid").addClass("is-valid");
    } else if (!isNaN(value) && value <= 0) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid is-valid");
    }
  });

  // Validación del destinatario
  $("#recipient").on("blur", function () {
    const recipient = $(this).val().trim();
    const isValid = contacts.some(
      (c) => c.label === recipient || c.value === recipient
    );

    if (recipient && !isValid) {
      $(this).addClass("is-invalid");
    } else {
      $(this).removeClass("is-invalid");
    }
  });

  // Habilitar/deshabilitar el botón de envío
  $("input, textarea").on("change", function () {
    const recipient = $("#recipient").val().trim();
    const amount = parseFloat($("#amount").val());
    const confirmed = $("#confirmTransfer").is(":checked");

    const isEnabled =
      recipient && !isNaN(amount) && amount > 0 && confirmed;
    $("#sendBtn").prop("disabled", !isEnabled);
  });

  // Inicializar botón deshabilitado
  $("#sendBtn").prop("disabled", true);
});

// Función para mostrar alertas
function showAlert(message, type = "info") {
  // Crear contenedor de alertas si no existe
  if (!$("#alertContainer").length) {
    $("body").prepend('<div id="alertContainer" class="alert-container"></div>');
  }

  const iconClass = type === "danger" ? "exclamation-circle" : type === "success" ? "check-circle" : "info-circle";
  const alertHTML = `
    <div class="alert alert-${type} alert-top alert-dismissible fade show" role="alert">
      <div class="d-flex align-items-center">
        <i class="bi bi-${iconClass} me-2"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;

  $("#alertContainer").append(alertHTML);

  // Auto-descartar después de 5 segundos
  setTimeout(function () {
    $(".alert-top").first().fadeOut("slow", function () {
      $(this).remove();
    });
  }, 5000);
}

// Función para mostrar modal de agregar contacto
function showAddContactModal() {
  const modalHTML = `
    <div class="modal fade" id="addContactModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-person-plus"></i> Agregar Nuevo Contacto
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="addContactForm">
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="contactName" class="form-label fw-bold">Nombre del Contacto</label>
                  <input type="text" class="form-control border-emerald" id="contactName" placeholder="Ej: Juan Pérez" required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="contactRut" class="form-label fw-bold">RUT</label>
                  <input type="text" class="form-control border-emerald" id="contactRut" placeholder="Ej: 12345678-9" required>
                  <small class="form-text text-muted">Formato: 12345678-9</small>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="contactBank" class="form-label fw-bold">Banco o Entidad Financiera</label>
                  <select class="form-select border-emerald" id="contactBank" required>
                    <option value="">Selecciona 1 banco</option>
                    <optgroup label="Bancos">
                      <option value="banco-estado">Banco Estado</option>
                      <option value="banco-santander">Banco Santander</option>
                      <option value="banco-if">BancoIF</option>
                      <option value="banco-chile">Banco de Chile</option>
                      <option value="scotiabank">Scotiabank</option>
                      <option value="bbva-chile">BBVA Chile</option>
                      <option value="itau">Itaú</option>
                    </optgroup>
                    <optgroup label="Billeteras Digitales">
                      <option value="tenpo">Tenpo</option>
                      <option value="yaydoo">Yaydoo</option>
                      <option value="mach">MACH</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="contactAccountNumber" class="form-label fw-bold">Número de Cuenta</label>
                  <input type="text" class="form-control border-emerald" id="contactAccountNumber" placeholder="Ej: 123456789" required>
                  <small class="form-text text-muted">Solo números</small>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="contactEmail" class="form-label fw-bold">Email</label>
                  <input type="email" class="form-control border-emerald" id="contactEmail" placeholder="Ej: juan@email.com" required>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-success" id="saveContactBtn">
              <i class="bi bi-check-lg"></i> Guardar Contacto
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remover modal anterior si existe
  $("#addContactModal").remove();

  // Agregar modal al body
  $("body").append(modalHTML);

  // Mostrar modal
  const modal = new bootstrap.Modal(document.getElementById("addContactModal"));
  modal.show();

  // Manejar guardado de contacto
  $("#saveContactBtn").on("click", function () {
    const name = $("#contactName").val().trim();
    const rut = $("#contactRut").val().trim();
    const accountNumber = $("#contactAccountNumber").val().trim();
    const bank = $("#contactBank").val().trim();
    const email = $("#contactEmail").val().trim();

    // Validaciones básicas
    if (!name || !rut || !accountNumber || !bank || !email) {
      showAlert("Por favor completa todos los campos", "danger");
      return;
    }

    if (!isValidRut(rut)) {
      showAlert("RUT inválido. Usa el formato: 12345678-9", "danger");
      return;
    }

    if (!isValidAccountNumber(accountNumber)) {
      showAlert("El número de cuenta debe contener solo dígitos", "danger");
      return;
    }

    if (!isValidEmail(email)) {
      showAlert("Por favor ingresa un email válido", "danger");
      return;
    }

    // Si todo es válido, guardar contacto
    showAlert(`Contacto "${name}" agregado exitosamente`, "success");
    modal.hide();

    // Limpiar formulario
    $("#addContactForm")[0].reset();
  });
}

// Función para validar email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Función para validar RUT chileno
function isValidRut(rut) {
  // Formato: 12345678-9 o 123456789
  const rutPattern = /^([0-9]{7,8})-?([kK0-9])$/;
  
  if (!rutPattern.test(rut)) {
    return false;
  }
  
  // Extraer números y dígito verificador
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
  const numbers = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toLowerCase();
  
  // Validar que los números sean válidos
  if (!/^\d+$/.test(numbers)) {
    return false;
  }
  
  return true;
}

// Función para validar número de cuenta (solo dígitos)
function isValidAccountNumber(accountNumber) {
  // Debe contener solo dígitos y tener entre 8 y 20 caracteres
  const accountPattern = /^\d{8,20}$/;
  return accountPattern.test(accountNumber);
}

// Función para procesar la transferencia
function processTransfer(recipient, amount) {
  // Deshabilitar botón durante el proceso
  $("#sendBtn").prop("disabled", true).html(
    '<span class="spinner-border spinner-border-sm me-2"></span> Procesando...'
  );

  // Simular procesamiento
  setTimeout(function () {
    const description = $("#description").val() || "Sin descripción";

    // Mostrar alerta de éxito
    showAlert(
      `Transferencia de $${amount.toFixed(2)} a ${recipient} completada exitosamente`,
      "success"
    );

    // Resetear formulario
    $("#sendMoneyForm")[0].reset();
    $("#confirmTransfer").prop("checked", false);
    $("#sendBtn")
      .prop("disabled", true)
      .html('<i class="bi bi-arrow-left-right"></i> ENVIAR DINERO');

    // Agregar transacción al historial
    addTransactionToHistory(recipient, amount, description);
  }, 2000);
}

// Función para agregar transacción al historial
function addTransactionToHistory(recipient, amount, description) {
  const today = new Date();
  const date = `${String(today.getDate()).padStart(2, "0")}/${String(
    today.getMonth() + 1
  ).padStart(2, "0")}/${today.getFullYear()}`;

  const newRow = `
    <tr>
      <td>${date}</td>
      <td>${recipient}</td>
      <td class="fw-bold text-danger">-$${amount.toFixed(2)}</td>
      <td><span class="badge bg-success">Completado</span></td>
      <td>${description}</td>
    </tr>
  `;

  // Agregar la nueva fila al inicio del tbody
  $("#transactionHistory").prepend(newRow);
}
