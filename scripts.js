document.addEventListener('DOMContentLoaded', fetchPosts);

let posts = [];

function fetchPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            posts = data;
            displayPosts(posts);
        });
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `<h2>${post.title}</h2><p>${post.body}</p><p>User ID: ${post.userId}</p>`;
        postsContainer.appendChild(postDiv);
    });
}

function sortPosts() {
    posts.sort((a, b) => a.title.localeCompare(b.title));
    displayPosts(posts);
}

function groupPosts() {
    const groupedPosts = posts.reduce((acc, post) => {
        if (!acc[post.userId]) acc[post.userId] = [];
        acc[post.userId].push(post);
        return acc;
    }, {});

    const groupedPostsArray = [];
    for (const userId in groupedPosts) {
        groupedPostsArray.push(...groupedPosts[userId]);
    }

    displayPosts(groupedPostsArray);
}
