// Initialize Supabase client with keys from environment variables
// In production, these will be provided by Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || window.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || window.env.SUPABASE_ANON_KEY;

// Create Supabase client
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Function to display messages to user
function showMessage(message, type = 'success') {
    const messageArea = document.getElementById('message-area');
    messageArea.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;
    messageArea.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 5000);
}

// Save data to Supabase
async function saveData() {
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    
    if (!name || !message) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([{ name, message }])
            .select();
            
        if (error) {
            throw error;
        }
        
        showMessage('Data saved successfully!');
        document.getElementById('name').value = '';
        document.getElementById('message').value = '';
        
        // Refresh the data display
        loadData();
    } catch (error) {
        console.error('Error saving data:', error);
        showMessage('Error saving data: ' + error.message, 'error');
    }
}

// Load data from Supabase
async function loadData() {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            throw error;
        }
        
        const container = document.getElementById('data-container');
        
        if (data.length === 0) {
            container.innerHTML = '<p>No data found.</p>';
            return;
        }
        
        container.innerHTML = data.map(item => `
            <div class="data-item">
                <strong>${item.name}</strong>
                <p>${item.message}</p>
                <small>${new Date(item.created_at).toLocaleString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading data:', error);
        showMessage('Error loading data: ' + error.message, 'error');
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});
