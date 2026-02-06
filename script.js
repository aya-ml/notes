const notes = ["C", "D", "E", "F", "G", "A", "B"];

/*
Индексы:
0 — нижняя добавочная
1 — между
2 — линия
и т.д.
Мы жёстко привязываем к сетке, а не к пикселям
*/
const staffMap = {
    C: 6, // до
    D: 5,
    E: 4,
    F: 3,
    G: 2,
    A: 1,
    B: 0
};

let currentNote = null;
let ok = 0;
let fail = 0;

const noteEl = document.getElementById("note");

function setNote(note) {
    const base = 50;     // центр стана
    const step = 14;     // расстояние между линиями
    noteEl.style.top = (base + staffMap[note] * step) + "px";
}

function nextNote() {
    currentNote = notes[Math.floor(Math.random() * notes.length)];
    setNote(currentNote);
}

document.querySelectorAll(".white, .black").forEach(key => {
    key.addEventListener("click", () => {
        key.classList.remove("correct", "wrong");

        if (key.dataset.note === currentNote) {
            ok++;
            document.getElementById("ok").textContent = ok;
            key.classList.add("correct");

            setTimeout(() => {
                key.classList.remove("correct");
                nextNote();
            }, 400);
        } else {
            fail++;
            document.getElementById("fail").textContent = fail;
            key.classList.add("wrong");

            setTimeout(() => {
                key.classList.remove("wrong");
            }, 300);
        }
    });
});

nextNote();
