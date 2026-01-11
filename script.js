let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function addTransaction(type) {
    const desc = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    if (desc === '' || amount === '') return alert('Por favor llena los campos');

    const transaction = {
        id: Date.now(),
        description: desc,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
    };

    transactions.push(transaction);
    updateUI();
    saveToLocalStorage();
    
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function updateUI() {
    const list = document.getElementById('transaction-list');
    const balanceDisplay = document.getElementById('total-balance');
    list.innerHTML = '';
    
    let total = 0;
    transactions.forEach(t => {
        const item = document.createElement('li');
        item.classList.add(t.amount > 0 ? 'plus' : 'minus');
        item.innerHTML = `${t.description} <span>${t.amount > 0 ? '+' : ''}${t.amount}</span>`;
        list.appendChild(item);
        total += t.amount;
    });

    balanceDisplay.innerText = `$${total.toFixed(2)}`;
}

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Cargar datos al abrir
updateUI();