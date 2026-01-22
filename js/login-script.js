/**
 * LOGIN SCRIPT - MAXIWALLET
 * Manejo de eventos e interactividad de la página de login
 */

$(document).ready(function() {
    
    // =======================================
    // TOGGLE PASSWORD VISIBILITY
    // =======================================
    let passwordVisible = false;
    
    $('#togglePassword').on('click', function() {
        const passwordField = $('#password');
        const toggleIcon = $(this).find('i');
        
        if (passwordVisible) {
            passwordField.attr('type', 'password');
            toggleIcon.removeClass('bi-eye-slash').addClass('bi-eye');
            passwordVisible = false;
        } else {
            passwordField.attr('type', 'text');
            toggleIcon.removeClass('bi-eye').addClass('bi-eye-slash');
            passwordVisible = true;
        }
    });
    
    // =======================================
    // NOTA: Se valida el formulario con campos y formatos
    // =======================================
    $('#btnEntrar').on('click', function(e) {
        e.preventDefault();
        
        const email = $('#email').val().trim();
        const password = $('#password').val().trim();
        
        // Validar campos no vacíos
        if (email === '' || password === '') {
            showAlert('⚠️ Por favor, completa todos los campos', 'warning');
            return false;
        }
        
        // Validar formato email
        if (!isValidEmail(email)) {
            showAlert('⚠️ Por favor, ingresa un email válido', 'warning');
            highlightField($('#email'));
            return false;
        }
        
        // Validar longitud contraseña
        if (password.length < 6) {
            showAlert('⚠️ La contraseña debe tener al menos 6 caracteres', 'warning');
            highlightField($('#password'));
            return false;
        }
        
        // Si todo es válido, mostrar mensaje de éxito
        showAlert('✅ ¡Bienvenido a MaxiWallet! Iniciando sesión...', 'success');
        
        // Simular envío del formulario después de 1.5s
        setTimeout(function() {
            // Aquí iría la lógica real de login (enviar a servidor, etc.)
            // Por ahora, solo mostramos el mensaje
            console.log('Login exitoso:', {
                email: email,
                rememberMe: $('#rememberMe').is(':checked')
            });
            
            // NOTA: Redirige a la página menú.html después del login
            window.location.href = 'menu.html';
        }, 1500);
        
        // Limpiar formulario después de 2s
        setTimeout(function() {
            $('#loginForm')[0].reset();
            $('#password').attr('type', 'password');
            $('#togglePassword').find('i').removeClass('bi-eye-slash').addClass('bi-eye');
            passwordVisible = false;
        }, 2000);
    });
    
    // =======================================
    // PERMITIR ENTER EN CAMPO PASSWORD
    // =======================================
    $('#password').on('keypress', function(e) {
        if (e.which == 13) { // Código ASCII de Enter
            $('#btnEntrar').click();
        }
    });
    
    // =======================================
    // PERMITIR ENTER EN CAMPO EMAIL
    // =======================================
    $('#email').on('keypress', function(e) {
        if (e.which == 13) {
            $('#password').focus();
        }
    });
    
    // =======================================
    // LIMPIAR VALIDACIÓN AL ESCRIBIR
    // =======================================
    $('#email, #password').on('input', function() {
        $(this).closest('.input-group').removeClass('border-danger');
        $(this).closest('.form-group').find('.invalid-feedback').remove();
    });
    
    console.log('✅ Login page cargada correctamente');
});

// =======================================
// FUNCIÓN VALIDAR EMAIL
// =======================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =======================================
// FUNCIÓN MOSTRAR ALERTAS
// =======================================
function showAlert(message, type = 'info') {
    // Crear elemento alert
    const alertDiv = $(`
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 1050; min-width: 300px; animation: slideInRight 0.3s ease-out;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `);
    
    // Agregar al body
    $('body').append(alertDiv);
    
    // Remover después de 3 segundos
    setTimeout(function() {
        alertDiv.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

// =======================================
// FUNCIÓN HIGHLIGHT FIELD (ERROR)
// =======================================
function highlightField($field) {
    $field.closest('.input-group').addClass('border-danger');
    
    $field.animate({
        opacity: 0.7
    }, 100).animate({
        opacity: 1
    }, 100).animate({
        opacity: 0.7
    }, 100).animate({
        opacity: 1
    }, 100);
}

// =======================================
// ANIMACIÓN DE ENTRADA
// =======================================
$(document).ready(function() {
    // Animar los campos del formulario al cargar
    $('.form-group').each(function(index) {
        $(this).delay(index * 100).fadeIn(400);
    });
});

// CSS para animaciones (agregar a login-styles.css si es necesario)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

