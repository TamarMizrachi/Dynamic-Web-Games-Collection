const signUp = document.querySelector("#sign_up");
const logIn = document.querySelector("#log_in");
const logInButton = document.querySelector('#logInButton');
const signUpButton = document.querySelector('#signUpButton');
const signUpForm = document.querySelector("#sign_up_form"); // טופס הרשמה


document.addEventListener("DOMContentLoaded", function () {

    // וידוא ש-Sign Up מוסתר בזמן טעינת העמוד
    signUp.classList.add('hide');
    logIn.classList.remove('hide');

    // הצגת אפשרות ההתחברות והסתרת ההרשמה
    function showLogin() {
        if (logIn.classList.contains('hide')) {
            logIn.classList.remove('hide');
            signUp.classList.add('hide');
            signUpButton.disabled = false;
            logInButton.disabled = true;
        }
    }

    // הצגת אפשרות ההרשמה והסתרת ההתחברות
    function showSignUp() {
        if (signUp.classList.contains('hide')) {
            signUp.classList.remove('hide');
            logIn.classList.add('hide');
            logInButton.disabled = false;
            signUpButton.disabled = true;
        }
    }

    // חיבור כפתורים
    logInButton.addEventListener('click', showLogin);
    signUpButton.addEventListener('click', showSignUp);
});

signUpForm.addEventListener('submit', function (event) {
    event.preventDefault(); // למנוע רענון של הדף

    // שליפת נתונים מהשדות
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const password = document.querySelector("#password").value;

    // אימות נתונים
    const formattedName = formatName(name);
    if (!formattedName) {
        alert("Invalid username. Please enter your name in English.");
        return;
    }
    if (!validateEmail(email)) {
        alert("Invalid email. Please try again.");
        return;
    }
    if (!validateIsraeliPhone(phone)) {
        alert("Invalid phone number. Please try again.");
        return;
    }
    if (!validatePassword(password)) {
        alert("The password must include at least 8 characters, English letters, numbers, and a special character!");
        return;
    }

    // שמירת המשתמש ב-localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(user => user.email === email)) {
        alert("This email is already registered.");
        return;
    }

    const newUser = { name: formattedName, email, phone, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // // עדכון ה-nav
    // document.getElementById("nav_name").textContent = `Hi, ${formattedName} 🖐︎`;

    // מעבר לדף הבא
    window.location.href = "../html/games.html";
});


// פונקציה לעיצוב שם באנגלית (אות ראשונה גדולה, שאר אותיות קטנות)
function formatName(name) {
    if (!/^[a-zA-Z]+$/.test(name)) return null; // בדיקה שהשם באנגלית
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// פונקציה לאימות מייל
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// פונקציה לאימות מספר טלפון ישראלי
function validateIsraeliPhone(phone) {
    const phoneRegex = /^05\d{8}$/; // מספר טלפון שמתחיל ב-05 ואחריו 8 ספרות
    return phoneRegex.test(phone);
}

// פונקציה לאימות ובדיקת הסיסמה
function validatePassword(password) {
    const hasLetter = /[a-zA-Z]/.test(password); // לפחות אות אחת
    const hasNumber = /\d/.test(password);       // לפחות מספר אחד
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // לפחות תו מיוחד
    const isValidLength = password.length >= 8; // מינימום 8 תווים

    if (!hasLetter || !hasNumber || !hasSpecialChar || !isValidLength) {
        return false;
    }
    return true;
}

// הצגת אפשרות ההתחברות והסתרת ההרשמה
logInButton.addEventListener('click', showLogin);

function showLogin() {
    if (logIn.className === 'hide') {
        logIn.classList.remove('hide');
        signUp.classList.add('hide');
        signUpButton.disabled = false;
        logInButton.disabled = true;
    }
}

// האזנה לטופס התחברות
const logInForm = document.querySelector("#log_in_form");
logInForm.addEventListener('submit', function (event) {
    event.preventDefault(); // למנוע רענון של העמוד

    // שליפת נתונים מהשדות
    const email = document.querySelector("#login_email").value;
    const password = document.querySelector("#login_password").value;

    // אימות פרטי ההתחברות
    if (validateLogin(email, password)) {
        alert("You have successfully logged in!");
        saveUserToLocalStorage(email);
        const currentuser = JSON.parse(localStorage.getItem("currentUser"));
        currentName = currentuser.name;
        window.location.href = "../html/games.html";
        
        // document.getElementById("nav_name").textContent=`Hi, ${currentName} 🖐︎`;
        logInForm.reset(); // איפוס הטופס
    } else {
        alert("Incorrect email or password. Please try again.");
    }
});

// פונקציה לכניסת משתמש ב-localStorage
function saveUserToLocalStorage(email) {
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentuser = users.find(ele => ele.email ===email);
    localStorage.setItem('currentUser',JSON.stringify(currentuser));
    currentName = currentuser.name;
    window.location.href = "../html/games.html";
    // document.getElementById("nav_name").textContent=`Hi, ${currentName} 🖐︎`;
}


// פונקציה לאימות פרטי ההתחברות מול localStorage
function validateLogin(email, password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    // בדיקה אם יש התאמה בין האימייל לשם המשתמש
    return users.find(user => user.email === email && user.password === password);
}