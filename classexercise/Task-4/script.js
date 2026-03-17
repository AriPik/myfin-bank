const App = (function () {

    const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
    const TODOS_URL = "https://jsonplaceholder.typicode.com/todos";

    const postsContainer = document.getElementById("posts");
    const todosContainer = document.getElementById("todos");

    const postsLoader = document.getElementById("postsLoader");
    const todosLoader = document.getElementById("todosLoader");

    const postsError = document.getElementById("postsError");
    const todosError = document.getElementById("todosError");

    const postCount = document.getElementById("postCount");
    const todoStats = document.getElementById("todoStats");

    async function fetchData(url, loader, errorBox) {
        try {
            loader.classList.remove("hidden");
            errorBox.textContent = "";

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Server returned status " + response.status);
            }

            return await response.json();

        } catch (error) {
            errorBox.textContent = error.message;
            return [];
        } finally {
            loader.classList.add("hidden");
        }
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = "";
        const limitedPosts = posts.slice(0, 5);

        limitedPosts.forEach(post => {
            const div = document.createElement("div");
            div.classList.add("post");
            div.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
            `;
            postsContainer.appendChild(div);
        });

        postCount.textContent = `${limitedPosts.length} Posts`;
    }

    function displayTodos(todos) {
        todosContainer.innerHTML = "";
        const limitedTodos = todos.slice(0, 10);
        const completed = limitedTodos.filter(todo => todo.completed).length;

        limitedTodos.forEach(todo => {
            const div = document.createElement("div");
            div.classList.add("todo");
            div.innerHTML = `
                <label>
                    <input type="checkbox" ${todo.completed ? "checked" : ""}>
                    ${todo.title}
                </label>
            `;
            todosContainer.appendChild(div);
        });

        todoStats.textContent = `${completed}/${limitedTodos.length} Completed`;
    }

    async function init() {
        const posts = await fetchData(POSTS_URL, postsLoader, postsError);
        displayPosts(posts);

        const todos = await fetchData(TODOS_URL, todosLoader, todosError);
        displayTodos(todos);
    }

    return {
        init
    };

})();

document.addEventListener("DOMContentLoaded", App.init);
