const BOARD = document.getElementsByClassName('board')[0];
let LEFT_CLICKED = false;
let RIGHT_CLICKED = false;
const LIFE_CELL_CLS = 'life_cell';
const DEAD_CELL_CLS = 'dead_cell';
const ROWS = 40;
const COLS = 80;
const TIME = 500;
let interval;


const mouseMove = (event) => {
    const draggedElement = document.getElementById(event.target['id']);
    if (LEFT_CLICKED) {
        if (draggedElement.classList.contains(DEAD_CELL_CLS)) {
            draggedElement.classList.remove(DEAD_CELL_CLS);
            draggedElement.classList.add(LIFE_CELL_CLS);
        }
    }
    else if (RIGHT_CLICKED) {
        if (draggedElement.classList.contains(LIFE_CELL_CLS)) {
            draggedElement.classList.remove(LIFE_CELL_CLS);
            draggedElement.classList.add(DEAD_CELL_CLS);
        }
    }
}

const createBoard = () => {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const field = document.createElement('div');
            field.classList.add(DEAD_CELL_CLS);
            field.id = `${r}-${c}`;
            field.addEventListener('mousemove', mouseMove);
            BOARD.appendChild(field);
        }
    }
}

/////////////////////////////////////////
////////// Ewolution Logic //////////////
/////////////////////////////////////////
const getNeighbors = (row, col) => {
    const neighbors = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r == row && c === col)
                continue;
            const currNeighbor = document.getElementById(`${r}-${c}`);
            if (currNeighbor)
                neighbors.push(currNeighbor);
        }
    }

    return neighbors;
}

const checkIfSurvival = (row, col) => {
    const neighbors = getNeighbors(row, col);
    return neighbors.filter(n => n.classList.contains(LIFE_CELL_CLS)).length === 2
        || neighbors.filter(n => n.classList.contains(LIFE_CELL_CLS)).length === 3;
}

const checkDeadByUnderpopulation = (row, col) => {
    const neighbors = getNeighbors(row, col);
    return neighbors.filter(n => n.classList.contains(LIFE_CELL_CLS)).length < 2;
}

const checkDeadByOverPopulation = (row, col) => {
    const neighbors = getNeighbors(row, col);
    return neighbors.filter(n => n.classList.contains(LIFE_CELL_CLS)).length > 3;
}

const checkIfBirth = (row, col) => {
    const neighbors = getNeighbors(row, col);
    return neighbors.filter(n => n.classList.contains(LIFE_CELL_CLS)).length === 3;
}
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

const gameRun = () => {
    console.log('test');
    const lifeCellIds = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const currField = document.getElementById(`${r}-${c}`);
            if (currField.classList.contains(LIFE_CELL_CLS)) {
                if (checkIfSurvival(r, c)) {
                    lifeCellIds.push(`${r}-${c}`);
                    continue;
                }
                if (!checkDeadByUnderpopulation(r, c) && !checkDeadByOverPopulation(r, c)) {
                    lifeCellIds.push(`${r}-${c}`)
                }
            }
            else {
                if (checkIfBirth(r, c)) {
                    lifeCellIds.push(`${r}-${c}`)
                }
            }
        }
    }

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const currField = document.getElementById(`${r}-${c}`);
            if (lifeCellIds.includes(`${r}-${c}`)) {
                currField.classList.remove(DEAD_CELL_CLS);
                currField.classList.add(LIFE_CELL_CLS);
            }
            else {
                currField.classList.remove(LIFE_CELL_CLS);
                currField.classList.add(DEAD_CELL_CLS);
            }
        }
    }
}

BOARD.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});
BOARD.addEventListener("mousedown", (e) => {
    // lewy przycisk myszy
    if (e.button === 0)
        LEFT_CLICKED = true;
    // prawy przycisk myszy
    else if (e.button === 2) {
        RIGHT_CLICKED = true;
    }
});
BOARD.addEventListener("mouseup", (e) => {
    if (e.button === 0)
        LEFT_CLICKED = false;
    else if (e.button === 2) {
        RIGHT_CLICKED = false;
    }
});
const BUTTON = document.getElementsByClassName('btn')[0];
BUTTON.addEventListener('click', () => {
    const content = BUTTON.innerHTML;
    if (content === 'Go!') {
        BUTTON.innerHTML = 'Pause';
        interval = setInterval(gameRun, TIME);
    }
    else {
        BUTTON.innerHTML = 'Go!';
        clearInterval(interval);
    }
})

createBoard();