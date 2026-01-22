/* ================================
   SCRIPT TRANSACTIONS PAGE - MAXIWALLET
   ================================ */

// Evento personalizado
const transactionViewEvent = new CustomEvent('visualización de transacciones recientes', {
  detail: {
    timestamp: new Date(),
    message: 'Se visualizaron las transacciones recientes'
  }
});

$(document).ready(function () {
  // Datos de transacciones de ejemplo
  const transactions = [
    {
      id: 1,
      type: 'deposit',
      icon: 'plus-circle',
      title: 'Depósito recibido',
      description: 'Transferencia de Juan Pérez',
      amount: 250.00,
      status: 'completed',
      date: '18/01/2026 14:30',
      fullDate: new Date(2026, 0, 18, 14, 30)
    },
    {
      id: 2,
      type: 'transfer',
      icon: 'arrow-left-right',
      title: 'Transferencia enviada',
      description: 'A María García',
      amount: 100.00,
      status: 'completed',
      date: '18/01/2026 10:15',
      fullDate: new Date(2026, 0, 18, 10, 15)
    },
    {
      id: 3,
      type: 'withdrawal',
      icon: 'dash-circle',
      title: 'Retiro',
      description: 'Extracción en cajero automático',
      amount: 200.00,
      status: 'completed',
      date: '17/01/2026 16:45',
      fullDate: new Date(2026, 0, 17, 16, 45)
    },
    {
      id: 4,
      type: 'deposit',
      icon: 'plus-circle',
      title: 'Depósito realizado',
      description: 'Depósito por transferencia bancaria',
      amount: 500.00,
      status: 'completed',
      date: '17/01/2026 09:20',
      fullDate: new Date(2026, 0, 17, 9, 20)
    },
    {
      id: 5,
      type: 'transfer',
      icon: 'arrow-left-right',
      title: 'Transferencia enviada',
      description: 'A Carlos López',
      amount: 150.75,
      status: 'pending',
      date: '16/01/2026 15:30',
      fullDate: new Date(2026, 0, 16, 15, 30)
    },
    {
      id: 6,
      type: 'withdrawal',
      icon: 'dash-circle',
      title: 'Pago realizado',
      description: 'Pago de servicios',
      amount: 75.00,
      status: 'completed',
      date: '16/01/2026 11:00',
      fullDate: new Date(2026, 0, 16, 11, 0)
    },
    {
      id: 7,
      type: 'deposit',
      icon: 'plus-circle',
      title: 'Depósito recibido',
      description: 'Transferencia de Ana Martínez',
      amount: 300.00,
      status: 'completed',
      date: '15/01/2026 13:45',
      fullDate: new Date(2026, 0, 15, 13, 45)
    },
    {
      id: 8,
      type: 'transfer',
      icon: 'arrow-left-right',
      title: 'Transferencia enviada',
      description: 'A Pedro Ruiz',
      amount: 250.00,
      status: 'completed',
      date: '15/01/2026 10:30',
      fullDate: new Date(2026, 0, 15, 10, 30)
    }
  ];

  // Variable para almacenar las transacciones filtradas
  let filteredTransactions = [...transactions];

  // Función para obtener el icono según el tipo
  function getIcon(type) {
    const icons = {
      deposit: 'plus-circle',
      withdrawal: 'dash-circle',
      transfer: 'arrow-left-right'
    };
    return icons[type] || 'question-circle';
  }

  // Función para obtener el estado en español
  function getStatusText(status) {
    const statusMap = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido'
    };
    return statusMap[status] || status;
  }

  // Función para renderizar las transacciones
  function renderTransactions(transactionsToRender = transactions) {
    const listContainer = $('#transactionsList');
    listContainer.empty();

    if (transactionsToRender.length === 0) {
      listContainer.html(`
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="bi bi-inbox"></i>
          </div>
          <h3 class="empty-state-title">No hay transacciones</h3>
          <p class="empty-state-text">No se encontraron transacciones con los filtros seleccionados</p>
        </div>
      `);
      return;
    }

    transactionsToRender.forEach(transaction => {
      const amountClass = transaction.type === 'deposit' ? 'deposit' : transaction.type === 'withdrawal' ? 'withdrawal' : 'transfer';
      const amountPrefix = transaction.type === 'deposit' ? '+' : '-';
      const statusClass = `status-${transaction.status}`;

      const html = `
        <div class="transaction-item" data-transaction-id="${transaction.id}">
          <div class="transaction-left">
            <div class="transaction-icon ${transaction.type}">
              <i class="bi bi-${getIcon(transaction.type)}"></i>
            </div>
            <div class="transaction-details">
              <p class="transaction-title">${transaction.title}</p>
              <p class="transaction-description">${transaction.description}</p>
              <p class="transaction-date">${transaction.date}</p>
            </div>
          </div>
          <div class="transaction-right">
            <p class="transaction-amount ${amountClass}">${amountPrefix}$${transaction.amount.toFixed(2)}</p>
            <span class="transaction-status ${statusClass}">${getStatusText(transaction.status)}</span>
          </div>
        </div>
      `;

      listContainer.append(html);
    });

    // Disparar evento personalizado
    document.dispatchEvent(transactionViewEvent);
    console.log('Evento personalizado disparado: "visualización de transacciones recientes"');
  }

  // Función para filtrar transacciones
  function filterTransactions() {
    const typeFilter = $('#filterType').val();
    const dateFilter = $('#filterDate').val();
    const amountFilter = parseFloat($('#filterAmount').val()) || 0;

    filteredTransactions = transactions.filter(transaction => {
      // Filtro por tipo
      if (typeFilter && transaction.type !== typeFilter) {
        return false;
      }

      // Filtro por fecha
      if (dateFilter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const transactionDate = new Date(transaction.fullDate);
        transactionDate.setHours(0, 0, 0, 0);

        switch (dateFilter) {
          case 'today':
            if (transactionDate.getTime() !== today.getTime()) return false;
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            if (transactionDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            if (transactionDate < monthAgo) return false;
            break;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            if (transactionDate < yearAgo) return false;
            break;
        }
      }

      // Filtro por monto
      if (amountFilter > 0 && transaction.amount < amountFilter) {
        return false;
      }

      return true;
    });

    renderTransactions(filteredTransactions);
  }

  // Event listeners para los filtros
  $('#filterType, #filterDate, #filterAmount').on('change input', function () {
    filterTransactions();
  });

  // Click en transacciones para más detalles
  $(document).on('click', '.transaction-item', function () {
    const transactionId = $(this).data('transaction-id');
    const transaction = transactions.find(t => t.id === transactionId);
    if (transaction) {
      alert(`ID: ${transaction.id}\n${transaction.title}\n${transaction.description}\nMonto: $${transaction.amount.toFixed(2)}\nEstado: ${getStatusText(transaction.status)}\nFecha: ${transaction.date}`);
    }
  });
});

// Escuchar el evento personalizado
document.addEventListener('visualización de transacciones recientes', function(event) {
  console.log('Evento capturado:', event.detail.message);
  console.log('Hora:', event.detail.timestamp);
});
