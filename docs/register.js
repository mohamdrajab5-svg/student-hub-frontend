document.addEventListener('DOMContentLoaded', () => {
    
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Get all three values
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            // 2. Send data to the 'register' endpoint
            const response = await fetch('https://student-hub-backend-dij3.onrender.com/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // 3. Send all three fields in the body
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS!
                alert('Registration successful! You can now log in.');
                
                // 4. Save their new token (they are auto-logged in)
                localStorage.setItem('userToken', data.token);

                // 5. Send them to the main page
                window.location.href = 'index.html'; 
            } else {
                // ERROR
                alert('Error: ' + data.message);
            }

        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed. Is the server running?');
        }
    });
});
