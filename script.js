let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(type) {
    const desc = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    if (!desc || !amount) return alert('¡Escribe algo!');

    const transaction = {
        id: Date.now(),
        description: desc,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        date: new Date().toLocaleDateString()
    };

    transactions.unshift(transaction); // Añade al inicio
    saveAndRefresh();
    
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function deleteTransaction(id) {
    if(confirm('¿Borrar este registro?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    render();
}

function render() {
    const list = document.getElementById('transaction-list');
    const balanceDisplay = document.getElementById('total-balance');
    
    list.innerHTML = '';
    let total = 0;

    transactions.forEach(t => {
        const isExpense = t.amount < 0;
        total += t.amount;

        list.innerHTML += `
            <li class="item">
                <div class="item-info">
                    <h4>${t.description}</h4>
                    <span>${t.date}</span>
                </div>
                <div class="item-amount" style="color: ${isExpense ? '#D63031' : '#00B894'}">
                    ${isExpense ? '' : '+'}${t.amount.toFixed(2)}
                    <button class="delete-btn" onclick="deleteTransaction(${t.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </li>
        `;
    });

    balanceDisplay.innerText = `$${total.toFixed(2)}`;
}

render();