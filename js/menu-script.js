/**
 * MENU SCRIPT - MAXIWALLET
 * Manejo de eventos e interactividad de la página de menú
 */

$(document).ready(function() {
    
    // =======================================
    // FUNCIONALIDAD DEL MENÚ
    // =======================================
    
    // Actualizar el saldo disponible desde localStorage (guardado en transactions.html)
    const netBalance = localStorage.getItem('netBalance');
    if (netBalance) {
        const saldoAmount = $('.saldo-amount');
        saldoAmount.text('$' + parseFloat(netBalance).toFixed(2));
        console.log('Saldo actualizado desde transactions.html:', netBalance);
    } else {
        console.log('No hay saldo neto guardado. Usando valor por defecto.');
    }
    
});
