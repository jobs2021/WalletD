/**
 * SCRIPT PRINCIPAL - MAXIWALLET
 * Manejo de eventos e interactividad con jQuery
 */

$(document).ready(function() {
    
    // =======================================
    // EFECTO PARALLAX SUAVE EN HERO SECTION
    // =======================================
    // Solo en desktop (evita problemas de rendimiento en móviles)
    if ($(window).width() > 768) {
        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            
            // Aplicar parallax a las imágenes del carrusel
            $('.carousel-item img').css({
                'transform': 'translateY(' + (scrollTop * 0.5) + 'px)',
                'transition': 'transform 0.1s ease-out'
            });
        });
    }
    
    // =======================================
    // EFECTO .show('drop') EN BOTÓN LOGIN
    // =======================================
    // Nota: El botón de login ahora redirige a login.html
    // No se necesita lógica de modal aquí
    
    // =======================================
    // HOVER CON ANIMACIÓN EN SECCIÓN HISTORIA
    // =======================================
    $('#historia').on('mouseenter', function() {
        // Animar la imagen con efecto elevado
        $('#historia img').stop().animate({
            'margin-top': '-20px'
        }, 400, function() {
            // Aplicar transformación visual
            $(this).css({
                'transform': 'scale(1.08)',
                'filter': 'brightness(1.1)'
            });
        });
        
        // Animar el contenido de texto
        $('#historia h2, #historia p').stop().animate({
            'opacity': 1
        }, 300);
    });
    
    $('#historia').on('mouseleave', function() {
        // Retornar la imagen a estado normal
        $('#historia img').stop().animate({
            'margin-top': '0px'
        }, 400, function() {
            $(this).css({
                'transform': 'scale(1.0)',
                'filter': 'brightness(1.0)'
            });
        });
    });
    
    });
    
    console.log('✅ MaxiWallet página de inicio cargada correctamente');
;

