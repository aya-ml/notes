let correct = 0;
let errors = 0;

// Пока для примера фиксированная нота
const currentNote = "D";

document.querySelectorAll(".keyboard button").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.dataset.note === currentNote) {
            correct++;
            document.getElementById("correct").textContent = correct;
            nextNote();
        } else {
            errors++;
            document.getElementById("errors").textContent = errors;
        }
    });
});

function nextNote() {
    // Заглушка — позже добавим рандом нот и позиций
    console.log("Следующая нота");
}
