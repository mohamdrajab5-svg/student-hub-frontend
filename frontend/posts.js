// This runs as soon as the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadPosts(); // Call the function to fetch posts
});

async function loadPosts() {
    const postsContainer = document.getElementById('posts-container');

    try {
        // 1. Fetch data from the 'posts' endpoint (default is GET)
        const response = await fetch('https://student-hub-backend-dij3.onrender.com/api/posts');
        const posts = await response.json(); // Get the array of posts

        // 2. Clear the "Loading..." message
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts found. Be the first to create one!</p>';
            return;
        }

        // 3. Loop through each post and create HTML for it
        posts.forEach(post => {
            const postElement = document.createElement('section'); // Use <section> like your other pages
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <small>Category: ${post.category || 'General'}</small><br>
                <small>Author: ${post.user.name}</small>
            `;
            // 4. Add the new HTML to the page
            postsContainer.appendChild(postElement);
        });

    } catch (error) {
        console.error('Failed to load posts:', error);
        postsContainer.innerHTML = '<p>Error loading posts. Is the server running?</p>';
    }
}
