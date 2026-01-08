// PAGE NAVIGATION
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('page-active'));
    document.getElementById(id).classList.add('page-active');
    window.scrollTo(0,0);
}

// ADMIN MANAGEMENT [cite: 42, 43]
function handleAdminLogin(e) {
    e.preventDefault();
    const uid = document.getElementById('admin-uid').value;
    const password = document.getElementById('admin-password').value;
    if(uid === "admin" && password === "admin123") { // Secure access simulation [cite: 57]
        showPage('admin-dashboard');
        updateCount();
    } else {
        alert("Invalid Admin Credentials!");
    }
}

// DATA MANAGEMENT (BULK UPLOAD) [cite: 46, 47]
function uploadData() {
    const input = document.getElementById('csv-input').value;
    const template = document.getElementById('template-select').value;
    const rows = input.split('\n');
    let db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    let validRows = 0;

    rows.forEach(row => {
        const parts = row.split(',');
        if(parts.length === 5) { // Validation check
            db.push({
                id: parts[0].trim(),
                name: parts[1].trim(),
                domain: parts[2].trim(),
                start: parts[3].trim(),
                end: parts[4].trim(),
                template: template
            });
            validRows++;
        }
    });

    localStorage.setItem('mongoDB', JSON.stringify(db));
    alert(`Sync Successful! ${validRows} records added to Database with ${template} template.`);
    document.getElementById('csv-input').value = '';
    updateCount();
}

function updateCount() {
    const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    document.getElementById('total-count').innerText = db.length;
}

// CERTIFICATE VERIFICATION [cite: 52, 53]
function verifyCertificate() {
    const searchId = document.getElementById('search-id').value;
    const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    const student = db.find(s => s.id === searchId);

    if(student) {
        // Populate certificate [cite: 50, 51]
        document.getElementById('view-name').innerText = student.name;
        document.getElementById('view-domain').innerText = student.domain;
        document.getElementById('view-start').innerText = student.start;
        document.getElementById('view-end').innerText = student.end;
        document.getElementById('view-id').innerText = student.id;

        // Apply certificate template
        applyCertificateTemplate(student.template || 'default');

        // Generate QR Code
        generateQRCode(student.id);

        // Show dashboard link for verified users
        document.getElementById('user-dashboard-link').classList.remove('hidden');

        // Simulate email notification
        simulateEmailNotification(student);

        document.getElementById('cert-output-area').classList.remove('hidden');
        document.getElementById('cert-output-area').scrollIntoView({behavior: 'smooth'});
    } else {
        alert("Certificate ID not found! Ensure the ID is correct.");
        document.getElementById('cert-output-area').classList.add('hidden');
    }
}

// CERTIFICATE TEMPLATES
function applyCertificateTemplate(template) {
    const certCard = document.getElementById('capture-area');
    certCard.className = 'max-w-4xl mx-auto cert-card p-12 text-center shadow-2xl'; // Reset classes

    switch(template) {
        case 'premium':
            certCard.classList.add('bg-gradient-to-br', 'from-yellow-100', 'to-yellow-200', 'border-4', 'border-yellow-400');
            break;
        case 'minimal':
            certCard.classList.add('bg-white', 'border-2', 'border-gray-300');
            break;
        case 'corporate':
            certCard.classList.add('bg-gradient-to-br', 'from-blue-50', 'to-blue-100', 'border-4', 'border-blue-500');
            break;
        default: // default
            certCard.classList.add('bg-white', 'border-20', 'border-blue-900');
    }
}

// QR CODE GENERATION
function generateQRCode(certId) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = ''; // Clear previous QR code
    new QRCode(qrContainer, {
        text: `https://amdoX.com/verify/${certId}`,
        width: 64,
        height: 64
    });
}

// EMAIL NOTIFICATION SIMULATION
function simulateEmailNotification(student) {
    // Simulate sending email
    console.log(`Email sent to ${student.name}: Your certificate ${student.id} has been verified.`);
    alert(`Email notification sent to ${student.name} for certificate verification.`);
}

// USER AUTHENTICATION FUNCTIONS
function handleUserLogin(e) {
    e.preventDefault();
    const email = document.getElementById('user-email').value;
    const password = document.getElementById('user-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showPage('user-dashboard');
        displayCertificates(JSON.parse(localStorage.getItem('mongoDB')) || []);
    } else {
        alert("Invalid email or password!");
    }
}

function handleUserRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }
    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Registration successful! Please login.");
    showPage('user-login');
}

// USER DASHBOARD FUNCTIONS
function logoutUser() {
    localStorage.removeItem('currentUser');
    document.getElementById('user-dashboard-link').classList.add('hidden');
    showPage('user-portal');
}

function filterCertificates() {
    const searchTerm = document.getElementById('dashboard-search').value.toLowerCase();
    const filterDomain = document.getElementById('dashboard-filter').value;
    const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    const filtered = db.filter(cert => {
        const matchesSearch = cert.id.toLowerCase().includes(searchTerm) ||
                             cert.name.toLowerCase().includes(searchTerm) ||
                             cert.domain.toLowerCase().includes(searchTerm);
        const matchesDomain = !filterDomain || cert.domain === filterDomain;
        return matchesSearch && matchesDomain;
    });
    displayCertificates(filtered);
}

function displayCertificates(certificates) {
    const container = document.getElementById('certificates-list');
    container.innerHTML = '';
    certificates.forEach(cert => {
        const certCard = document.createElement('div');
        certCard.className = 'bg-white p-6 rounded-2xl shadow-lg border';
        certCard.innerHTML = `
            <h3 class="font-bold text-lg mb-2">${cert.name}</h3>
            <p class="text-sm text-slate-600 mb-1">ID: ${cert.id}</p>
            <p class="text-sm text-slate-600 mb-1">Domain: ${cert.domain}</p>
            <p class="text-sm text-slate-600 mb-4">Period: ${cert.start} - ${cert.end}</p>
            <button onclick="viewCertificate('${cert.id}')" class="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition">View Certificate</button>
        `;
        container.appendChild(certCard);
    });
}

function viewCertificate(certId) {
    document.getElementById('search-id').value = certId;
    verifyCertificate();
    showPage('user-portal');
}

// ADVANCED ADMIN FEATURES
function deleteCertificate(certId) {
    let db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    db = db.filter(cert => cert.id !== certId);
    localStorage.setItem('mongoDB', JSON.stringify(db));
    updateCount();
    alert('Certificate deleted successfully.');
    // Refresh admin dashboard if needed
}

function editCertificate(certId) {
    const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    const cert = db.find(c => c.id === certId);
    if (cert) {
        const newName = prompt('Enter new name:', cert.name);
        const newDomain = prompt('Enter new domain:', cert.domain);
        const newStart = prompt('Enter new start date:', cert.start);
        const newEnd = prompt('Enter new end date:', cert.end);
        if (newName && newDomain && newStart && newEnd) {
            cert.name = newName;
            cert.domain = newDomain;
            cert.start = newStart;
            cert.end = newEnd;
            localStorage.setItem('mongoDB', JSON.stringify(db));
            alert('Certificate updated successfully.');
            updateCount();
        }
    }
}

function searchCertificates() {
    const searchTerm = prompt('Enter search term (ID, Name, or Domain):');
    if (searchTerm) {
        const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
        const results = db.filter(cert =>
            cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.domain.toLowerCase().includes(searchTerm.toLowerCase())
        );
        alert(`Found ${results.length} certificates matching "${searchTerm}".`);
        // Could display results in a modal or separate section
    }
}

// CERTIFICATE DOWNLOAD (PDF) [cite: 54, 55]
function downloadPDF() {
    const element = document.getElementById('capture-area');
    const opt = {
        margin: 0,
        filename: 'Internship_Certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}

function logout() { location.reload(); }

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize default accounts and sample data
    initializeDefaultAccounts();

    // Load all certificates for dashboard
    const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    displayCertificates(db);

    // Update stats on main page
    updateStats();

    // Display recent certificates on user portal
    displayRecentCertificates();
});

function displayRecentCertificates() {
    const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    const recentCerts = db.slice(-3); // Get last 3 certificates
    const container = document.getElementById('recent-certificates');
    container.innerHTML = '';

    recentCerts.forEach(cert => {
        const certCard = document.createElement('div');
        certCard.className = 'bg-white p-6 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow';
        certCard.innerHTML = `
            <h3 class="font-bold text-lg mb-2">${cert.name}</h3>
            <p class="text-sm text-slate-600 mb-1">ID: ${cert.id}</p>
            <p class="text-sm text-slate-600 mb-1">Domain: ${cert.domain}</p>
            <p class="text-sm text-slate-600 mb-4">Period: ${cert.start} - ${cert.end}</p>
            <button onclick="viewCertificate('${cert.id}')" class="bg-blue-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition">View Certificate</button>
        `;
        container.appendChild(certCard);
    });
}

function updateStats() {
    const db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    document.getElementById('stats-certificates').innerText = db.length;
    document.getElementById('stats-users').innerText = users.length;
}

// Initialize default accounts if they don't exist
function initializeDefaultAccounts() {
    // Initialize default admin account
    if (!localStorage.getItem('adminAccounts')) {
        const defaultAdmin = {
            uid: 'admin',
            password: 'admin123',
            role: 'admin'
        };
        localStorage.setItem('adminAccounts', JSON.stringify([defaultAdmin]));
    }

    // Initialize default user accounts
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const defaultUsers = [
        { name: 'John Doe', email: 'john@example.com', password: 'password123' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'password123' },
        { name: 'Bob Johnson', email: 'bob@example.com', password: 'password123' }
    ];

    let addedUsers = false;
    defaultUsers.forEach(defaultUser => {
        if (!users.find(u => u.email === defaultUser.email)) {
            users.push(defaultUser);
            addedUsers = true;
        }
    });

    if (addedUsers) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Initialize sample certificates
    let db = JSON.parse(localStorage.getItem('mongoDB')) || [];
    const sampleCertificates = [
        { id: 'AMD-INT-2026-01', name: 'John Doe', domain: 'Web Dev', start: '01/26', end: '02/26', template: 'default' },
        { id: 'AMD-INT-2026-02', name: 'Jane Smith', domain: 'Data Science', start: '01/26', end: '02/26', template: 'premium' },
        { id: 'AMD-INT-2026-03', name: 'Bob Johnson', domain: 'AI/ML', start: '01/26', end: '02/26', template: 'corporate' }
    ];

    let addedCerts = false;
    sampleCertificates.forEach(cert => {
        if (!db.find(c => c.id === cert.id)) {
            db.push(cert);
            addedCerts = true;
        }
    });

    if (addedCerts) {
        localStorage.setItem('mongoDB', JSON.stringify(db));
    }
}
