document.addEventListener('DOMContentLoaded', fetchPosts);
document.addEventListener('click', handleClickOutside);

let posts = [];
let uniqueUserIds = [];
let selectedUserIds = [];
let filterMode = '';

function fetchPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            posts = data;
            uniqueUserIds = [...new Set(posts.map(post => post.userId))].sort((a, b) => a - b);
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
    filterMode = 'sort'
    const filteredPosts = selectedUserIds.length ? posts.filter(post => selectedUserIds.includes(post.userId)) : posts;
    filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
    displayPosts(filteredPosts);
}

function groupPosts() {
    filterMode = 'group'
    const filteredPosts = selectedUserIds.length ? posts.filter(post => selectedUserIds.includes(post.userId)) : posts;
    const groupedPosts = filteredPosts.reduce((acc, post) => {
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

function showUserIdSuggestions() {
    // Clear input field to allow for new search
    document.getElementById('userIdInput').value = '';
    filterUserIdSuggestions()
}

function searchUserIdSuggestion() {
    const input = document.getElementById('userIdInput').value;
    filterUserIdSuggestions(input);
}

function filterUserIdSuggestions(input = '') {
    const suggestionsContainer = document.getElementById('userIdSuggestions');
    suggestionsContainer.innerHTML = '';

    const filteredUserIds = uniqueUserIds.filter(userId => userId.toString().startsWith(input));
    filteredUserIds.forEach(userId => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.textContent = userId;
        suggestionDiv.onclick = () => {
            toggleUserId(userId, suggestionDiv);
            filterPosts();
        };

        // Highlight selected user IDs
        if (selectedUserIds.includes(userId)) {
            suggestionDiv.classList.add('selected');
        }

        suggestionsContainer.appendChild(suggestionDiv);
    });

    if (filteredUserIds.length === 0) {
        suggestionsContainer.style.display = 'none';
    } else {
        suggestionsContainer.style.display = 'block';
    }
}

function toggleUserId(userId, div) {
    if (selectedUserIds.includes(userId)) {
        selectedUserIds = selectedUserIds.filter(id => id !== userId);
        div.classList.remove('selected');
    } else {
        selectedUserIds.push(userId);
        div.classList.add('selected');
    }
    selectedUserIds.sort()
}

function filterPosts() {
    switch (filterMode) {
        case 'sort':
            sortPosts();
            break;
        case 'group':
            groupPosts();
            break;
        default:
            const filteredPosts = selectedUserIds.length ? posts.filter(post => selectedUserIds.includes(post.userId)) : posts;
            displayPosts(filteredPosts);
            break;
    }
}

function handleClickOutside(event) {
    const inputField = document.getElementById('userIdInput');
    const suggestionsContainer = document.getElementById('userIdSuggestions');

    if (!inputField.contains(event.target) && !suggestionsContainer.contains(event.target)) {
        // Hide suggestions
        suggestionsContainer.style.display = 'none';

        // Show selected user IDs in input field
        document.getElementById('userIdInput').value = selectedUserIds.join(', ');
    }
}