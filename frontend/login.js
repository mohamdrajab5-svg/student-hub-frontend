// This line waits for the entire HTML page to load first
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Find the form on the page using the ID we gave it
    const loginForm = document.getElementById('login-form');

    // 2. "Listen" for when the user clicks the "Submit" button
    loginForm.addEventListener('submit', async (event) => {
        
        // This stops the page from reloading (which is the default behavior)
        event.preventDefault();

        // 3. Get the text the user typed into the input boxes
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // This is the "magic" part: sending the data to your backend
        try {
            // 4. Send the data to your backend server's /api/auth/login "door"
            // (Make sure your backend server is running!)
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST', // We are SENDING data, so we use POST
                headers: {
                    'Content-Type': 'application/json',
                },
                // 5. Convert our JavaScript data into a JSON string
                body: JSON.stringify({
                    email: email,       // The backend expects "email"
                    password: password  // The backend expects "password"
                }),
            });

            // 6. Get the JSON response back from the server
            const data = await response.json();

            // 7. Check if the login was successful
            if (response.ok) {
                // SUCCESS! The server sent us back a token.
                alert('Login successful! Welcome, ' + data.name);
                
                // 8. Save the login token in the browser's storage
                localStorage.setItem('userToken', data.token);

                // 9. Redirect the user to the main page
                // (Update this to your index.html page's location)
                window.location.href = 'index.html'; 
            } else {
                // ERROR! The server sent an error message (e.g., "Invalid password")
                alert('Error: ' + data.message);
            }

        } catch (error) {
            // This catches network errors (e.g., if your backend server isn't running)
            console.error('Login failed:', error);
            alert('Login failed. Is the server running?');
        }
    });
});
