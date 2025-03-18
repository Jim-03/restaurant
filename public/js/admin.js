
const datePreset = document.getElementById('datePreset');
const customDate = document.querySelector('.custom-date');

datePreset.addEventListener('change', function () {
  if (this.value === 'custom') {
    customDate.style.display = 'flex';
  } else {
    customDate.style.display = 'none';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
  }
  showLoading();
});

document.querySelectorAll('.export-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const format = this.textContent.includes('PDF') ? 'PDF' : 'CSV';
    alert(`Exporting to ${format}...`);
  });
});

function showLoading () {
  const metrics = [
    'total-sales', 'avg-order-value', 'top-selling-item', 'orders-processed',
    'total-items', 'low-stock-items', 'most-used-item', 'stock-value'
  ];
  metrics.forEach(metric => {
    document.getElementById(metric).innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  });
}

// Initialize loading state
showLoading();
