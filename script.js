const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#14b8a6'];

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

function showScheduler(type) {
    localStorage.setItem('currentScheduler', type);

    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const section = document.getElementById(`${type}-section`);
    if (section) {
        section.classList.add('active');
    }
    
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if(item.getAttribute('onclick').includes(type)) {
            item.classList.add('active');
        }
    });
    
    const algorithms = ['fcfs', 'srtf', 'rr'];
    algorithms.forEach(algo => {
        if (algo !== type) {
            clearResults(algo);
        }
    });
    
    if (window.innerWidth < 768) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.remove('open');
    }

    const container = document.getElementById(`${type}-process-inputs`);
    if (container && container.innerHTML.trim() === '') {
        if (type === 'fcfs') generateFCFSInputs();
        else if (type === 'srtf') generateSRTFInputs();
        else if (type === 'rr') generateRRInputs();
    }
}

function randomizeValues(type) {
    const num = parseInt(document.getElementById(`${type}-num-processes`).value);
    
    for (let i = 0; i < num; i++) {
        document.getElementById(`${type}-at-${i}`).value = Math.floor(Math.random() * 11);
        document.getElementById(`${type}-bt-${i}`).value = Math.floor(Math.random() * 9) + 2;
        
        const prInput = document.getElementById(`${type}-pr-${i}`);
        if (prInput) {
            prInput.value = Math.floor(Math.random() * 5) + 1;
        }
    }
}

function generateFCFSInputs() {
    const num = parseInt(document.getElementById('fcfs-num-processes').value);
    const container = document.getElementById('fcfs-process-inputs');
    
    container.classList.remove('cards-grid');
    
    let html = '<button class="btn-random" onclick="randomizeValues(\'fcfs\')">🎲 Randomize Data</button>';
    html += '<div class="cards-grid">';
    
    for (let i = 0; i < num; i++) {
        html += `
            <div class="process-card">
                <h3>Process ${i + 1}</h3>
                <div class="input-group">
                    <label>Arrival Time</label>
                    <input type="number" id="fcfs-at-${i}" value="${i}" min="0">
                </div>
                <div class="input-group" style="margin-top:10px;">
                    <label>Burst Time</label>
                    <input type="number" id="fcfs-bt-${i}" value="${Math.floor(Math.random() * 8) + 2}" min="1">
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function generateSRTFInputs() {
    const num = parseInt(document.getElementById('srtf-num-processes').value);
    const container = document.getElementById('srtf-process-inputs');
    container.classList.remove('cards-grid');

    let html = '<button class="btn-random" onclick="randomizeValues(\'srtf\')">🎲 Randomize Data</button>';
    html += '<div class="cards-grid">';
    
    for (let i = 0; i < num; i++) {
        html += `
            <div class="process-card">
                <h3>Process ${i + 1}</h3>
                <div class="input-group">
                    <label>Arrival Time</label>
                    <input type="number" id="srtf-at-${i}" value="${i}" min="0">
                </div>
                <div class="input-group" style="margin-top:10px;">
                    <label>Burst Time</label>
                    <input type="number" id="srtf-bt-${i}" value="${Math.floor(Math.random() * 8) + 2}" min="1">
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function generateRRInputs() {
    const num = parseInt(document.getElementById('rr-num-processes').value);
    const container = document.getElementById('rr-process-inputs');
    container.classList.remove('cards-grid');

    let html = '<button class="btn-random" onclick="randomizeValues(\'rr\')">🎲 Randomize Data</button>';
    html += '<div class="cards-grid">';
    
    for (let i = 0; i < num; i++) {
        html += `
            <div class="process-card">
                <h3>Process ${i + 1}</h3>
                <div class="input-group">
                    <label>Arrival Time</label>
                    <input type="number" id="rr-at-${i}" value="${i}" min="0">
                </div>
                <div class="input-group" style="margin-top:10px;">
                    <label>Burst Time</label>
                    <input type="number" id="rr-bt-${i}" value="${Math.floor(Math.random() * 8) + 2}" min="1">
                </div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

function calculateFCFS() {
    const num = parseInt(document.getElementById('fcfs-num-processes').value);
    const processes = [];
    
    for (let i = 0; i < num; i++) {
        processes.push({
            id: i + 1,
            at: parseInt(document.getElementById(`fcfs-at-${i}`).value),
            bt: parseInt(document.getElementById(`fcfs-bt-${i}`).value)
        });
    }
    
    processes.sort((a, b) => a.at - b.at);
    
    const gantt = [];
    let currentTime = 0;
    
    processes.forEach(p => {
        if (currentTime < p.at) {
            gantt.push({ process: 'Idle', start: currentTime, end: p.at });
            currentTime = p.at;
        }
        gantt.push({ process: p.id, start: currentTime, end: currentTime + p.bt });
        p.ct = currentTime + p.bt;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
        currentTime += p.bt;
    });
    
    displayResults('fcfs', processes, gantt);
}

function calculateSRTF() {
    const num = parseInt(document.getElementById('srtf-num-processes').value);
    const processes = [];
    
    for (let i = 0; i < num; i++) {
        processes.push({
            id: i + 1,
            at: parseInt(document.getElementById(`srtf-at-${i}`).value),
            bt: parseInt(document.getElementById(`srtf-bt-${i}`).value),
            remaining: parseInt(document.getElementById(`srtf-bt-${i}`).value)
        });
    }
    
    const gantt = [];
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    
    while (completed < n) {
        let available = processes.filter(p => p.at <= currentTime && p.remaining > 0);
        
        if (available.length === 0) {
            if (gantt.length > 0 && gantt[gantt.length - 1].process === 'Idle') {
                gantt[gantt.length - 1].end++;
            } else {
                gantt.push({ process: 'Idle', start: currentTime, end: currentTime + 1 });
            }
            currentTime++;
            continue;
        }
        
        available.sort((a, b) => {
            if (a.remaining !== b.remaining) return a.remaining - b.remaining;
            return a.at - b.at;
        });
        
        const selected = available[0];
        
        if (gantt.length === 0 || gantt[gantt.length - 1].process !== selected.id) {
            gantt.push({ process: selected.id, start: currentTime, end: currentTime + 1 });
        } else {
            gantt[gantt.length - 1].end++;
        }
        
        selected.remaining--;
        currentTime++;
        
        if (selected.remaining === 0) {
            selected.ct = currentTime;
            selected.tat = selected.ct - selected.at;
            selected.wt = selected.tat - selected.bt;
            completed++;
        }
    }
    
    displayResults('srtf', processes, gantt);
}

function calculateRR() {
    const num = parseInt(document.getElementById('rr-num-processes').value);
    const quantum = parseInt(document.getElementById('rr-quantum').value);
    const processes = [];
    
    for (let i = 0; i < num; i++) {
        processes.push({
            id: i + 1,
            at: parseInt(document.getElementById(`rr-at-${i}`).value),
            bt: parseInt(document.getElementById(`rr-bt-${i}`).value),
            remaining: parseInt(document.getElementById(`rr-bt-${i}`).value)
        });
    }
    
    const gantt = [];
    const queue = [];
    let currentTime = 0;
    let completed = 0;
    const n = processes.length;
    const visited = new Array(n).fill(false);
    
    processes.sort((a, b) => a.at - b.at);
    
    while (completed < n) {
        for (let i = 0; i < n; i++) {
            if (!visited[i] && processes[i].at <= currentTime && processes[i].remaining > 0) {
                queue.push(processes[i]);
                visited[i] = true;
            }
        }
        
        if (queue.length === 0) {
            if (gantt.length > 0 && gantt[gantt.length - 1].process === 'Idle') {
                gantt[gantt.length - 1].end++;
            } else {
                gantt.push({ process: 'Idle', start: currentTime, end: currentTime + 1 });
            }
            currentTime++;
            continue;
        }
        
        const selected = queue.shift();
        const execTime = Math.min(quantum, selected.remaining);
        
        gantt.push({ process: selected.id, start: currentTime, end: currentTime + execTime });
        
        selected.remaining -= execTime;
        currentTime += execTime;
        
        for (let i = 0; i < n; i++) {
            if (!visited[i] && processes[i].at <= currentTime && processes[i].remaining > 0) {
                queue.push(processes[i]);
                visited[i] = true;
            }
        }
        
        if (selected.remaining > 0) {
            queue.push(selected);
        } else {
            selected.ct = currentTime;
            selected.tat = selected.ct - selected.at;
            selected.wt = selected.tat - selected.bt;
            completed++;
        }
    }
    
    displayResults('rr', processes, gantt);
}

function displayResults(type, processes, gantt) {
    let html = '<div class="gantt-chart"><h3>Gantt Chart Visualization</h3><div class="gantt-container">';
    
    gantt.forEach((block, idx) => {
        const width = (block.end - block.start) * 40;
        let style = '';
        let content = '';
        
        if (block.process === 'Idle') {
            style = `width: ${width}px; background: repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #e5e7eb 10px, #e5e7eb 20px); color: #9ca3af;`;
            content = 'Idle';
        } else {
            const color = colors[(block.process - 1) % colors.length];
            style = `width: ${width}px; background-color: ${color};`;
            content = `P${block.process}`;
        }
        
        html += `<div class="gantt-block" style="${style}" title="Start: ${block.start}, End: ${block.end}">${content}</div>`;
    });
    
    html += '</div><div class="gantt-label">';
    
    gantt.forEach((block, idx) => {
        const width = (block.end - block.start) * 40;
        if (idx === 0) {
            html += `<div class="gantt-time" style="width: 0px">${block.start}</div>`;
        }
        html += `<div class="gantt-time" style="width: ${width}px">${block.end}</div>`;
    });
    
    html += '</div></div>';
    
    html += '<h3>Detailed Metrics</h3><table class="results-table"><tr><th>Process</th><th>Arrival Time</th><th>Burst Time</th>';
    if (type === 'srtf') html += '<th>Priority</th>';
    html += '<th>Completion Time</th><th>Turnaround</th><th>Waiting</th></tr>';
    
    let totalTAT = 0, totalWT = 0;
    
    processes.forEach(p => {
        html += `<tr><td>P${p.id}</td><td>${p.at}</td><td>${p.bt}</td>`;
        if (type === 'srtf') html += `<td>${p.pr}</td>`;
        html += `<td>${p.ct}</td><td>${p.tat}</td><td>${p.wt}</td></tr>`;
        totalTAT += p.tat;
        totalWT += p.wt;
    });
    
    html += '</table>';
    
    const avgTAT = (totalTAT / processes.length).toFixed(2);
    const avgWT = (totalWT / processes.length).toFixed(2);
    
    html += `<div class="stats">
        <div class="stat-card">
            <h3>Average Turnaround</h3>
            <p>${avgTAT}ms</p>
        </div>
        <div class="stat-card">
            <h3>Average Waiting</h3>
            <p>${avgWT}ms</p>
        </div>
    </div>`;
    
    document.getElementById(`${type}-results`).innerHTML = html;
}

function clearResults(type) {
    document.getElementById(`${type}-results`).innerHTML = '';
    document.getElementById(`${type}-process-inputs`).innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedScheduler = localStorage.getItem('currentScheduler');
    if (savedScheduler) {
        showScheduler(savedScheduler);
    } else {
        showScheduler('fcfs');
    }
});
