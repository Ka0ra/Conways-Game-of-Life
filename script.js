//get canvas obj.
const canvas = document.getElementsByTagName("canvas")[0];

//get draw context
const draw_context = canvas.getContext("2d");

//draw_context.

const cell_size = 20;

const width = canvas.width / cell_size;
const height = canvas.height / cell_size;

const DEAD = false;
const DEAD_COLOR = "white";
const ALIVE = true;
const ALIVE_COLOR = "black";
const BORDER_COLOR = "lightgray";


//create grid
function createGrid()
{
    let new_grid = Array(width);
    for(let x = 0; x < width; x++)
    {
        let col = Array(height);
        for(let y = 0; y < height; y++)
        {
            col[y] = DEAD;
        }
        new_grid[x] = col;
    }
    return new_grid;
}

let grid = createGrid();

//draw grid
function drawGrid()
{
    for(let x = 0; x < width; x++)
    {
        for(let y = 0; y < height; y++)
        {
            if(grid[x][y] == ALIVE)
            {
                draw_context.fillStyle = ALIVE_COLOR;
            }
            else
            {
                draw_context.fillStyle = DEAD_COLOR;
            }
            draw_context.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
        }
    }
    //draw vertical cell borders
    for(let x = 0; x < width+1; x++)
    {
        draw_context.fillStyle = BORDER_COLOR;
        draw_context.fillRect(x * cell_size-1, 0, 2, canvas.height);
    }
    for(let y = 0; y < height+1; y++)
    {
        draw_context.fillStyle = BORDER_COLOR;
        draw_context.fillRect(0, y * cell_size-1, canvas.width, 2);
    }
}

//cell neighbourhood
const neighbourhood = [
    { x_offset: -1, y_offset: -1},
    { x_offset: -1, y_offset: 0},
    { x_offset: -1, y_offset: 1},
    { x_offset: 0, y_offset: 1},
    { x_offset: 1, y_offset: 1},
    { x_offset: 1, y_offset: 0},
    { x_offset: 1, y_offset: -1},
    { x_offset: 0, y_offset: -1}
];

function countLivingNeighbours(x, y)
{
    let count = 0;
    for(const neighbour of neighbourhood)
    {
        let abs_coordinate_from_neighbour_x = x + neighbour.x_offset;
        let abs_coordinate_from_neighbour_y = y + neighbour.y_offset;
        //out of bounds checks
        //left side and above
        if((abs_coordinate_from_neighbour_x < 0) || (abs_coordinate_from_neighbour_y < 0))
        {
            continue;
        }
        //below and right side
        if((abs_coordinate_from_neighbour_y >= height) || (abs_coordinate_from_neighbour_x >= width))
        {
            continue;
        }
        if(grid[abs_coordinate_from_neighbour_x][abs_coordinate_from_neighbour_y] == ALIVE)
        {
            count++;
        }
    }
    return count;
}

//update game to step from intervall to intervall in the gol algo
function updateGame()
{
    let next_grid = createGrid();
    for(let x = 0; x < width; x++)
    {
        for(let y = 0; y < height; y++)
        {
            //rules derived from https://en.wikipedia.org/wiki/Conway's_Game_of_Life

            //rule 1: Any live cell with two or three live neighbours survives.
            if((grid[x][y] == ALIVE) && ((countLivingNeighbours(x,y) == 2) || (countLivingNeighbours(x,y) == 3)))
            {
                next_grid[x][y] = ALIVE;
            }
            //rule 2: Any dead cell with three live neighbours becomes a live cell.
            else if((grid[x][y] == DEAD) && (countLivingNeighbours(x,y) == 3))
            {
                next_grid[x][y] = ALIVE;
            }
            //rule 3: All other live cells die in the next generation. Similarly, all other dead cells stay dead.
            else
            {
                next_grid[x][y] = DEAD;
            }
        }
    }
    grid = next_grid;
    drawGrid();

    //console.log("update game happend");
}

//toggle cell on click for seeding
canvas.addEventListener("click", function(event)
{
    //which x coordinate has been clicked on
    let click_x = Math.floor(event.offsetX / cell_size);
    //which y coordinate has been clicked on
    let click_y = Math.floor(event.offsetY / cell_size);
    if(grid[click_x][click_y] == ALIVE)
    {
        grid[click_x][click_y] = DEAD;
    }
    else
    {
       grid[click_x][click_y] = ALIVE;
    }
    drawGrid();
});


let game_running = false;

//get intervall
let intervall = null;


//get start/pause button
const start_pause_button = document.getElementById("start");
start_pause_button.addEventListener("click", function(event)
{
    if(game_running)
    {
        game_running = false;
        intervall = clearInterval(intervall);
        start_pause_button.innerText="Start";
    }
    else
    {
        game_running = true;
        intervall = setInterval(updateGame, 1000);
        start_pause_button.innerText="Pause";
    }
});



//get step button
const step_button = document.getElementById("step");

step_button.addEventListener("click", function(event)
{
    if(!game_running)
    {
        updateGame();
    }
});


//get reset button
const reset_button = document.getElementById("reset");

reset_button.addEventListener("click", function(event)
{
    game_running = false;
    intervall = clearInterval(intervall);
    //reload site. yes, the ugly way.
    location.reload();
});


drawGrid();
