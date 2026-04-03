const http = require('http');

async function checkUrl(url, name) {
    try {
        const response = await fetch(url);
        console.log(`[PASS] ${name} is reachable (${url}). Status: ${response.status}`);
        return true;
    } catch (error) {
        console.log(`[FAIL] ${name} is NOT reachable (${url}). Error: ${error.message}`);
        return false;
    }
}

async function tryStudentLogin(email, password, name) {
    try {
        const backendUrl = 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/auth/student/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            console.log(`[PASS] Student Login (${name} - ${email}) successful`);

            // Fetch Inbox
            try {
                const token = data.token;
                const inboxRes = await fetch(`${backendUrl}/api/students/inbox`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const inboxData = await inboxRes.json();

                if (inboxRes.ok) {
                    console.log(`[PASS] Inbox fetch successful for ${name}. Eligible Companies: ${inboxData.eligibleCompanies ? inboxData.eligibleCompanies.length : 0}`);
                } else {
                    console.log(`[FAIL] Inbox fetch failed for ${name}: ${inboxData.message}`);
                }
            } catch (e) {
                console.log(`[FAIL] Inbox fetch error for ${name}: ${e.message}`);
            }

            return true;
        } else {
            console.log(`[FAIL] Student Login (${name} - ${email}) failed: ${data.message}`);
            return false;
        }
    } catch (e) {
        console.log(`[FAIL] Student Login (${name} - ${email}) error: ${e.message}`);
        return false;
    }
}

async function verifyBackend() {
    console.log('\n--- Verifying Backend ---');
    const backendUrl = 'http://localhost:5000';
    await checkUrl(backendUrl, 'Backend Root');

    // Test Admin Login
    try {
        const response = await fetch(`${backendUrl}/api/auth/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('[PASS] Admin Login successful');
            const token = data.token;

            // Test Admin Dashboard
            try {
                const dashboardRes = await fetch(`${backendUrl}/api/admin/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const dashboardData = await dashboardRes.json();

                if (dashboardRes.ok) {
                    console.log('[PASS] Admin Dashboard fetch successful');
                    console.log('      Stats:', JSON.stringify(dashboardData, null, 2));
                } else {
                    console.log('[FAIL] Admin Dashboard fetch failed:', dashboardData.message);
                }
            } catch (e) {
                console.log('[FAIL] Admin Dashboard fetch error:', e.message);
            }

        } else {
            console.log('[FAIL] Admin Login failed:', data.message);
        }

    } catch (error) {
        console.log('[FAIL] Admin Login error:', error.message);
    }
}

async function verifyFrontend() {
    console.log('\n--- Verifying Frontend ---');
    // Frontend is supposed to be on 3002
    await checkUrl('http://localhost:3002', 'Frontend');
}

// Final verification
async function main() {
    await verifyBackend();

    console.log('\n--- Verifying Student Login with User Credentials ---');
    // Test with the specific credentials user provided
    await tryStudentLogin('220701120@rajalakshmi.edu.in', 'Nikhil@2005', 'Nikhil (User Provided)');

    await verifyFrontend();
}

main();
