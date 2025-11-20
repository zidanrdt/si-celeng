// Mock data
const mockGoals = [
    {
        id: '1',
        name: 'iPad Pro',
        targetAmount: 25000000,
        savedAmount: 250000,
        imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
        frequency: 'weekly',
        contributionAmount: 125000,
        createdDate: '2025-01-15',
        status: 'in-progress',
        transactions: [
            { id: 't1', amount: 125000, type: 'add', date: '2025-01-15T10:00:00', description: 'Tabungan minggu pertama' },
            { id: 't2', amount: 125000, type: 'add', date: '2025-01-22T10:00:00', description: 'Tabungan minggu kedua' }
        ]
    },
    {
        id: '2',
        name: 'Laptop Gaming',
        targetAmount: 15000000,
        savedAmount: 3000000,
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
        frequency: 'monthly',
        contributionAmount: 500000,
        createdDate: '2024-12-01',
        status: 'in-progress',
        transactions: [
            { id: 't3', amount: 500000, type: 'add', date: '2024-12-01T10:00:00', description: 'Bulan Desember' },
            { id: 't4', amount: 500000, type: 'add', date: '2025-01-01T10:00:00', description: 'Bulan Januari' }
        ]
    },
    {
        id: '3',
        name: 'Smartphone Baru',
        targetAmount: 8000000,
        savedAmount: 8000000,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        frequency: 'daily',
        contributionAmount: 50000,
        createdDate: '2024-10-01',
        status: 'completed',
        transactions: [
            { id: 't5', amount: 4000000, type: 'add', date: '2024-10-01T10:00:00', description: 'Tabungan awal' },
            { id: 't6', amount: 4000000, type: 'add', date: '2024-12-15T10:00:00', description: 'Bonus kantor' }
        ]
    }
];

const stockImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800', category: 'Elektronik' },
    { id: 2, url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', category: 'Elektronik' },
    { id: 3, url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', category: 'Elektronik' },
    { id: 4, url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', category: 'Fashion' },
    { id: 5, url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', category: 'Fashion' },
    { id: 6, url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', category: 'Fashion' },
    { id: 7, url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', category: 'Kendaraan' },
    { id: 8, url: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800', category: 'Kendaraan' },
    { id: 9, url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', category: 'Properti' },
    { id: 10, url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', category: 'Properti' },
    { id: 11, url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800', category: 'Liburan' },
    { id: 12, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', category: 'Liburan' }
];

// State
let goals = [];
let currentFilter = 'in-progress';
let editingGoalId = null;
let selectedImageUrl = '';
let selectedFrequency = 'weekly';
let selectedCategory = 'Elektronik';
let currentGoalId = null;
let currentTransactionType = 'add';

// Utility functions
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function calculateProgress(saved, target) {
    return Math.round((saved / target) * 100);
}

function estimateCompletion(saved, target, contribution, frequency) {
    const remaining = target - saved;
    if (remaining <= 0) return '0';
    
    const periodsNeeded = Math.ceil(remaining / contribution);
    
    switch(frequency) {
        case 'daily':
            return `${periodsNeeded} hari`;
        case 'weekly':
            return `${periodsNeeded} minggu`;
        case 'monthly':
            return `${periodsNeeded} bulan`;
        default:
            return '-';
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// LocalStorage functions
function getGoalsFromStorage() {
    const stored = localStorage.getItem('siCelengGoals');
    return stored ? JSON.parse(stored) : mockGoals;
}

function saveGoalsToStorage(goals) {
    localStorage.setItem('siCelengGoals', JSON.stringify(goals));
}

// Initialize
function init() {
    goals = getGoalsFromStorage();
    updateStats();
    renderGoals();
    renderStockImages();
}

// Update statistics
function updateStats() {
    const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const completedGoals = goals.filter(g => g.status === 'completed').length;

    document.getElementById('totalSaved').textContent = formatRupiah(totalSaved);
    document.getElementById('totalTarget').textContent = formatRupiah(totalTarget);
    document.getElementById('completedGoals').textContent = completedGoals;
}

// Filter tabs
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.filter === filter) {
            tab.classList.add('active');
        }
    });
    renderGoals();
}

// Render goals grid
function renderGoals() {
    const filteredGoals = goals.filter(goal => 
        currentFilter === 'all' ? true : goal.status === currentFilter
    );

    const goalsGrid = document.getElementById('goalsGrid');
    const emptyState = document.getElementById('emptyState');

    if (filteredGoals.length === 0) {
        goalsGrid.innerHTML = '';
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        goalsGrid.innerHTML = filteredGoals.map(goal => {
            const progress = calculateProgress(goal.savedAmount, goal.targetAmount);
            const frequencyText = goal.frequency === 'daily' ? 'hari' : goal.frequency === 'weekly' ? 'minggu' : 'bulan';
            
            return `
                <div class="goal-card" onclick="openDetailModal('${goal.id}')">
                    <div class="goal-image-wrapper">
                        <img src="${goal.imageUrl}" alt="${goal.name}" class="goal-image">
                        <div class="goal-badge ${goal.status === 'completed' ? 'completed' : ''}">
                            ${goal.status === 'completed' ? 'Tercapai' : progress + '%'}
                        </div>
                    </div>
                    <div class="goal-content">
                        <h3 class="goal-name">${goal.name}</h3>
                        <div class="goal-info">
                            <span class="goal-info-label">Target:</span>
                            <span class="goal-info-value">${formatRupiah(goal.targetAmount)}</span>
                        </div>
                        <div class="goal-info">
                            <span class="goal-info-label">Terkumpul:</span>
                            <span class="goal-info-value emerald">${formatRupiah(goal.savedAmount)}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="goal-footer">
                            Iuran: ${formatRupiah(goal.contributionAmount)}/${frequencyText}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// Modal functions
function openAddModal() {
    editingGoalId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Target Baru';
    document.getElementById('goalName').value = '';
    document.getElementById('targetAmount').value = '';
    document.getElementById('contributionAmount').value = '';
    selectedFrequency = 'weekly';
    selectedImageUrl = '';
    
    // Reset frequency tabs
    document.querySelectorAll('.freq-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.freq === 'weekly') {
            tab.classList.add('active');
        }
    });
    
    // Reset image selection
    document.querySelectorAll('.stock-image').forEach(img => {
        img.classList.remove('selected');
    });
    
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('addModal').classList.add('active');
}

function closeAddModal() {
    document.getElementById('addModal').classList.remove('active');
}

function setFrequency(freq) {
    selectedFrequency = freq;
    document.querySelectorAll('.freq-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.freq === freq) {
            tab.classList.add('active');
        }
    });
}

function setImageTab(tab) {
    document.querySelectorAll('.img-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'stock') {
        document.querySelectorAll('.img-tab')[0].classList.add('active');
        document.getElementById('stockTab').style.display = 'block';
        document.getElementById('uploadTab').style.display = 'none';
    } else {
        document.querySelectorAll('.img-tab')[1].classList.add('active');
        document.getElementById('stockTab').style.display = 'none';
        document.getElementById('uploadTab').style.display = 'block';
    }
}

function setCategory(category) {
    selectedCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === category) {
            btn.classList.add('active');
        }
    });
    renderStockImages();
}

function renderStockImages() {
    const filteredImages = stockImages.filter(img => img.category === selectedCategory);
    const grid = document.getElementById('stockImages');
    
    grid.innerHTML = filteredImages.map(img => `
        <div class="stock-image ${selectedImageUrl === img.url ? 'selected' : ''}" onclick="selectStockImage('${img.url}')">
            <img src="${img.url}" alt="Stock">
        </div>
    `).join('');
}

function selectStockImage(url) {
    selectedImageUrl = url;
    document.querySelectorAll('.stock-image').forEach(img => {
        img.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImageUrl = e.target.result;
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('uploadPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function removeUploadedImage() {
    selectedImageUrl = '';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('imageUpload').value = '';
}

function saveGoal() {
    const name = document.getElementById('goalName').value.trim();
    const targetAmount = parseFloat(document.getElementById('targetAmount').value);
    const contributionAmount = parseFloat(document.getElementById('contributionAmount').value);

    // Validation
    if (!name) {
        showToast('Nama target harus diisi');
        return;
    }
    if (!targetAmount || targetAmount <= 0) {
        showToast('Target harus lebih dari 0');
        return;
    }
    if (!contributionAmount || contributionAmount <= 0) {
        showToast('Iuran harus lebih dari 0');
        return;
    }
    if (!selectedImageUrl) {
        showToast('Pilih gambar untuk target');
        return;
    }

    if (editingGoalId) {
        // Update existing goal
        const goalIndex = goals.findIndex(g => g.id === editingGoalId);
        if (goalIndex !== -1) {
            goals[goalIndex] = {
                ...goals[goalIndex],
                name,
                targetAmount,
                contributionAmount,
                frequency: selectedFrequency,
                imageUrl: selectedImageUrl
            };
            showToast('Target berhasil diperbarui');
        }
    } else {
        // Create new goal
        const newGoal = {
            id: Date.now().toString(),
            name,
            targetAmount,
            savedAmount: 0,
            contributionAmount,
            frequency: selectedFrequency,
            imageUrl: selectedImageUrl,
            createdDate: new Date().toISOString().split('T')[0],
            status: 'in-progress',
            transactions: []
        };
        goals.push(newGoal);
        showToast('Target berhasil dibuat');
    }

    saveGoalsToStorage(goals);
    updateStats();
    renderGoals();
    closeAddModal();
}

// Goal Detail Modal
function openDetailModal(goalId) {
    currentGoalId = goalId;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const progress = calculateProgress(goal.savedAmount, goal.targetAmount);
    const remaining = goal.targetAmount - goal.savedAmount;
    const estimation = estimateCompletion(goal.savedAmount, goal.targetAmount, goal.contributionAmount, goal.frequency);
    const frequencyText = goal.frequency === 'daily' ? 'hari' : goal.frequency === 'weekly' ? 'minggu' : 'bulan';

    document.getElementById('detailGoalName').textContent = goal.name;
    document.getElementById('detailImage').src = goal.imageUrl;
    document.getElementById('detailProgress').textContent = `${progress}% Tercapai`;
    document.getElementById('detailProgressFill').style.width = `${progress}%`;
    document.getElementById('detailTarget').textContent = formatRupiah(goal.targetAmount);
    document.getElementById('detailSaved').textContent = formatRupiah(goal.savedAmount);
    document.getElementById('detailRemaining').textContent = formatRupiah(remaining > 0 ? remaining : 0);
    document.getElementById('detailEstimation').textContent = estimation;
    document.getElementById('detailContribution').textContent = `${formatRupiah(goal.contributionAmount)} / ${frequencyText}`;
    document.getElementById('detailCreated').textContent = new Date(goal.createdDate).toLocaleDateString('id-ID');

    // Render transactions
    const transactionsList = document.getElementById('transactionsList');
    if (goal.transactions.length === 0) {
        transactionsList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">Belum ada transaksi</p>';
    } else {
        transactionsList.innerHTML = goal.transactions.slice().reverse().map(t => `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-icon ${t.type}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${t.type === 'add' 
                                ? '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'
                                : '<line x1="5" y1="12" x2="19" y2="12"></line>'
                            }
                        </svg>
                    </div>
                    <div class="transaction-info">
                        <p>${t.description}</p>
                        <small>${new Date(t.date).toLocaleString('id-ID')}</small>
                    </div>
                </div>
                <div class="transaction-amount ${t.type}">
                    ${t.type === 'add' ? '+' : '-'}${formatRupiah(t.amount)}
                </div>
            </div>
        `).join('');
    }

    document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
}

function editGoal() {
    const goal = goals.find(g => g.id === currentGoalId);
    if (!goal) return;

    editingGoalId = goal.id;
    document.getElementById('modalTitle').textContent = 'Edit Target';
    document.getElementById('goalName').value = goal.name;
    document.getElementById('targetAmount').value = goal.targetAmount;
    document.getElementById('contributionAmount').value = goal.contributionAmount;
    selectedFrequency = goal.frequency;
    selectedImageUrl = goal.imageUrl;

    // Set frequency tabs
    document.querySelectorAll('.freq-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.freq === goal.frequency) {
            tab.classList.add('active');
        }
    });

    closeDetailModal();
    document.getElementById('addModal').classList.add('active');
}

// Transaction Modal
function openTransactionModal(type) {
    currentTransactionType = type;
    document.getElementById('transactionTitle').textContent = type === 'add' ? 'Tambah Tabungan' : 'Kurangi Tabungan';
    document.getElementById('transactionAmount').value = '';
    document.getElementById('transactionDescription').value = '';
    document.getElementById('transactionModal').classList.add('active');
}

function closeTransactionModal() {
    document.getElementById('transactionModal').classList.remove('active');
}

function saveTransaction() {
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const description = document.getElementById('transactionDescription').value.trim();

    if (!amount || amount <= 0) {
        showToast('Masukkan jumlah yang valid');
        return;
    }

    const goalIndex = goals.findIndex(g => g.id === currentGoalId);
    if (goalIndex === -1) return;

    const newTransaction = {
        id: `t${Date.now()}`,
        amount,
        type: currentTransactionType,
        date: new Date().toISOString(),
        description: description || (currentTransactionType === 'add' ? 'Menambah tabungan' : 'Mengurangi tabungan')
    };

    goals[goalIndex].transactions.push(newTransaction);
    
    if (currentTransactionType === 'add') {
        goals[goalIndex].savedAmount += amount;
    } else {
        goals[goalIndex].savedAmount = Math.max(0, goals[goalIndex].savedAmount - amount);
    }

    // Check if goal is completed
    if (goals[goalIndex].savedAmount >= goals[goalIndex].targetAmount) {
        goals[goalIndex].status = 'completed';
        showToast('Selamat! Target tabungan tercapai!');
    } else {
        goals[goalIndex].status = 'in-progress';
    }

    saveGoalsToStorage(goals);
    updateStats();
    renderGoals();
    closeTransactionModal();
    
    // Refresh detail modal
    openDetailModal(currentGoalId);
    
    showToast(currentTransactionType === 'add' ? 'Tabungan berhasil ditambahkan' : 'Tabungan berhasil dikurangi');
}

// Initialize on page load
init();