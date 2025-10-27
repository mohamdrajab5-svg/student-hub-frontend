document.addEventListener('DOMContentLoaded', () => {
    
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        try {
            // 1. Send data to the 'contact' endpoint
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS!
                alert(data.message); // Show "Message received!"
                contactForm.reset(); // Clear the form
            } else {
                // ERROR
                alert('Error: ' + data.message);
            }

        } catch (error) {
            console.error('Contact form failed:', error);
            alert('Submit failed. Is the server running?');
        }
    });
});
