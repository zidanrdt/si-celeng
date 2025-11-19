// Modal and Tab Logic for Si Celeng
let currentFilter = 'in-progress';
let currentImageTab = 'stock';
let currentCategory = 'Elektronik';
let currentFrequency = 'weekly';

// --- Modal Functions ---
function openAddModal() {
	document.getElementById('addModal').classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeAddModal() {
	document.getElementById('addModal').classList.remove('active');
	document.body.style.overflow = '';
}

function openDetailModal() {
	document.getElementById('detailModal').classList.add('active');
	document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
	document.getElementById('detailModal').classList.remove('active');
	document.body.style.overflow = '';
}

function openTransactionModal(type) {
	document.getElementById('transactionModal').classList.add('active');
	document.body.style.overflow = 'hidden';
	// Set title based on type
	document.getElementById('transactionTitle').textContent = type === 'add' ? 'Tambah Tabungan' : 'Kurangi Tabungan';
}

function closeTransactionModal() {
	document.getElementById('transactionModal').classList.remove('active');
	document.body.style.overflow = '';
}

// --- Tab Switching ---
function setFilter(filter) {
	currentFilter = filter;
	// Update tab active state
	document.querySelectorAll('.tab').forEach(tab => {
		tab.classList.toggle('active', tab.getAttribute('data-filter') === filter);
	});
	// TODO: Update goals grid based on filter
}

function setFrequency(freq) {
	currentFrequency = freq;
	document.querySelectorAll('.freq-tab').forEach(tab => {
		tab.classList.toggle('active', tab.getAttribute('data-freq') === freq);
	});
}

function setImageTab(tab) {
	currentImageTab = tab;
	document.querySelectorAll('.img-tab').forEach(btn => {
		btn.classList.toggle('active', btn.textContent.trim().includes(tab === 'stock' ? 'Galeri' : 'Upload'));
	});
	document.getElementById('stockTab').style.display = tab === 'stock' ? '' : 'none';
	document.getElementById('uploadTab').style.display = tab === 'upload' ? '' : 'none';
}

function setCategory(category) {
	currentCategory = category;
	document.querySelectorAll('.category-btn').forEach(btn => {
		btn.classList.toggle('active', btn.textContent.trim() === category);
	});
	// TODO: Update stock images based on category
}

// --- Image Upload (stub) ---
function handleImageUpload(event) {
	const file = event.target.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = function(e) {
		document.getElementById('uploadPreview').style.display = '';
		document.getElementById('previewImage').src = e.target.result;
	};
	reader.readAsDataURL(file);
}

function removeUploadedImage() {
	document.getElementById('uploadPreview').style.display = 'none';
	document.getElementById('previewImage').src = '';
	document.getElementById('imageUpload').value = '';
}

// --- Save Goal (stub) ---
function saveGoal() {
	// TODO: Implement save logic
	closeAddModal();
	showToast('Target berhasil disimpan!');
}

// --- Edit Goal (stub) ---
function editGoal() {
	// TODO: Implement edit logic
	openAddModal();
}

// --- Save Transaction (stub) ---
function saveTransaction() {
	// TODO: Implement transaction logic
	closeTransactionModal();
	showToast('Transaksi berhasil disimpan!');
}

// --- Toast Notification ---
function showToast(message) {
	const toast = document.getElementById('toast');
	toast.textContent = message;
	toast.classList.add('show');
	setTimeout(() => {
		toast.classList.remove('show');
	}, 2500);
}

// --- Initial Setup ---
window.addEventListener('DOMContentLoaded', () => {
	// Ensure correct tab and modal state on load
	setFilter(currentFilter);
	setFrequency(currentFrequency);
	setImageTab(currentImageTab);
	setCategory(currentCategory);
});
