/* ================================
   SCRIPT DEPOSIT PAGE - MAXIWALLET
   ================================ */

// VALIDACIÓN DE EMAIL
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// MOSTRAR ALERTA
function showAlert(message, type = 'error') {
    const alertHTML = `
        <div class="alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 1050; min-width: 300px;">
            <i class="bi bi-${type === 'error' ? 'exclamation-circle' : 'check-circle'}-fill" style="margin-right: 10px;"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    $('body').append(alertHTML);
    
    // Auto-cierre después de 4 segundos
    setTimeout(() => {
        $('.alert').fadeOut(() => {
            $('.alert').remove();
        });
    }, 4000);
}

// RESALTAR CAMPO CON ERROR
function highlightField(field, highlight = true) {
    if (highlight) {
        field.addClass('is-invalid').css('border-color', '#dc3545');
    } else {
        field.removeClass('is-invalid').css('border-color', '#e5e7eb');
    }
}

// FORMATEAR NÚMERO (cantidad)
function formatNumberInput(input) {
    let value = input.value.replace(/[^\d.]/g, '');
    
    if (value.indexOf('.') > -1) {
        const parts = value.split('.');
        value = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '') + '.' + parts[1].substring(0, 2);
    }
    
    input.value = value;
}

// FORMATEAR NÚMERO DE TARJETA
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^\d]/g, '').substring(0, 16);
    
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
}

// MOSTRAR/OCULTAR CAMPO NÚMERO DE TARJETA
function toggleCardNumberField() {
    const paymentMethod = $('#paymentMethod').val();
    const cardNumberGroup = $('#cardNumberGroup');
    const cardNumberInput = $('#cardNumber');
    
    if (paymentMethod === 'credit' || paymentMethod === 'debit') {
        cardNumberGroup.slideDown(300);
        cardNumberInput.focus();
    } else {
        cardNumberGroup.slideUp(300);
        cardNumberInput.val('').removeClass('is-invalid');
    }
}

// EVENT LISTENERS
$(document).ready(function() {
    
    // Mostrar/ocultar campo de tarjeta al cambiar método de pago
    $('#paymentMethod').on('change', function() {
        toggleCardNumberField();
    });
    
    // Formatear cantidad mientras se escribe
    $('#amount').on('input', function() {
        formatNumberInput(this);
        highlightField($(this), false);
    });
    
    // Formatear número de tarjeta mientras se escribe
    $('#cardNumber').on('input', function() {
        formatCardNumber(this);
        highlightField($(this), false);
    });
    
    // Remover validación visual al escribir en otros campos
    $('#paymentMethod').on('change', function() {
        highlightField($(this), false);
    });
    
    $('#agreeTerms').on('change', function() {
        highlightField($(this), false);
    });
    
    // VALIDACIÓN Y ENVÍO DEL FORMULARIO
    $('#depositBtn').on('click', function(e) {
        e.preventDefault();
        
        const amount = parseFloat($('#amount').val());
        const paymentMethod = $('#paymentMethod').val();
        const cardNumber = $('#cardNumber').val();
        const agreeTerms = $('#agreeTerms').is(':checked');
        
        let isValid = true;
        let errorMessage = '';
        
        // VALIDAR CANTIDAD
        if (!amount || amount <= 0) {
            highlightField($('#amount'), true);
            errorMessage = 'Por favor ingresa una cantidad válida mayor a 0';
            isValid = false;
        }
        
        // VALIDAR MÉTODO DE PAGO
        if (!paymentMethod || paymentMethod === '') {
            highlightField($('#paymentMethod'), true);
            if (!errorMessage) {
                errorMessage = 'Por favor selecciona un método de pago';
            }
            isValid = false;
        }
        
        // VALIDAR NÚMERO DE TARJETA SI ES NECESARIO
        if ((paymentMethod === 'credit' || paymentMethod === 'debit') && cardNumber.replace(/\s/g, '').length < 16) {
            highlightField($('#cardNumber'), true);
            if (!errorMessage) {
                errorMessage = 'Por favor ingresa un número de tarjeta válido (16 dígitos)';
            }
            isValid = false;
        }
        
        // VALIDAR TÉRMINOS
        if (!agreeTerms) {
            highlightField($('#agreeTerms'), true);
            if (!errorMessage) {
                errorMessage = 'Debes aceptar los términos y condiciones';
            }
            isValid = false;
        }
        
        // SI HAY ERRORES, MOSTRAR ALERTA
        if (!isValid) {
            showAlert(errorMessage, 'error');
            return;
        }
        
        // SIMULACIÓN DE DEPÓSITO EXITOSO
        showAlert(`¡Depósito de $${amount.toFixed(2)} procesado exitosamente! 🎉`, 'success');
        
        // OPCIONAL: Limpiar formulario
        setTimeout(() => {
            $('#depositForm')[0].reset();
            $('#cardNumberGroup').slideUp(300);
        }, 1000);
    });
    
    // ENVÍO CON TECLA ENTER
    $('#amount, #paymentMethod, #cardNumber').on('keypress', function(e) {
        if (e.which === 13) {
            $('#depositBtn').click();
        }
    });
    
    // TOGGLE DE ENLACES (si hay)
    $('.toggle-signup').on('click', function(e) {
        e.preventDefault();
        // Redirigir o mostrar formulario de registro si es necesario
    });
});
