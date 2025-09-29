const game_grid = document.getElementById('game-grid');
const grid_size = 3;

const player_x = document.getElementById('player-x')
const player_o = document.getElementById('player-o')

const header = document.getElementById('header');
const reset_button = document.getElementById('reset');

let current_player = player_x;

const rounds = grid_size ** 2;
let current_round = 0;

function draw_grid() {
    if (!game_grid) return

    for (let y = 0; y < grid_size; y++) {
        const game_row = document.createElement('div');
        game_row.className = "game-row";
        game_row.id = `y-${y}`;
        for (let x = 0; x < grid_size; x++) {
            const game_field = document.createElement('div');
            game_field.className = "game-field";
            game_field.id = `y-${y}-x-${x}`;
            game_field.addEventListener('click', game_play);

            game_row.append(game_field);
        }
        game_grid.append(game_row);
    }
}

function game_play(this: HTMLDivElement) {
    if (!current_player) return
    if (!header) return
    if (!player_o) return 
    if (!player_x) return
    
    if (current_round >= rounds) return;
    current_round++;

    const newSymbol = document.createElement('div')
    newSymbol.innerHTML = current_player.innerHTML;
    newSymbol.className = "player";
    this.append(newSymbol);

    if (check_winner()) {
        current_round = rounds;
        const winnerText = document.createElement('h2');
        winnerText.innerText = `${current_player.innerText} is the winner!`;
        header.append(winnerText);
    } else {
        if (current_player.id === "player-x") {
            current_player = player_o;
            player_x.classList.remove('turn');
            player_o.classList.add('turn');
        } else {
            current_player = player_x;
            player_x.classList.add('turn');
            player_o.classList.remove('turn');
        }
        if (current_round >= rounds) {
            const tieText = document.createElement('h2');
            tieText.innerText = "It's a tie!";
            header.append(tieText);
        }
    }

    this.removeEventListener('click', game_play);
}

function grid(x: number, y: number) {
    return document.getElementById(`y-${y}-x-${x}`)?.innerText;
}

function check_winner() {
    // Check horizontal and vertical lines
    for (let i = 0; i < grid_size; i++) {
        // Horizontal check (row i)
        if (grid(0, i) !== '' && grid(0, i) === grid(1, i) && grid(0, i) === grid(2, i)) {
            return true;
        }
        // Vertical check (column i)
        if (grid(i, 0) !== '' && grid(i, 0) === grid(i, 1) && grid(i, 0) === grid(i, 2)) {
            return true;
        }
    }

    // Top-left to bottom-right diagonal
    if (grid(0, 0) !== '' && grid(0, 0) === grid(1, 1) && grid(0, 0) === grid(2, 2)) {
        return true;
    }

    // Top-right to bottom-left diagonal
    if (grid(2, 0) !== '' && grid(2, 0) === grid(1, 1) && grid(2, 0) === grid(0, 2)) {
        return true;
    }

    return false;
}

draw_grid();