let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myGoal = JSON.parse(localStorage.getItem('myGoal')) || { name: "Nuevo Celular", amount: 500 };
let myChart = null;

function addTransaction(type) {
    const desc = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const cat = document.getElementById('category').value;

    if (!desc || isNaN(amount)) return alert("Pon un monto válido");

    transactions.unshift({
        id: Date.now(),
        description: desc,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        category: cat,
        date: new Date().toLocaleDateString()
    });

    saveAndRefresh();
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

// FUNCIÓN DE BORRADO RESTAURADA
function deleteTransaction(id) {
    if(confirm('¿Eliminar este movimiento?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveAndRefresh();
    }
}

// HACER LAS METAS EDITABLES
function editGoal() {
    const newName = prompt("¿Cuál es tu meta?", myGoal.name);
    const newAmount = prompt("¿Cuánto necesitas ahorrar?", myGoal.amount);
    if (newName && !isNaN(newAmount)) {
        myGoal = { name: newName, amount: parseFloat(newAmount) };
        localStorage.setItem('myGoal', JSON.stringify(myGoal));
        render();
    }
}

function saveAndRefresh() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    render();
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
                borderWidth: 0, cutout: '80%'
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
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
                <div>
                    <h4>${t.description}</h4>
                    <small>${t.category} • ${t.date}</small>
                </div>
                <div style="display:flex; align-items:center; gap:10px">
                    <strong style="color: ${t.amount < 0 ? '#ff4757' : '#00dc82'}">
                        ${t.amount < 0 ? '' : '+'}${t.amount.toFixed(2)}
                    </strong>
                    <button onclick="deleteTransaction(${t.id})" style="background:none; border:none; color:#ff4757; font-size:16px">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>`;
    });

    document.getElementById('total-balance').innerText = `$${total.toFixed(0)}`;
    
    // ACTUALIZAR METAS REALES
    document.getElementById('goal-name').innerText = myGoal.name;
    const progress = Math.max(0, Math.min((total / myGoal.amount) * 100, 100));
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('goal-percent').innerText = Math.floor(progress) + '%';
    document.getElementById('goal-remaining').innerText = `$${Math.max(0, myGoal.amount - total).toFixed(2)}`;

    updateChart();
}

function showTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
}

render();