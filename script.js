const notes = ["C", "D", "E", "F", "G", "A", "B"];

/*
Индексы:
0 — нижняя добавочная
1 — между
2 — линия
и т.д.
Мы жёстко привязываем к сетке, а не к пикселям
*/
/*
Каждый шаг = линия или промежуток
0 — нижняя добавочная (C)
1 — промежуток
2 — 1 линия (E)
3 — промежуток
4 — 2 линия (G)
5 — промежуток
6 — 3 линия (B)
7 — промежуток
8 — 4 линия (D)
9 — промежуток
10 — 5 линия (F)
11 — промежуток
12 — верхняя добавочная (A)
*/

const staffSteps = {
    C: 0,
    D: 1,
    E: 2,
    F: 3,
    G: 4,
    A: 5,
    B: 6
};

let currentNote = null;
let ok = 0;
let fail = 0;

const noteEl = document.getElementById("note");

function setNote(note) {
    const staffCenter = 70; // центр стана
    const step = 7;        // расстояние между линией и промежутком

    // линия E (1-я снизу) = шаг 2
    const eLineStep = 6;

    const offset = (staffSteps[note] - eLineStep) * step;
    noteEl.style.top = (staffCenter - offset) + "px";
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
