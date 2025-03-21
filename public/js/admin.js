const datePreset = document.getElementById('datePreset');
const customDate = document.querySelector('.custom-date');
const startDate = document.getElementById('start-date');
const endDate = document.getElementById('end-date');

function getDateRange() {
    const today = new Date();
    let start, end;
    switch(datePreset.value) {
        case 'today': start = end = today; break;
        case 'week': start = new Date(today); start.setDate(today.getDate() - 7); end = today; break;
        case 'month': start = new Date(today); start.setMonth(today.getMonth() - 1); end = today; break;
        case 'custom': start = startDate.value ? new Date(startDate.value) : null; end = endDate.value ? new Date(endDate.value) : null; break;
    }
    return { start, end };
}

datePreset.addEventListener('change', function() {
    customDate.style.display = this.value === 'custom' ? 'flex' : 'none';
    if (this.value !== 'custom') { startDate.value = ''; endDate.value = ''; fetchReportData(); }
});

[startDate, endDate].forEach(input => {
    input.addEventListener('change', () => {
        if (datePreset.value === 'custom' && startDate.value && endDate.value) fetchReportData();
    });
});

function showLoading() {
    const metrics = ['total-sales', 'avg-order-value', 'top-selling-item', 'orders-processed', 'total-items', 'low-stock-items', 'most-used-item', 'stock-value'];
    metrics.forEach(metric => document.getElementById(metric).innerHTML = '<i class="fas fa-spinner fa-spin"></i>');
}

function updateReportData(data) {
    document.getElementById('total-sales').textContent = data.sales.total || '';
    document.getElementById('avg-order-value').textContent = data.sales.avgOrder || '';
    document.getElementById('top-selling-item').textContent = data.sales.topItem || '';
    document.getElementById('orders-processed').textContent = data.sales.orders || '';
    document.getElementById('total-items').textContent = data.inventory.total || '';
    document.getElementById('low-stock-items').textContent = data.inventory.lowStock || '';
    document.getElementById('most-used-item').textContent = data.inventory.mostUsed || '';
    document.getElementById('stock-value').textContent = data.inventory.value || '';
}

async function fetchReportData() {
    showLoading();
    try {
        const { start, end } = getDateRange();
        if (start && end && start > end) { console.error('Start date must be before end date'); return; }
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start, end })
        });
        const data = await response.json();
        updateReportData(data);
    } catch (error) {
        console.error('Error fetching report data:', error);
    }
}

document.querySelectorAll('.export-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
        const format = this.textContent.includes('PDF') ? 'pdf' : 'csv';
        showLoading();
        try {
            const { start, end } = getDateRange();
            await fetch(`/api/export/${format}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start, end })
            });
            console.log(`Successfully exported to ${format.toUpperCase()}`);
            fetchReportData();
        } catch (error) {
            console.error('Export failed:', error);
        }
    });
});

const sidebarLinks = document.querySelectorAll('.sidebar a');
const sections = document.querySelectorAll('.report-section');

function showSection(sectionId) {
    sections.forEach(section => {
        section.style.display = section.id === `${sectionId}-section` ? 'block' : 'none';
    });
    sidebarLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
    });
}

sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('href').substring(1);
        showSection(sectionId);
        if (sectionId === 'user-details') loadUserDetails();
        else fetchReportData();
    });
});

const userForm = document.getElementById('user-details-form');
const feedback = document.getElementById('feedback');

function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `feedback-message ${type}`;
    element.classList.add('visible');
    setTimeout(() => element.classList.remove('visible'), 3000);
}

function loadUserDetails() {
    fetch('/api/user')
        .then(response => response.json())
        .then(data => {
            document.getElementById('user-name').value = data.name || '';
            document.getElementById('user-username').value = data.username || '';
            document.getElementById('user-email').value = data.email || '';
            document.getElementById('user-phone').value = data.phone || '';
            document.getElementById('user-gender').value = data.gender || '';
            document.getElementById('user-role').value = data.role || 'admin';
        })
        .catch(error => {
            console.error('Error loading user details:', error);
            showFeedback(feedback, 'Failed to load user details', 'error');
        });
}

async function saveUserDetails(e) {
    e.preventDefault();
    const userData = {
        name: document.getElementById('user-name').value,
        username: document.getElementById('user-username').value,
        email: document.getElementById('user-email').value,
        phone: document.getElementById('user-phone').value,
        gender: document.getElementById('user-gender').value,
        role: document.getElementById('user-role').value
    };
    const saveBtn = userForm.querySelector('.save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    try {
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Update failed');
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveBtn.disabled = false;
        showFeedback(feedback, 'User details saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving user details:', error);
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveBtn.disabled = false;
        showFeedback(feedback, 'Failed to save user details', 'error');
    }
}

userForm.addEventListener('submit', saveUserDetails);

showSection('overview');
fetchReportData();
