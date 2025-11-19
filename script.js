// Remove any formatting on input fields (ensure type=number and no formatting applied)
document.addEventListener('DOMContentLoaded', function() {
	const targetInput = document.getElementById('targetAmount');
	const contributionInput = document.getElementById('contributionAmount');
	if (targetInput) {
		targetInput.addEventListener('input', function(e) {
			// Only allow numbers
			this.value = this.value.replace(/[^\d]/g, '');
		});
	}
	if (contributionInput) {
		contributionInput.addEventListener('input', function(e) {
			this.value = this.value.replace(/[^\d]/g, '');
		});
	}
});
function formatRupiah(number) {
	return 'Rp ' + Number(number).toLocaleString('id-ID');
}
let currentFilter = 'in-progress';
let currentImageTab = 'stock';
let currentCategory = 'Elektronik';
let currentFrequency = 'weekly';

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
	document.getElementById('transactionTitle').textContent = type === 'add' ? 'Tambah Tabungan' : 'Kurangi Tabungan';
}

function closeTransactionModal() {
	document.getElementById('transactionModal').classList.remove('active');
	document.body.style.overflow = '';
}

// switch tab
function setFilter(filter) {
	currentFilter = filter;
	document.querySelectorAll('.tab').forEach(tab => {
		tab.classList.toggle('active', tab.getAttribute('data-filter') === filter);
	});
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
}

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

function saveGoal() {
	// Ambil nilai input sebagai angka
	const targetAmount = Number(document.getElementById('targetAmount').value);
	const contributionAmount = Number(document.getElementById('contributionAmount').value);
	// Validasi input
	if (isNaN(targetAmount) || targetAmount <= 0) {
		showToast('Masukkan target tabungan yang valid!');
		return;
	}
	if (isNaN(contributionAmount) || contributionAmount <= 0) {
		showToast('Masukkan jumlah iuran yang valid!');
		return;
	}
	// Simpan ke localstorage atau array (dummy)
	// ...
	closeAddModal();
	showToast('Target berhasil disimpan!');
}

function editGoal() {
	// implementasi logic
	openAddModal();
}
function saveTransaction() {
	// transisi logic
	closeTransactionModal();
	showToast('Transaksi berhasil disimpan!');
}

function showToast(message) {
	const toast = document.getElementById('toast');
	toast.textContent = message;
	toast.classList.add('show');
	setTimeout(() => {
		toast.classList.remove('show');
	}, 2500);
}

window.addEventListener('DOMContentLoaded', () => {
	setFilter(currentFilter);
	setFrequency(currentFrequency);
	setImageTab(currentImageTab);
	setCategory(currentCategory);
});
