//שליפת השם לכותרת
const currentuser = JSON.parse(localStorage.getItem("currentUser"));
currentName = currentuser.name
document.getElementById("nav-name").textContent=`Hi, ${currentName} 🖐︎`;

// האזנה ללחיצה על כפתור log out
  document.querySelector("#logOut").addEventListener("click", function () {
    localStorage.removeItem("currentUser");

    const gameHistoryDiv = document.getElementById('gameHistory');
    localStorage.removeItem("gameHistoryDiv");
    console.log("hi");
    window.location.href = "../main.html";
  });
  