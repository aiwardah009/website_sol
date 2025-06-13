let customers = [];
let quantumTime = 0;
function addCustomer() {
    const name = document.getElementById('customerName').value;
    const service = parseInt(document.getElementById('serviceTime').value);
    quantumTime = parseInt(document.getElementById('quantumTime').value);
    if (name.trim() && !isNaN(service) && !isNaN(quantumTime) && service > 0 && quantumTime > 0) {
        customers.push({ name, service });
        updateTable();
        document.getElementById('customerName').value = '';
        document.getElementById('serviceTime').value = '';
    } else {
        alert("Silakan masukkan semua data dengan benar. Pastikan waktu layanan dan quantum lebih dari 0.");
    }
}
function updateTable() {
    const table = document.getElementById('customerTable');
    table.innerHTML = '<tr><th>Nama Pelanggan</th><th>Waktu Layanan</th></tr>';
    customers.forEach(customer => {
        const row = table.insertRow();
        row.insertCell(0).innerText = customer.name;
        row.insertCell(1).innerText = customer.service;
    });
}
function runSimulation() {
    if (customers.length === 0) {
        alert("Tidak ada pelanggan untuk dilayani.");
        return;
    }
    const queueType = document.getElementById('queueType').value;
    let output = "<h3>Hasil Simulasi:</h3>";
    output += "<table><tr><th>Nama Pelanggan</th><th>Waktu Layanan</th><th>Waktu Tunggu</th><th>Waktu Penyelesaian</th></tr>";
    let waitTimes = Array(customers.length).fill(0);
    let completionTimes = Array(customers.length).fill(0);
    if (queueType === "RR") {
        let queue = customers.map(c => ({ ...c }));
        let time = 0;
        let lastServed = Array(customers.length).fill(0);
        while (queue.some(c => c.service > 0)) {
            for (let i = 0; i < queue.length; i++) {
                if (queue[i].service > 0) {
                    let served = Math.min(queue[i].service, quantumTime);
                    waitTimes[i] += time - lastServed[i];
                    time += served;
                    queue[i].service -= served;
                    lastServed[i] = time;
                    if (queue[i].service === 0) {
                        completionTimes[i] = time;
                    }
                }
            }
        }
    } else if (queueType === "SRF") {
        let queue = customers.map((c, i) => ({ ...c, index: i, remaining: c.service }));
        let time = 0, completed = 0, n = queue.length;
        let isCompleted = Array(n).fill(false);
        while (completed < n) {
            let minTime = Infinity, idx = -1;
            for (let i = 0; i < n; i++) {
                if (!isCompleted[i] && queue[i].remaining < minTime && queue[i].remaining > 0) {
                    minTime = queue[i].remaining;
                    idx = i;
                }
            }
            if (idx === -1) break;
            waitTimes[idx] = time;
            time += queue[idx].remaining;
            completionTimes[idx] = time;
            queue[idx].remaining = 0;
            isCompleted[idx] = true;
            completed++;
        }
    }
    customers.forEach((customer, index) => {
        output += `<tr><td>${customer.name}</td><td>${customer.service}</td><td>${waitTimes[index]}</td><td>${completionTimes[index]}</td></tr>`;
    });
    let avgWait = (waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length).toFixed(2);
    output += "</table><p><strong>Rata-rata Waktu Tunggu:</strong> " + avgWait + " detik</p>";
    document.getElementById('output').innerHTML = output;
}
function resetCustomers() {
    customers = [];
    updateTable();
    document.getElementById('output').innerHTML = '';
}
