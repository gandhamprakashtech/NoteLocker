document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".viewNoteBtn").forEach((button) => {
    button.addEventListener("click", function () {
      let enteredKey = prompt("Enter the access key to view the note:");

      if (enteredKey === "123") {
        let noteTitle = this.getAttribute("data-title");
        let noteContent = this.getAttribute("data-content");

        document.getElementById("modalTitle").innerText = noteTitle;
        document.getElementById("modalBody").innerText = noteContent;
        document.getElementById("noteModal").style.display = "block";
      } else {
        alert("Incorrect key! Access denied.");
      }
    });
  });

  // Close Modal
  document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("noteModal").style.display = "none";
  });
});

let addBtn = document.getElementById("addBtn");
addBtn.addEventListener("click", function () {
  let addTxt = document.getElementById("addTxt");
  let addTitle = document.getElementById("addTitle");
  let addPassword = document.getElementById("addPassword"); // Get password input
  let notes = localStorage.getItem("notes");

  let notesObj = notes ? JSON.parse(notes) : [];

  let day = new Date();
  let dic = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "July",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };
  let date = day.getDate();
  let mon = day.getMonth();
  let year = day.getFullYear();
  let time = date + dic[mon] + " " + year;

  let myobj = {
    title: addTitle.value.trim() || "Untitled",
    text: addTxt.value.trim() || "Empty Note",
    password: addPassword.value.trim(), // Store the password
    today: time,
  };

  notesObj.push(myobj);
  localStorage.setItem("notes", JSON.stringify(notesObj));

  addTxt.value = "";
  addTitle.value = "";
  addPassword.value = "";

  showNotes();
});

function showNotes() {
  let notes = localStorage.getItem("notes");
  let notesObj = notes ? JSON.parse(notes) : [];

  let html = "";
  notesObj.forEach((element, index) => {
    html += `
      <div class="noteCard my-2 mx-2 card shadow-lg p-3 mb-5 rounded bg-dark text-white" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${element.title}</h5>
          <button class="btn btn-info viewNoteBtn" data-title="${element.title}" data-content="${element.text}" data-password="${element.password}">View Note</button>
          <button id="${index}" onclick="deleteNote(${index})" class="btn btn-danger my-3">Delete Note</button>
          <small style="text-align:right; display:block;">${element.today}</small>
        </div>
      </div>
    `;
  });

  let notesElm = document.getElementById("notes");
  notesElm.innerHTML = notesObj.length
    ? html
    : `Nothing to show! Use "Add Note" Section to create notes.`;

  attachEventListeners(); // Re-attach event listeners after updating the UI
}

// Attach event listeners after rendering notes
function attachEventListeners() {
  document.querySelectorAll(".viewNoteBtn").forEach((button) => {
    button.addEventListener("click", function () {
      let savedPassword = this.getAttribute("data-password");
      let enteredKey = prompt("Enter the password to view the note:");

      if (enteredKey === savedPassword) {
        let noteTitle = this.getAttribute("data-title");
        let noteContent = this.getAttribute("data-content");

        document.getElementById("modalTitle").innerText = noteTitle;
        document.getElementById("modalNote").innerText = noteContent;

        // Properly show Bootstrap modal
        $("#noteModal").modal("show");
      } else {
        alert("Incorrect password! Access denied.");
      }
    });
  });

  // Close Modal using Bootstrap method
  document.querySelectorAll('[data-dismiss="modal"]').forEach((button) => {
    button.addEventListener("click", function () {
      $("#noteModal").modal("hide");
    });
  });
}

function deleteNote(index) {
  if (confirm("Are you sure you want to delete?")) {
    let notes = localStorage.getItem("notes");
    let notesObj = notes ? JSON.parse(notes) : [];
    notesObj.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notesObj));
    showNotes();
  }
}

// Search Functionality
function searchNotes() {
  let input = document.getElementById("searchTxt").value.toLowerCase();
  let noteCards = document.getElementsByClassName("noteCard");

  Array.from(noteCards).forEach((card) => {
    let cardTitle = card
      .getElementsByClassName("card-title")[0]
      .innerText.toLowerCase();
    let cardContent = card
      .getElementsByClassName("viewNoteBtn")[0]
      .getAttribute("data-content")
      .toLowerCase();

    if (cardTitle.includes(input) || cardContent.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Attach search function to input field
document.getElementById("searchTxt").addEventListener("input", searchNotes);

// Load notes on startup
showNotes();
