let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart;

function addTransaction(type) {
    const desc = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    if (desc === '' || amount === '') return alert('Llena los campos');

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
    let totalIncomes = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        const item = document.createElement('li');
        item.classList.add(t.amount > 0 ? 'plus' : 'minus');
        item.innerHTML = `${t.description} <span>${t.amount > 0 ? '+' : ''}${t.amount}</span>`;
        list.appendChild(item);
        
        total += t.amount;
        if (t.amount > 0) totalIncomes += t.amount;
        else totalExpenses += Math.abs(t.amount);
    });

    balanceDisplay.innerText = `$${total.toFixed(2)}`;
    updateChart(totalIncomes, totalExpenses);
}

function updateChart(incomes, expenses) {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    if (myChart) {
        myChart.destroy(); // Borra el gráfico anterior para dibujar el nuevo
    }

    myChart = new Chart(ctx, {
        type: 'doughnut', // Gráfico de dona
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                data: [incomes, expenses],
                backgroundColor: ['#2ecc71', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function saveToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

updateUI();