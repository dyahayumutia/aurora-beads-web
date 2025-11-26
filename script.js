// Language dictionary
const lang = {
    id: {
        login_title: "Silakan masukkan email dan password Anda 😊",
        register_title: "Belum punya akun? Daftar dulu untuk mulai mencatat transaksi dan lihat laporan bisnismu 💖",
        email_label: "Email",
        password_label: "Password",
        confirm_password_label: "Konfirmasi Password",
        login_button: "Login",
        register_button: "Daftar",
        no_account: "Belum punya akun?",
        have_account: "Sudah punya akun?",
        switch_to_register: "Daftar di sini",
        switch_to_login: "Login di sini",
        dashboard_tagline: "Your simple business overview. Cash flow, summaries, and insights all in one place 💗📘",
        cash_receipt_title: "Cash Receipt Journal",
        cash_receipt_desc: "Catat semua penjualan produk Anda",
        purchase_journal_title: "Purchase Journal",
        purchase_journal_desc: "Catat pembelian bahan baku",
        cash_payment_title: "Cash Payment",
        cash_payment_desc: "Catat pengeluaran operasional",
        income_statement_title: "Income Statement",
        income_statement_desc: "Lihat laporan laba rugi bisnis",
        cash_receipt_header: "Cash Receipt Journal",
        back_to_dashboard: "Kembali ke Dashboard",
        select_product: "Pilih Produk",
        quantity: "Jumlah",
        add: "Tambah",
        date_col: "Tanggal",
        product_col: "Produk",
        quantity_col: "Jumlah",
        total_col: "Total",
        action_col: "Aksi",
        edit: "Edit",
        delete: "Hapus",
        purchase_journal_header: "Purchase Journal",
        description_col: "Deskripsi",
        price_col: "Harga per Unit",
        cash_payment_header: "Cash Payment Journal",
        amount_col: "Jumlah",
        income_statement_header: "Income Statement",
        revenue_card: "Pendapatan",
        cogs_card: "HPP",
        gross_profit_card: "Laba Kotor",
        expenses_card: "Beban Operasional",
        net_profit_card: "Laba Bersih",
        revenue_details: "Detail Pendapatan",
        cogs_details: "Detail Harga Pokok Penjualan",
        expenses_details: "Detail Beban Operasional",
        settings_header: "Settings",
        language_setting: "Bahasa / Language",
        account_setting: "Akun",
        current_user: "Email:",
        logout_button: "Logout"
    },
    en: {
        login_title: "Please enter your email and password 😊",
        register_title: "Don't have an account? Register first to start recording transactions and see your business reports 💖",
        email_label: "Email",
        password_label: "Password",
        confirm_password_label: "Confirm Password",
        login_button: "Login",
        register_button: "Register",
        no_account: "Don't have an account?",
        have_account: "Already have an account?",
        switch_to_register: "Register here",
        switch_to_login: "Login here",
        dashboard_tagline: "Your simple business overview. Cash flow, summaries, and insights all in one place 💗📘",
        cash_receipt_title: "Cash Receipt Journal",
        cash_receipt_desc: "Record all your product sales",
        purchase_journal_title: "Purchase Journal",
        purchase_journal_desc: "Record raw material purchases",
        cash_payment_title: "Cash Payment",
        cash_payment_desc: "Record operational expenses",
        income_statement_title: "Income Statement",
        income_statement_desc: "View your business profit and loss report",
        cash_receipt_header: "Cash Receipt Journal",
        back_to_dashboard: "Back to Dashboard",
        select_product: "Select Product",
        quantity: "Quantity",
        add: "Add",
        date_col: "Date",
        product_col: "Product",
        quantity_col: "Quantity",
        total_col: "Total",
        action_col: "Action",
        edit: "Edit",
        delete: "Delete",
        purchase_journal_header: "Purchase Journal",
        description_col: "Description",
        price_col: "Price per Unit",
        cash_payment_header: "Cash Payment Journal",
        amount_col: "Amount",
        income_statement_header: "Income Statement",
        revenue_card: "Revenue",
        cogs_card: "COGS",
        gross_profit_card: "Gross Profit",
        expenses_card: "Operating Expenses",
        net_profit_card: "Net Profit",
        revenue_details: "Revenue Details",
        cogs_details: "Cost of Goods Sold Details",
        expenses_details: "Operating Expenses Details",
        settings_header: "Settings",
        language_setting: "Language / Bahasa",
        account_setting: "Account",
        current_user: "Email:",
        logout_button: "Logout"
    }
};

// Product prices
const productPrices = {
    "Bracelet": 10000,
    "Necklace": 15000,
    "Ring": 5000,
    "Hair Pins": 5000,
    "Phone Strap": 20000,
    "Keychain Small": 10000,
    "Keychain Big": 20000
};

// Current language
let currentLang = 'id';
let currentUser = null;

// DOM Elements
const authContainer = document.getElementById('auth-container');
const dashboardContainer = document.getElementById('dashboard-container');
const cashReceiptContainer = document.getElementById('cash-receipt-container');
const purchaseJournalContainer = document.getElementById('purchase-journal-container');
const cashPaymentContainer = document.getElementById('cash-payment-container');
const incomeStatementContainer = document.getElementById('income-statement-container');
const settingsContainer = document.getElementById('settings-container');

// ==================== FIREBASE AUTHENTICATION ====================

// Initialize the application dengan Firebase
function init() {
    console.log('Initializing Aurora Beads App with Firebase...');
    
    // Firebase Auth State Observer
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            currentUser = user.email;
            localStorage.setItem('aurora_current_user', user.email);
            showDashboard();
        } else {
            // User is signed out
            showAuth();
        }
    });

    // Set up event listeners
    setupEventListeners();
    
    // Set today's date as default in date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = [
        'cash-receipt-date',
        'purchase-journal-date', 
        'cash-payment-date'
    ];
    
    dateInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = today;
    });
    
    // Load initial language
    updateLanguage();
    
    console.log('App initialized successfully with Firebase');
}

// Login function dengan Firebase
async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Reset errors
    document.getElementById('login-email-error').style.display = 'none';
    document.getElementById('login-password-error').style.display = 'none';
    
    // Validate inputs
    if (!email) {
        document.getElementById('login-email-error').textContent = currentLang === 'id' ? 'Email harus diisi' : 'Email is required';
        document.getElementById('login-email-error').style.display = 'block';
        return;
    }
    
    if (!password) {
        document.getElementById('login-password-error').textContent = currentLang === 'id' ? 'Password harus diisi' : 'Password is required';
        document.getElementById('login-password-error').style.display = 'block';
        return;
    }
    
    try {
        // Firebase Authentication
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        currentUser = email;
        localStorage.setItem('aurora_current_user', email);
        showDashboard();
    } catch (error) {
        console.error('Login error:', error);
        let errorMessage = currentLang === 'id' ? 'Email atau password salah' : 'Invalid email or password';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = currentLang === 'id' ? 'Email tidak terdaftar' : 'Email not registered';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = currentLang === 'id' ? 'Password salah' : 'Wrong password';
        }
        
        document.getElementById('login-password-error').textContent = errorMessage;
        document.getElementById('login-password-error').style.display = 'block';
    }
}

// Register function dengan Firebase
async function register() {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Reset errors
    document.getElementById('register-email-error').style.display = 'none';
    document.getElementById('register-password-error').style.display = 'none';
    document.getElementById('confirm-password-error').style.display = 'none';
    
    // Validate inputs
    if (!email) {
        document.getElementById('register-email-error').textContent = currentLang === 'id' ? 'Email harus diisi' : 'Email is required';
        document.getElementById('register-email-error').style.display = 'block';
        return;
    }
    
    if (!password) {
        document.getElementById('register-password-error').textContent = currentLang === 'id' ? 'Password harus diisi' : 'Password is required';
        document.getElementById('register-password-error').style.display = 'block';
        return;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').textContent = currentLang === 'id' ? 'Password tidak cocok' : 'Passwords do not match';
        document.getElementById('confirm-password-error').style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        document.getElementById('register-password-error').textContent = currentLang === 'id' ? 'Password minimal 6 karakter' : 'Password must be at least 6 characters';
        document.getElementById('register-password-error').style.display = 'block';
        return;
    }
    
    try {
        // Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        // Login the new user
        currentUser = email;
        localStorage.setItem('aurora_current_user', email);
        showDashboard();
        
    } catch (error) {
        console.error('Registration error:', error);
        let errorMessage = currentLang === 'id' ? 'Terjadi kesalahan saat pendaftaran' : 'Registration failed';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = currentLang === 'id' ? 'Email sudah terdaftar' : 'Email already registered';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = currentLang === 'id' ? 'Format email tidak valid' : 'Invalid email format';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = currentLang === 'id' ? 'Password terlalu lemah' : 'Password is too weak';
        }
        
        document.getElementById('register-email-error').textContent = errorMessage;
        document.getElementById('register-email-error').style.display = 'block';
    }
}

// Logout function dengan Firebase
function logout() {
    firebase.auth().signOut().then(() => {
        currentUser = null;
        localStorage.removeItem('aurora_current_user');
        showAuth();
        showLogin();
    }).catch((error) => {
        console.error('Logout error:', error);
        // Fallback ke cara lama
        currentUser = null;
        localStorage.removeItem('aurora_current_user');
        showAuth();
        showLogin();
    });
}

// ==================== UI FUNCTIONS ====================

// Set up all event listeners
function setupEventListeners() {
    // Auth events
    document.getElementById('switch-to-register').addEventListener('click', showRegister);
    document.getElementById('switch-to-login').addEventListener('click', showLogin);
    document.getElementById('login-button').addEventListener('click', login);
    document.getElementById('register-button').addEventListener('click', register);
    document.getElementById('language-toggle').addEventListener('click', toggleLanguage);

    // Dashboard events
    document.getElementById('cash-receipt-menu').addEventListener('click', () => showJournal('cash-receipt'));
    document.getElementById('purchase-journal-menu').addEventListener('click', () => showJournal('purchase-journal'));
    document.getElementById('cash-payment-menu').addEventListener('click', () => showJournal('cash-payment'));
    document.getElementById('income-statement-menu').addEventListener('click', () => showJournal('income-statement'));
    document.getElementById('settings-button').addEventListener('click', () => showJournal('settings'));

    // Back buttons
    document.getElementById('cash-receipt-back').addEventListener('click', showDashboard);
    document.getElementById('purchase-journal-back').addEventListener('click', showDashboard);
    document.getElementById('cash-payment-back').addEventListener('click', showDashboard);
    document.getElementById('income-statement-back').addEventListener('click', showDashboard);
    document.getElementById('settings-back').addEventListener('click', showDashboard);

    // Journal add buttons
    document.getElementById('cash-receipt-add').addEventListener('click', addCashReceipt);
    document.getElementById('purchase-journal-add').addEventListener('click', addPurchaseJournal);
    document.getElementById('cash-payment-add').addEventListener('click', addCashPayment);

    // Settings events
    document.getElementById('id-language').addEventListener('click', () => changeLanguage('id'));
    document.getElementById('en-language').addEventListener('click', () => changeLanguage('en'));
    document.getElementById('logout-button').addEventListener('click', logout);
}

// Show authentication screen
function showAuth() {
    hideAllContainers();
    authContainer.classList.remove('hidden');
}

// Show login form
function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

// Show register form
function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

// Show dashboard
function showDashboard() {
    hideAllContainers();
    dashboardContainer.classList.remove('hidden');
    document.getElementById('user-email').textContent = currentUser;
}

// Show specific journal
function showJournal(journalType) {
    hideAllContainers();
    
    switch(journalType) {
        case 'cash-receipt':
            cashReceiptContainer.classList.remove('hidden');
            loadCashReceiptData();
            break;
        case 'purchase-journal':
            purchaseJournalContainer.classList.remove('hidden');
            loadPurchaseJournalData();
            break;
        case 'cash-payment':
            cashPaymentContainer.classList.remove('hidden');
            loadCashPaymentData();
            break;
        case 'income-statement':
            incomeStatementContainer.classList.remove('hidden');
            loadIncomeStatementData();
            break;
        case 'settings':
            settingsContainer.classList.remove('hidden');
            document.getElementById('settings-user-email').textContent = currentUser;
            break;
    }
}

// Hide all containers
function hideAllContainers() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.add('hidden');
    cashReceiptContainer.classList.add('hidden');
    purchaseJournalContainer.classList.add('hidden');
    cashPaymentContainer.classList.add('hidden');
    incomeStatementContainer.classList.add('hidden');
    settingsContainer.classList.add('hidden');
}

// Toggle language
function toggleLanguage() {
    currentLang = currentLang === 'id' ? 'en' : 'id';
    updateLanguage();
}

// Change language
function changeLanguage(langCode) {
    currentLang = langCode;
    updateLanguage();
    
    // Update active language button in settings
    document.getElementById('id-language').classList.toggle('active', langCode === 'id');
    document.getElementById('en-language').classList.toggle('active', langCode === 'en');
}

// Update all text based on current language
function updateLanguage() {
    const elements = document.querySelectorAll('[id]');
    elements.forEach(element => {
        const key = element.id.replace(/-/g, '_');
        if (lang[currentLang][key]) {
            if (element.tagName === 'INPUT' && element.type !== 'button') {
                element.placeholder = lang[currentLang][key];
            } else {
                element.textContent = lang[currentLang][key];
            }
        }
    });
    
    // Update language toggle button
    document.getElementById('language-toggle').textContent = currentLang === 'id' ? 'EN' : 'ID';
}

// ==================== FIRESTORE DATA FUNCTIONS ====================

// Add cash receipt entry dengan Firestore
async function addCashReceipt() {
    const date = document.getElementById('cash-receipt-date').value;
    const product = document.getElementById('cash-receipt-product').value;
    const quantity = parseInt(document.getElementById('cash-receipt-quantity').value);
    
    if (!date || !product || !quantity || quantity < 1) {
        alert(currentLang === 'id' ? 'Harap isi semua field dengan benar' : 'Please fill all fields correctly');
        return;
    }
    
    const price = productPrices[product];
    const total = price * quantity;
    
    const entry = {
        date,
        product,
        quantity,
        total,
        userId: currentUser,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await firebase.firestore().collection('cashReceipts').add(entry);
        
        // Reset form
        document.getElementById('cash-receipt-product').selectedIndex = 0;
        document.getElementById('cash-receipt-quantity').value = '';
        
        loadCashReceiptData();
    } catch (error) {
        console.error('Error adding cash receipt:', error);
        alert(currentLang === 'id' ? 'Gagal menyimpan data' : 'Failed to save data');
    }
}

// Load cash receipt data dari Firestore
async function loadCashReceiptData() {
    try {
        const snapshot = await firebase.firestore()
            .collection('cashReceipts')
            .where('userId', '==', currentUser)
            .orderBy('createdAt', 'desc')
            .get();
        
        const tbody = document.getElementById('cash-receipt-tbody');
        tbody.innerHTML = '';
        
        snapshot.forEach(doc => {
            const entry = { id: doc.id, ...doc.data() };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.product}</td>
                <td>${entry.quantity}</td>
                <td>${formatCurrency(entry.total)}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${entry.id}">${lang[currentLang].edit}</button>
                    <button class="delete-btn" data-id="${entry.id}">${lang[currentLang].delete}</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                editCashReceipt(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteCashReceipt(id);
            });
        });
    } catch (error) {
        console.error('Error loading cash receipts:', error);
    }
}

// Edit cash receipt entry
async function editCashReceipt(id) {
    try {
        const doc = await firebase.firestore().collection('cashReceipts').doc(id).get();
        const entry = doc.data();
        
        if (!entry) return;
        
        // Fill the form with entry data
        document.getElementById('cash-receipt-date').value = entry.date;
        document.getElementById('cash-receipt-product').value = entry.product;
        document.getElementById('cash-receipt-quantity').value = entry.quantity;
        
        // Delete the old entry
        await deleteCashReceipt(id);
    } catch (error) {
        console.error('Error editing cash receipt:', error);
    }
}

// Delete cash receipt entry
async function deleteCashReceipt(id) {
    try {
        await firebase.firestore().collection('cashReceipts').doc(id).delete();
        loadCashReceiptData();
    } catch (error) {
        console.error('Error deleting cash receipt:', error);
        alert(currentLang === 'id' ? 'Gagal menghapus data' : 'Failed to delete data');
    }
}

// Add purchase journal entry dengan Firestore
async function addPurchaseJournal() {
    const date = document.getElementById('purchase-journal-date').value;
    const description = document.getElementById('purchase-journal-description').value;
    const quantity = parseInt(document.getElementById('purchase-journal-quantity').value);
    const price = parseInt(document.getElementById('purchase-journal-price').value);
    
    if (!date || !description || !quantity || quantity < 1 || !price || price < 1) {
        alert(currentLang === 'id' ? 'Harap isi semua field dengan benar' : 'Please fill all fields correctly');
        return;
    }
    
    const total = price * quantity;
    
    const entry = {
        date,
        description,
        quantity,
        price,
        total,
        userId: currentUser,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await firebase.firestore().collection('purchases').add(entry);
        
        // Reset form
        document.getElementById('purchase-journal-description').value = '';
        document.getElementById('purchase-journal-quantity').value = '';
        document.getElementById('purchase-journal-price').value = '';
        
        loadPurchaseJournalData();
    } catch (error) {
        console.error('Error adding purchase:', error);
        alert(currentLang === 'id' ? 'Gagal menyimpan data' : 'Failed to save data');
    }
}

// Load purchase journal data dari Firestore
async function loadPurchaseJournalData() {
    try {
        const snapshot = await firebase.firestore()
            .collection('purchases')
            .where('userId', '==', currentUser)
            .orderBy('createdAt', 'desc')
            .get();
        
        const tbody = document.getElementById('purchase-journal-tbody');
        tbody.innerHTML = '';
        
        snapshot.forEach(doc => {
            const entry = { id: doc.id, ...doc.data() };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.description}</td>
                <td>${entry.quantity}</td>
                <td>${formatCurrency(entry.price)}</td>
                <td>${formatCurrency(entry.total)}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${entry.id}">${lang[currentLang].edit}</button>
                    <button class="delete-btn" data-id="${entry.id}">${lang[currentLang].delete}</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                editPurchaseJournal(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deletePurchaseJournal(id);
            });
        });
    } catch (error) {
        console.error('Error loading purchases:', error);
    }
}

// Edit purchase journal entry
async function editPurchaseJournal(id) {
    try {
        const doc = await firebase.firestore().collection('purchases').doc(id).get();
        const entry = doc.data();
        
        if (!entry) return;
        
        // Fill the form with entry data
        document.getElementById('purchase-journal-date').value = entry.date;
        document.getElementById('purchase-journal-description').value = entry.description;
        document.getElementById('purchase-journal-quantity').value = entry.quantity;
        document.getElementById('purchase-journal-price').value = entry.price;
        
        // Delete the old entry
        await deletePurchaseJournal(id);
    } catch (error) {
        console.error('Error editing purchase:', error);
    }
}

// Delete purchase journal entry
async function deletePurchaseJournal(id) {
    try {
        await firebase.firestore().collection('purchases').doc(id).delete();
        loadPurchaseJournalData();
    } catch (error) {
        console.error('Error deleting purchase:', error);
        alert(currentLang === 'id' ? 'Gagal menghapus data' : 'Failed to delete data');
    }
}

// Add cash payment entry dengan Firestore
async function addCashPayment() {
    const date = document.getElementById('cash-payment-date').value;
    const description = document.getElementById('cash-payment-description').value;
    const amount = parseInt(document.getElementById('cash-payment-amount').value);
    
    if (!date || !description || !amount || amount < 1) {
        alert(currentLang === 'id' ? 'Harap isi semua field dengan benar' : 'Please fill all fields correctly');
        return;
    }
    
    const entry = {
        date,
        description,
        amount,
        userId: currentUser,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        await firebase.firestore().collection('payments').add(entry);
        
        // Reset form
        document.getElementById('cash-payment-description').value = '';
        document.getElementById('cash-payment-amount').value = '';
        
        loadCashPaymentData();
    } catch (error) {
        console.error('Error adding payment:', error);
        alert(currentLang === 'id' ? 'Gagal menyimpan data' : 'Failed to save data');
    }
}

// Load cash payment data dari Firestore
async function loadCashPaymentData() {
    try {
        const snapshot = await firebase.firestore()
            .collection('payments')
            .where('userId', '==', currentUser)
            .orderBy('createdAt', 'desc')
            .get();
        
        const tbody = document.getElementById('cash-payment-tbody');
        tbody.innerHTML = '';
        
        snapshot.forEach(doc => {
            const entry = { id: doc.id, ...doc.data() };
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.description}</td>
                <td>${formatCurrency(entry.amount)}</td>
                <td class="action-buttons">
                    <button class="edit-btn" data-id="${entry.id}">${lang[currentLang].edit}</button>
                    <button class="delete-btn" data-id="${entry.id}">${lang[currentLang].delete}</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                editCashPayment(id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                deleteCashPayment(id);
            });
        });
    } catch (error) {
        console.error('Error loading payments:', error);
    }
}

// Edit cash payment entry
async function editCashPayment(id) {
    try {
        const doc = await firebase.firestore().collection('payments').doc(id).get();
        const entry = doc.data();
        
        if (!entry) return;
        
        // Fill the form with entry data
        document.getElementById('cash-payment-date').value = entry.date;
        document.getElementById('cash-payment-description').value = entry.description;
        document.getElementById('cash-payment-amount').value = entry.amount;
        
        // Delete the old entry
        await deleteCashPayment(id);
    } catch (error) {
        console.error('Error editing payment:', error);
    }
}

// Delete cash payment entry
async function deleteCashPayment(id) {
    try {
        await firebase.firestore().collection('payments').doc(id).delete();
        loadCashPaymentData();
    } catch (error) {
        console.error('Error deleting payment:', error);
        alert(currentLang === 'id' ? 'Gagal menghapus data' : 'Failed to delete data');
    }
}

// Load income statement data dari Firestore
async function loadIncomeStatementData() {
    try {
        // Get all data concurrently
        const [cashReceiptsSnapshot, purchasesSnapshot, paymentsSnapshot] = await Promise.all([
            firebase.firestore().collection('cashReceipts').where('userId', '==', currentUser).get(),
            firebase.firestore().collection('purchases').where('userId', '==', currentUser).get(),
            firebase.firestore().collection('payments').where('userId', '==', currentUser).get()
        ]);
        
        // Calculate totals
        const revenue = cashReceiptsSnapshot.docs.reduce((sum, doc) => sum + doc.data().total, 0);
        const cogs = purchasesSnapshot.docs.reduce((sum, doc) => sum + doc.data().total, 0);
        const expenses = paymentsSnapshot.docs.reduce((sum, doc) => sum + doc.data().amount, 0);
        const grossProfit = revenue - cogs;
        const netProfit = grossProfit - expenses;
        
        // Update summary cards
        document.getElementById('revenue-amount').textContent = formatCurrency(revenue);
        document.getElementById('cogs-amount').textContent = formatCurrency(cogs);
        document.getElementById('gross-profit-amount').textContent = formatCurrency(grossProfit);
        document.getElementById('expenses-amount').textContent = formatCurrency(expenses);
        document.getElementById('net-profit-amount').textContent = formatCurrency(netProfit);
        
        // Add color classes based on profit/loss
        document.getElementById('gross-profit-amount').className = `amount ${grossProfit >= 0 ? 'positive' : 'negative'}`;
        document.getElementById('net-profit-amount').className = `amount ${netProfit >= 0 ? 'positive' : 'negative'}`;
        
        // Load detailed tables
        loadRevenueTable(cashReceiptsSnapshot.docs);
        loadCogsTable(purchasesSnapshot.docs);
        loadExpensesTable(paymentsSnapshot.docs);
    } catch (error) {
        console.error('Error loading income statement:', error);
    }
}

// Load revenue table
function loadRevenueTable(docs) {
    const tbody = document.getElementById('revenue-tbody');
    tbody.innerHTML = '';
    
    docs.forEach(doc => {
        const entry = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.product}</td>
            <td>${entry.quantity}</td>
            <td>${formatCurrency(entry.total)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Load COGS table
function loadCogsTable(docs) {
    const tbody = document.getElementById('cogs-tbody');
    tbody.innerHTML = '';
    
    docs.forEach(doc => {
        const entry = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.description}</td>
            <td>${entry.quantity}</td>
            <td>${formatCurrency(entry.price)}</td>
            <td>${formatCurrency(entry.total)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Load expenses table
function loadExpensesTable(docs) {
    const tbody = document.getElementById('expenses-tbody');
    tbody.innerHTML = '';
    
    docs.forEach(doc => {
        const entry = doc.data();
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.description}</td>
            <td>${formatCurrency(entry.amount)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Format currency to Indonesian Rupiah
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
