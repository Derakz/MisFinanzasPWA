let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myGoal = JSON.parse(localStorage.getItem('myGoal')) || { name: "Sin meta", amount: 0 };

function addTransaction(type) {
    const desc = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const cat = document.getElementById('category').value;

    if (!desc || isNaN(amount)) return alert("Completa los datos");

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

function deleteTransaction(id) {
    if(confirm('¿Eliminar este movimiento?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveAndRefresh();
    }
}

function updateGoalSettings() {
    const name = document.getElementById('goal-name-input').value;
    const amount = parseFloat(document.getElementById('goal-amount-input').value);
    if (!name || isNaN(amount)) return alert("Datos de meta inválidos");
    
    myGoal = { name, amount };
    localStorage.setItem('myGoal', JSON.stringify(myGoal));
    render();
}

function exportToCSV() {
    let csv = "Fecha,Descripcion,Categoria,Monto\n";
    transactions.forEach(t => csv += `${t.date},${t.description},${t.category},${t.amount}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MisFinanzas.csv';
    a.click();
}

function saveAndRefresh() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    render();
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
                <div class="item-actions">
                    <strong style="color: ${t.amount < 0 ? 'var(--danger)' : 'var(--primary)'}">
                        ${t.amount.toFixed(2)}
                    </strong>
                    <button class="btn-delete" onclick="deleteTransaction(${t.id})"><i class="fas fa-trash"></i></button>
                </div>
            </li>`;
    });

    document.getElementById('total-balance').innerText = `$${total.toFixed(2)}`;
    
    // Actualizar Metas
    document.getElementById('goal-display-name').innerText = myGoal.name;
    const progress = myGoal.amount > 0 ? Math.max(0, Math.min((total / myGoal.amount) * 100, 100)) : 0;
    document.getElementById('progress-fill').style.width = progress + '%';
    document.getElementById('goal-percent').innerText = Math.floor(progress) + '%';
    document.getElementById('goal-remaining').innerText = `$${Math.max(0, myGoal.amount - total).toFixed(2)}`;
}

function showTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    el.classList.add('active');
}

render();