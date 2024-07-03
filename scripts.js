document.addEventListener('DOMContentLoaded', fetchPosts);

let posts = [];
let isAscending = true;
let lastButtonClicked = null;

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
    if (isAscending) {
        posts.sort((a, b) => a.title.localeCompare(b.title));
        document.getElementById('sortIcon').textContent = '↑';
    } else {
        posts.sort((a, b) => b.title.localeCompare(a.title));
        document.getElementById('sortIcon').textContent = '↓';
    }
    isAscending = !isAscending;
    displayPosts(posts);
    setActiveButton('sortButton');
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
    setActiveButton('groupButton');
}

function setActiveButton(buttonId) {
    if (lastButtonClicked) {
        document.getElementById(lastButtonClicked).classList.remove('active');
    }
    document.getElementById(buttonId).classList.add('active');
    lastButtonClicked = buttonId;
}
