let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart = null;

function addTransaction(type) {
    const desc = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const cat = document.getElementById('category').value;

    if (!desc || !amount) return;

    transactions.unshift({
        id: Date.now(),
        description: desc,
        amount: type === 'expense' ? -amount : amount,
        category: cat,
        date: new Date().toLocaleDateString()
    });

    saveAndRefresh();
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function saveAndRefresh() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    render();
}

function exportToCSV() {
    let csv = "Fecha,Descripcion,Categoria,Monto\n";
    transactions.forEach(t => csv += `${t.date},${t.description},${t.category},${t.amount}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mis_Finanzas.csv';
    a.click();
}

function updateChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const income = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expense = Math.abs(transactions.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));

    if (myChart) myChart.destroy();
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [income || 1, expense || 0],
                backgroundColor: ['#00dc82', '#ff4757'],
                borderWidth: 0,
                cutout: '80%'
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: false, // IMPORTANTE: evita que crezca infinito
            plugins: { legend: { display: false } } 
        }
    });
}

function render() {
    const list = document.getElementById('transaction-list');
    let total = 0;
    list.innerHTML = '';

    transactions.forEach(t => {
        total += t.amount;
        list.innerHTML += `
            <li class="item">
                <div><h4>${t.description}</h4><small>${t.category}</small></div>
                <div style="color: ${t.amount < 0 ? '#ff4757' : '#00dc82'}">${t.amount.toFixed(2)}</div>
            </li>`;
    });

    document.getElementById('total-balance').innerText = `$${total.toFixed(0)}`;
    
    // Lógica de Metas (Ejemplo: Meta de $500)
    const goal = 500;
    const progress = Math.min((total / goal) * 100, 100);
    document.getElementById('progress-fill').style.width = Math.max(0, progress) + '%';
    document.getElementById('goal-percent').innerText = Math.max(0, progress).toFixed(0) + '%';
    document.getElementById('goal-remaining').innerText = `$${Math.max(0, goal - total)}`;

    updateChart();
}

function showTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
}

render();