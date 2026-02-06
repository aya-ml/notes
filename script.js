const notes = ["C", "D", "E", "F", "G", "A", "B"];
const notePositions = {
    C: 88,
    D: 82,
    E: 76,
    F: 70,
    G: 64,
    A: 58,
    B: 52
};

let currentNote = null;
let correct = 0;
let errors = 0;

const noteImg = document.getElementById("note");

function nextNote() {
    currentNote = notes[Math.floor(Math.random() * notes.length)];
    noteImg.style.top = notePositions[currentNote] + "px";
}

document.querySelectorAll(".white, .black").forEach(key => {
    key.addEventListener("click", () => {
        key.classList.remove("correct-key", "wrong-key");

        if (key.dataset.note === currentNote) {
            correct++;
            key.classList.add("correct-key");
            document.getElementById("correct").textContent = correct;

            setTimeout(() => {
                key.classList.remove("correct-key");
                nextNote();
            }, 400);
        } else {
            errors++;
            key.classList.add("wrong-key");
            document.getElementById("errors").textContent = errors;

            setTimeout(() => {
                key.classList.remove("wrong-key");
            }, 300);
        }
    });
});

nextNote();
