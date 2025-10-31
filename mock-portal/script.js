// Mock Insurance Portal Logic
// This simulates a real insurance eligibility portal with realistic delays and responses

const VALID_CREDENTIALS = {
    username: 'test_user',
    password: 'test_pass123'
};

// Mock database of patient eligibility
const MOCK_ELIGIBILITY_DATA = {
    'BCBS123456789': {
        status: 'Active',
        coverageType: 'PPO - Behavioral Health',
        effectiveDate: '2024-01-01',
        terminationDate: '2025-12-31',
        copay: '$25',
        deductible: '$500',
        deductibleMet: '$150'
    },
    'AET987654321': {
        status: 'Active',
        coverageType: 'HMO - Mental Health Services',
        effectiveDate: '2024-03-15',
        terminationDate: '2025-03-14',
        copay: '$30',
        deductible: '$1000',
        deductibleMet: '$0'
    },
    'UHC456789123': {
        status: 'Active',
        coverageType: 'EPO - ABA Therapy',
        effectiveDate: '2023-06-01',
        terminationDate: '2025-05-31',
        copay: '$0',
        deductible: '$0',
        deductibleMet: 'N/A'
    },
    'CIG789123456': {
        status: 'Inactive',
        coverageType: 'PPO - Behavioral Health',
        effectiveDate: '2023-01-01',
        terminationDate: '2024-12-31',
        copay: 'N/A',
        deductible: 'N/A',
        deductibleMet: 'N/A'
    },
    'HUM321654987': {
        status: 'Active',
        coverageType: 'HMO - Pediatric Services',
        effectiveDate: '2024-07-01',
        terminationDate: '2025-06-30',
        copay: '$20',
        deductible: '$500',
        deductibleMet: '$500'
    },
    'ANT147258369': {
        status: 'Active',
        coverageType: 'PPO - Autism Services',
        effectiveDate: '2024-01-01',
        terminationDate: '2025-12-31',
        copay: '$25',
        deductible: '$750',
        deductibleMet: '$200'
    },
    'KP963852741': {
        status: 'Active',
        coverageType: 'HMO - Behavioral Health',
        effectiveDate: '2024-02-01',
        terminationDate: '2025-01-31',
        copay: '$15',
        deductible: '$0',
        deductibleMet: 'N/A'
    },
    'MOL258369147': {
        status: 'Active',
        coverageType: 'Medicaid - Full Coverage',
        effectiveDate: '2024-01-01',
        terminationDate: '2025-12-31',
        copay: '$0',
        deductible: '$0',
        deductibleMet: 'N/A'
    },
    // Edge case: Special characters in name (apostrophe)
    'BCBS999888777': {
        status: 'Active',
        coverageType: 'PPO - Behavioral Health',
        effectiveDate: '2024-01-01',
        terminationDate: '2025-12-31',
        copay: '$25',
        deductible: '$500',
        deductibleMet: '$100'
    },
    // Edge case: International characters
    'AET111222333': {
        status: 'Active',
        coverageType: 'HMO - Pediatric ABA',
        effectiveDate: '2024-06-01',
        terminationDate: '2025-05-31',
        copay: '$20',
        deductible: '$750',
        deductibleMet: '$0'
    },
    // Edge case: Long last name
    'CIG555666777': {
        status: 'Active',
        coverageType: 'PPO - Mental Health',
        effectiveDate: '2024-03-01',
        terminationDate: '2025-02-28',
        copay: '$30',
        deductible: '$1000',
        deductibleMet: '$250'
    },
    // Edge case: Missing first name - should handle gracefully
    'HUM444555666': {
        status: 'Active',
        coverageType: 'HMO - Behavioral Health',
        effectiveDate: '2024-01-01',
        terminationDate: '2025-12-31',
        copay: '$15',
        deductible: '$500',
        deductibleMet: '$0'
    },
    // Edge case: Missing DOB - should handle gracefully
    'ANT888999000': {
        status: 'Active',
        coverageType: 'PPO - Autism Services',
        effectiveDate: '2024-01-01',
        terminationDate: '2025-12-31',
        copay: '$25',
        deductible: '$500',
        deductibleMet: '$150'
    },
    // Edge case: Future DOB
    'KP777888999': {
        status: 'Pending',
        coverageType: 'Not Yet Effective',
        effectiveDate: '2025-02-01',
        terminationDate: '2026-01-31',
        copay: 'N/A',
        deductible: 'N/A',
        deductibleMet: 'N/A'
    },
    // Edge case: Very old DOB
    'MOL666777888': {
        status: 'Active',
        coverageType: 'Medicare Advantage - Full Coverage',
        effectiveDate: '2020-01-01',
        terminationDate: '2025-12-31',
        copay: '$0',
        deductible: '$0',
        deductibleMet: 'N/A'
    },
    // Edge case: Whitespace in member ID (trimmed version)
    'BCBS111222': {
        status: 'Active',
        coverageType: 'PPO - Behavioral Health',
        effectiveDate: '2024-01-01',
        terminationDate: '2025-12-31',
        copay: '$25',
        deductible: '$500',
        deductibleMet: '$200'
    },
    // Edge case: Alternative date format - this member ID exists but date format is wrong
    'AET333444555': {
        status: 'Active',
        coverageType: 'HMO - Mental Health',
        effectiveDate: '2024-01-15',
        terminationDate: '2025-01-14',
        copay: '$30',
        deductible: '$1000',
        deductibleMet: '$300'
    },
    // Edge case: Invalid date (month 13)
    'UHC222333444': {
        status: 'Active',
        coverageType: 'EPO - ABA Therapy',
        effectiveDate: '2024-02-01',
        terminationDate: '2025-01-31',
        copay: '$20',
        deductible: '$750',
        deductibleMet: '$100'
    },
    // Edge case: Invalid date (day 31 in April)
    'CIG888777666': {
        status: 'Active',
        coverageType: 'PPO - Behavioral Health',
        effectiveDate: '2024-04-01',
        terminationDate: '2025-03-31',
        copay: '$25',
        deductible: '$500',
        deductibleMet: '$0'
    }
};

let isLoggedIn = false;

// Simulate network delay
function simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');

    // Clear previous errors
    errorDiv.style.display = 'none';

    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    // Simulate API call delay
    await simulateDelay();

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
        isLoggedIn = true;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('eligibility-form').style.display = 'block';
    } else {
        errorDiv.textContent = 'Invalid username or password. Please try again.';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
});

// Logout handler
document.getElementById('logout-button').addEventListener('click', () => {
    isLoggedIn = false;
    document.getElementById('eligibility-form').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('loginForm').reset();
});

// Eligibility check form handler
document.getElementById('eligibilityForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
        alert('Session expired. Please log in again.');
        return;
    }

    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        memberId: document.getElementById('memberId').value,
        insuranceProvider: document.getElementById('insuranceProvider').value
    };

    const errorDiv = document.getElementById('check-error');
    errorDiv.style.display = 'none';

    // Disable submit button
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Checking...';

    // Simulate API call delay
    await simulateDelay();

    // Trim whitespace from member ID (simulate real-world data cleaning)
    const cleanMemberId = formData.memberId.trim();

    // Validate member ID exists
    const eligibilityData = MOCK_ELIGIBILITY_DATA[cleanMemberId];

    if (!eligibilityData) {
        errorDiv.textContent = 'Member ID not found. Please verify the information and try again.';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Check Eligibility';
        return;
    }

    // Display results
    displayResults(formData, eligibilityData);

    // Reset form and button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Check Eligibility';
});

function displayResults(patientData, eligibilityData) {
    const resultsContent = document.getElementById('results-content');
    const statusClass = eligibilityData.status === 'Active' ? 'status-active' :
                       eligibilityData.status === 'Inactive' ? 'status-inactive' : 'status-unknown';

    resultsContent.innerHTML = `
        <div class="result-item">
            <span class="result-label">Patient Name:</span>
            <span class="result-value">${patientData.firstName} ${patientData.lastName}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Date of Birth:</span>
            <span class="result-value">${patientData.dob}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Member ID:</span>
            <span class="result-value">${patientData.memberId}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Insurance Provider:</span>
            <span class="result-value">${patientData.insuranceProvider}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Eligibility Status:</span>
            <span class="result-value ${statusClass}">${eligibilityData.status}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Coverage Type:</span>
            <span class="result-value">${eligibilityData.coverageType}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Effective Date:</span>
            <span class="result-value">${eligibilityData.effectiveDate}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Termination Date:</span>
            <span class="result-value">${eligibilityData.terminationDate}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Copay:</span>
            <span class="result-value">${eligibilityData.copay}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Deductible:</span>
            <span class="result-value">${eligibilityData.deductible}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Deductible Met:</span>
            <span class="result-value">${eligibilityData.deductibleMet}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Verification Date:</span>
            <span class="result-value">${new Date().toISOString()}</span>
        </div>
    `;

    document.getElementById('eligibility-form').style.display = 'none';
    document.getElementById('results').style.display = 'block';
}

// Check another patient handler
document.getElementById('check-another').addEventListener('click', () => {
    document.getElementById('results').style.display = 'none';
    document.getElementById('eligibility-form').style.display = 'block';
    document.getElementById('eligibilityForm').reset();
});
