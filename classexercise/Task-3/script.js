// ===============================
// REGISTER FUNCTION
// ===============================
function register() {
    const username = document.getElementById("regUser").value;
    const password = document.getElementById("regPass").value;

    if (username === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.username === username);

    if (exists) {
        alert("Username already exists");
        return;
    }

    users.push({ username: username, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful");
}


// ===============================
// LOGIN FUNCTION
// ===============================
function login() {
    const username = document.getElementById("loginUser").value;
    const password = document.getElementById("loginPass").value;

    let users = JSON.parse(localStorage.getItem("users")) || []; // Get registered users and || [] is used to handle the case when there are no users yet, it will return an empty array instead of null.

    const validUser = users.find(user =>
        user.username === username && user.password === password
    );

    if (validUser) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "profile.html";
    } else {
        alert("Invalid username or password");
    }
}


// ===============================
// CHECK AUTH (PAGE PROTECTION)
// ===============================
function checkAuth() {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index.html";
    }
}


// ===============================
// LOGOUT FUNCTION
// ===============================
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
}


// ===============================
// MONTHLY ACTIVITIES DATA
// ===============================
const activities = [
    { id: 1, activity: "Create tables from 12 to 19", subject: "Maths" },
    { id: 2, activity: "Solve algebra worksheet", subject: "Maths" },
    { id: 3, activity: "Prepare Science project file", subject: "Science" },
    { id: 4, activity: "Learn human digestive system", subject: "Science" },
    { id: 5, activity: "Write essay on Environment", subject: "English" },
    { id: 6, activity: "Read Chapter 3 and summarize", subject: "English" }
];


// ===============================
// SHOW ACTIVITIES FUNCTION
// ===============================
function showActivities() {
    const selected = document.getElementById("subjectSelect").value;
    const tableBody = document.querySelector("#activityTable tbody");

    tableBody.innerHTML = "";

    if (selected === "") return;

    const filtered = activities.filter(a => a.subject === selected);

    filtered.forEach(a => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = a.id;

        const activityCell = document.createElement("td");
        activityCell.textContent = a.activity;

        row.appendChild(idCell);
        row.appendChild(activityCell);

        tableBody.appendChild(row);
    });
}
