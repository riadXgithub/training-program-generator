// --------------------- PROGRAM GENERATOR ---------------------
document.getElementById("programForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const level = document.getElementById("level").value;
    const days = parseInt(document.getElementById("days").value);
    const goal = document.getElementById("goal").value;

    let split = [];
    let intensity;

    if (level === "Beginner") intensity = "3×10–12";
    if (level === "Intermediate") intensity = "4×8–10";
    if (level === "Advanced") intensity = "5×5–8";

    if (days === 3) {
        split = ["Full Body A", "Full Body B", "Full Body C"];
    } else if (days === 4) {
        split = ["Upper Body", "Lower Body", "Upper Body", "Lower Body"];
    } else {
        split = ["Push", "Pull", "Legs", "Push", "Pull"];
    }

    const workouts = {
        "Upper Body": [
            `Bench Press – ${intensity}`,
            `Pull-Ups – ${intensity}`,
            `Overhead Press – ${intensity}`,
            `Barbell Row – ${intensity}`,
            `Lateral Raises – 3×12–15`
        ],
        "Lower Body": [
            `Squat – ${intensity}`,
            `Romanian Deadlift – ${intensity}`,
            `Leg Press – 3×10–12`,
            `Leg Curl – 3×12`,
            `Calf Raises – 4×15`
        ],
        "Push": [
            `Bench Press – ${intensity}`,
            `Incline Dumbbell Press – ${intensity}`,
            `Overhead Press – ${intensity}`,
            `Triceps Pushdown – 3×12`
        ],
        "Pull": [
            `Deadlift – ${intensity}`,
            `Pull-Ups – ${intensity}`,
            `Barbell Row – ${intensity}`,
            `Biceps Curl – 3×12`
        ],
        "Legs": [
            `Squat – ${intensity}`,
            `Leg Press – ${intensity}`,
            `Romanian Deadlift – ${intensity}`,
            `Hamstring Curl – 3×12`,
            `Calf Raises – 4×15`
        ]
    };

    let output = `
    <h2>Riad’s Training System</h2>
    <p><strong>Athlete:</strong> ${name}</p>
    <p><strong>Level:</strong> ${level}</p>
    <p><strong>Goal:</strong> ${goal}</p>
    <hr>
  `;

    split.forEach((day, index) => {
        output += `<h3>Day ${index + 1} – ${day}</h3><ul>`;
        workouts[day]?.forEach(ex => {
            output += `<li>${ex}</li>`;
        });
        output += `</ul>`;
    });

    output += `
    <h3>Instructions</h3>
    <ul>
      <li>Progressive overload every week</li>
      <li>1–2 reps in reserve (RIR)</li>
      <li>Rest 60–120 seconds</li>
      <li>Sleep 7–9 hours</li>
    </ul>
  `;

    const result = document.getElementById("result");
    result.style.display = "block";
    result.innerHTML = output;

    // Save program to localStorage
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        let users = JSON.parse(localStorage.getItem("users") || "{}");
        users[loggedInUser].program = output;
        sessionStorage.setItem("loggedInUser", user);
    }
});

// --------------------- LOGIN / SIGNUP ---------------------

// Switch between login/signup
document.getElementById("goToSignup").addEventListener("click", () => {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "block";
});
document.getElementById("goToLogin").addEventListener("click", () => {
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
});

// Sign up
document.getElementById("signupBtn").addEventListener("click", () => {
    const user = document.getElementById("signupUsername").value;
    const pass = document.getElementById("signupPassword").value;
    if (!user || !pass) return alert("Please fill all fields");

    let users = JSON.parse(localStorage.getItem("users") || "{}");
    if (users[user]) return alert("Username already exists");

    users[user] = { password: pass, program: null };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created! You can now login.");
    document.getElementById("goToLogin").click();
});

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
    const user = document.getElementById("loginUsername").value;
    const pass = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!users[user] || users[user].password !== pass) return alert("Invalid credentials");

    localStorage.setItem("loggedInUser", user);
    alert("Logged in successfully!");
    initProgramPage(users[user].program);
});

// Auto-login on page load
window.addEventListener("load", () => {
    const user = sessionStorage.getItem("loggedInUser"); // <-- change here
    if (user) {
        const users = JSON.parse(localStorage.getItem("users") || "{}");
        initProgramPage(users[user].program);
    } else {
        document.body.classList.add('login-page');
    }
});

function initProgramPage(savedProgram) {
    document.body.classList.remove('login-page');
    document.body.classList.add('program-page');

    document.getElementById("authContainer").style.display = "none";
    document.getElementById("programContainer").style.display = "block";

    if (savedProgram) {
        const result = document.getElementById("result");
        result.style.display = "block";
        result.innerHTML = savedProgram;
    }
}

// --------------------- DOWNLOAD PROGRAM ---------------------
document.getElementById("downloadProgramBtn").addEventListener("click", () => {
    const programEl = document.getElementById("result");
    html2canvas(programEl).then(canvas => {
        const link = document.createElement("a");
        link.download = "my_program.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});
