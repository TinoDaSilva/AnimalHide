// Supplier Management System for South African Hide Sourcing Agent
class SupplierManagementSystem {
    constructor() {
        this.suppliers = this.loadSuppliers();
        this.editingSupplierId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.displaySuppliers();
        this.updateStats();
    }

    bindEvents() {
        // Add supplier button
        document.getElementById('addSupplierBtn').addEventListener('click', () => this.showAddSupplierForm());
        
        // Cancel button
        document.getElementById('cancelSupplier').addEventListener('click', () => this.hideAddSupplierForm());
        
        // Form submission
        document.getElementById('supplierForm').addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Search and filter
        document.getElementById('supplierSearch').addEventListener('input', () => this.filterSuppliers());
        document.getElementById('specialtyFilter').addEventListener('change', () => this.filterSuppliers());
        
        // Import/Export buttons
        document.getElementById('importDataBtn').addEventListener('click', () => this.importData());
        document.getElementById('exportSuppliersBtn').addEventListener('click', () => this.exportSuppliers());
    }

    showAddSupplierForm() {
        document.getElementById('addSupplierForm').classList.remove('hidden');
        document.getElementById('addSupplierBtn').textContent = 'Hide Form';
        document.getElementById('addSupplierBtn').onclick = () => this.hideAddSupplierForm();
        this.clearForm();
    }

    hideAddSupplierForm() {
        document.getElementById('addSupplierForm').classList.add('hidden');
        document.getElementById('addSupplierBtn').textContent = 'Add New Supplier';
        document.getElementById('addSupplierBtn').onclick = () => this.showAddSupplierForm();
        this.clearForm();
        this.editingSupplierId = null;
    }

    clearForm() {
        document.getElementById('supplierForm').reset();
        this.editingSupplierId = null;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const supplierData = {
            id: this.editingSupplierId || Date.now(),
            companyName: formData.get('companyName'),
            website: formData.get('website'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            specialties: Array.from(document.getElementById('specialties').selectedOptions).map(option => option.value),
            grade: formData.get('grade'),
            notes: formData.get('notes'),
            createdAt: this.editingSupplierId ? this.suppliers.find(s => s.id === this.editingSupplierId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Validate required fields
        if (!supplierData.companyName || !supplierData.email || !supplierData.phone || !supplierData.address || supplierData.specialties.length === 0) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate email format
        if (!this.isValidEmail(supplierData.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate phone format
        if (!this.isValidPhone(supplierData.phone)) {
            alert('Please enter a valid phone number (e.g., +27 82 123 4567).');
            return;
        }

        if (this.editingSupplierId) {
            // Update existing supplier
            const index = this.suppliers.findIndex(s => s.id === this.editingSupplierId);
            if (index !== -1) {
                this.suppliers[index] = supplierData;
            }
        } else {
            // Add new supplier
            this.suppliers.push(supplierData);
        }

        this.saveSuppliers();
        this.displaySuppliers();
        this.hideAddSupplierForm();
        this.updateStats();
        
        alert(this.editingSupplierId ? 'Supplier updated successfully!' : 'Supplier added successfully!');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\+27\s\d{2}\s\d{3}\s\d{4}$/;
        return phoneRegex.test(phone);
    }

    displaySuppliers() {
        const tbody = document.getElementById('suppliersTableBody');
        tbody.innerHTML = '';

        if (this.suppliers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No suppliers added yet. Click "Add New Supplier" to get started.</td></tr>';
            return;
        }

        this.suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="company-info">
                        <strong>${supplier.companyName}</strong>
                        ${supplier.website ? `<br><a href="${supplier.website}" target="_blank" class="website-link">${supplier.website}</a>` : ''}
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <div>${supplier.email}</div>
                        <div>${supplier.phone}</div>
                    </div>
                </td>
                <td>
                    <div class="specialties">
                        ${supplier.specialties.map(specialty => `<span class="specialty-badge">${specialty}</span>`).join('')}
                    </div>
                </td>
                <td>
                    ${supplier.grade ? `<span class="grade-badge grade-${supplier.grade.toLowerCase().replace(' grade', '').replace(' ', '')}">${supplier.grade}</span>` : 'Not specified'}
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="supplierManager.editSupplier(${supplier.id})" class="btn-edit">Edit</button>
                        <button onclick="supplierManager.deleteSupplier(${supplier.id})" class="btn-delete">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    editSupplier(id) {
        const supplier = this.suppliers.find(s => s.id === id);
        if (!supplier) return;

        this.editingSupplierId = id;
        this.showAddSupplierForm();
        
        // Fill form with supplier data
        document.getElementById('companyName').value = supplier.companyName;
        document.getElementById('website').value = supplier.website || '';
        document.getElementById('email').value = supplier.email;
        document.getElementById('phone').value = supplier.phone;
        document.getElementById('address').value = supplier.address;
        document.getElementById('grade').value = supplier.grade || '';
        document.getElementById('notes').value = supplier.notes || '';
        
        // Select specialties
        const specialtiesSelect = document.getElementById('specialties');
        Array.from(specialtiesSelect.options).forEach(option => {
            option.selected = supplier.specialties.includes(option.value);
        });
    }

    deleteSupplier(id) {
        if (confirm('Are you sure you want to delete this supplier?')) {
            this.suppliers = this.suppliers.filter(s => s.id !== id);
            this.saveSuppliers();
            this.displaySuppliers();
            this.updateStats();
            alert('Supplier deleted successfully!');
        }
    }

    filterSuppliers() {
        const searchTerm = document.getElementById('supplierSearch').value.toLowerCase();
        const specialtyFilter = document.getElementById('specialtyFilter').value;
        
        const filteredSuppliers = this.suppliers.filter(supplier => {
            const matchesSearch = supplier.companyName.toLowerCase().includes(searchTerm) ||
                                supplier.email.toLowerCase().includes(searchTerm) ||
                                supplier.phone.includes(searchTerm);
            
            const matchesSpecialty = !specialtyFilter || supplier.specialties.includes(specialtyFilter);
            
            return matchesSearch && matchesSpecialty;
        });

        this.displayFilteredSuppliers(filteredSuppliers);
    }

    displayFilteredSuppliers(suppliers) {
        const tbody = document.getElementById('suppliersTableBody');
        tbody.innerHTML = '';

        if (suppliers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">No suppliers match your search criteria.</td></tr>';
            return;
        }

        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="company-info">
                        <strong>${supplier.companyName}</strong>
                        ${supplier.website ? `<br><a href="${supplier.website}" target="_blank" class="website-link">${supplier.website}</a>` : ''}
                    </div>
                </td>
                <td>
                    <div class="contact-info">
                        <div>${supplier.email}</div>
                        <div>${supplier.phone}</div>
                    </div>
                </td>
                <td>
                    <div class="specialties">
                        ${supplier.specialties.map(specialty => `<span class="specialty-badge">${specialty}</span>`).join('')}
                    </div>
                </td>
                <td>
                    ${supplier.grade ? `<span class="grade-badge grade-${supplier.grade.toLowerCase().replace(' grade', '').replace(' ', '')}">${supplier.grade}</span>` : 'Not specified'}
                </td>
                <td>
                    <div class="action-buttons">
                        <button onclick="supplierManager.editSupplier(${supplier.id})" class="btn-edit">Edit</button>
                        <button onclick="supplierManager.deleteSupplier(${supplier.id})" class="btn-delete">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv,.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (Array.isArray(data)) {
                            this.suppliers = [...this.suppliers, ...data];
                            this.saveSuppliers();
                            this.displaySuppliers();
                            this.updateStats();
                            alert('Data imported successfully!');
                        } else {
                            alert('Invalid file format. Please upload a valid JSON file.');
                        }
                    } catch (error) {
                        alert('Error importing data. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    exportSuppliers() {
        if (this.suppliers.length === 0) {
            alert('No suppliers to export.');
            return;
        }

        const dataStr = JSON.stringify(this.suppliers, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `suppliers-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    updateStats() {
        // Update any stats if needed
        console.log(`Total suppliers: ${this.suppliers.length}`);
    }

    loadSuppliers() {
        const stored = localStorage.getItem('sahideSuppliers');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error loading suppliers:', error);
                return [];
            }
        }
        return [];
    }

    saveSuppliers() {
        localStorage.setItem('sahideSuppliers', JSON.stringify(this.suppliers));
    }
}

// Initialize supplier management system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.supplierManager = new SupplierManagementSystem();
});
