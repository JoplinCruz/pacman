
class Grid{

    constructor(canvas, context, grid) {
        this.canvas = canvas;
        this.screen = context;
        this.grid = grid;
    }

    draw() {
        screen.fillStyle = "black";
        screen.clearRect(0, 0, canvas.width, canvas.height);
        screen.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let v=0; v < this.grid.length; v++) {
            for (let u=0; u < this.grid[v].length; u++) {
                
                screen.beginPath();
                screen.strokeStyle = wallColor;
                screen.lineWidth = lineWidth;
    
                let x = u * blocksize,
                    y = v * blocksize;
                
                let pivot = this.grid[v][u],
                    A = this.grid[v - 1] ? this.grid[v - 1][u - 1] ?? null : null,
                    B = this.grid[v - 1] ? this.grid[v - 1][u] ?? null : null,
                    C = this.grid[v - 1] ? this.grid[v - 1][u + 1] ?? null : null,
                    D = this.grid[v][u - 1] ?? null,
                    E = this.grid[v][u + 1] ?? null,
                    F = this.grid[v + 1] ? this.grid[v + 1][u - 1] ?? null : null,
                    G = this.grid[v + 1] ? this.grid[v + 1][u] ?? null : null,
                    H = this.grid[v + 1] ? this.grid[v + 1][u + 1] ?? null : null;
                
                if (pivot === WALL) {
                    
                    // internal borders
                    if ((B === 1 && D === 1 && E !== 1 && G !== 1 && H !== 1) ||
                        (A !== 1 && B === 1 && D === 1)) {
                        screen.moveTo(x + parseInt(blocksize / 2), y);
                        screen.arc(x, y, blocksize / 2, 0, Math.PI / 2);
                    }
                    if ((B === 1 && C === 1 && E === 1 && D !== 1 && F !== 1 && G !== 1) ||
                        (C !== 1 && B === 1 && E === 1)) {
                        screen.moveTo(x + blocksize, y + parseInt(blocksize / 2));
                        screen.arc(x + blocksize, y, blocksize / 2, Math.PI / 2, Math.PI);
                    }
                    if ((D === 1 && G === 1 && B !== 1 && C !== 1 && E !== 1) ||
                        (F !== 1 && G === 1 && D === 1)) {
                        screen.moveTo(x, y + parseInt(blocksize / 2));
                        screen.arc(x, y + blocksize, blocksize / 2, Math.PI * 3 / 2, 2 * Math.PI);
                    }
                    if ((E === 1 && G === 1 && A !== 1 && B !== 1 && D !== 1) ||
                        (H !== 1 && G === 1 && E === 1)) {
                        screen.moveTo(x + parseInt(blocksize / 2), y + blocksize);
                        screen.arc(x + blocksize, y + blocksize, blocksize / 2, Math.PI, Math.PI * 3 /2);
                    }

                    // internal lines
                    if ((B !== 1 && F === 1 && G === 1 && H === 1) ||
                        (G !== 1 && A === 1 && B === 1 && C === 1) ||
                        (B === null && D === 1 && E === 1 && G !== 1) ||
                        (B === null && D === null && E === 1 && G !== 1) ||
                        (B === null && D === 1 && E === null && G !== 1) ||
                        (G === null && D === 1 && E === 1 && B !== 1) ||
                        (G === null && D === null && E === 1 && B !== 1) ||
                        (G === null && D === 1 && E === null && B !== 1)) {
                        screen.moveTo(x, y + parseInt(blocksize / 2));
                        screen.lineTo(x + blocksize, y + parseInt(blocksize / 2));
                    }
                    if (G === null && D === 1 && E === 0 && G !== 1) {
                        screen.moveTo(x, y + parseInt(blocksize / 2));
                        screen.lineTo(x + parseInt(blocksize / 2), y + parseInt(blocksize / 2));
                    }
                    if (G === null && D === 0 && E === 1 && B !== 1) {
                        screen.moveTo(x + parseInt(blocksize / 2), y + parseInt(blocksize / 2));
                        screen.lineTo(x + blocksize, y + parseInt(blocksize / 2));
                    }
                    if ((D !== 1 && C === 1 && E === 1 && H === 1) ||
                        (E !== 1 && A === 1 && D === 1 && F === 1) ||
                        (D === null && E !== 1) ||
                        (E === null && D !== 1)) {
                        screen.moveTo(x + parseInt(blocksize / 2), y);
                        screen.lineTo(x + parseInt(blocksize / 2), y + blocksize);
                    }

                    // external borders
                    if (A === null && B === null & D === null && E === 1 && G === 1) {
                        screen.moveTo(x + spacing, y + blocksize);
                        screen.arc(x + blocksize, y + blocksize, spacing + (blocksize / 2), Math.PI, Math.PI * 3 / 2)
                    }
                    if (B === null && C === null & E === null && D === 1 && G === 1) {
                        screen.moveTo(x + spacing, y + spacing);
                        screen.arc(x, y + blocksize, spacing + (blocksize / 2), Math.PI * 3 / 2, 2 * Math.PI)
                    }
                    if (G === null && H === null & E === null && D === 1 && B === 1) {
                        screen.moveTo(x + blocksize - spacing, y);
                        screen.arc(x, y, spacing + (blocksize / 2), 0, Math.PI / 2)
                    }
                    if (D === null && F === null & G === null && B === 1 && E === 1) {
                        screen.moveTo(x + blocksize, y + blocksize - spacing);
                        screen.arc(x + blocksize, y, spacing + (blocksize / 2), Math.PI / 2, Math.PI)
                    }

                    // external lines
                    if ((B === null && D === 1 && E === 1) ||
                        (B === null && D === null && E === 1 && G !== 1) ||
                        (B === null && D === 1 && E === null && G !== 1)) {
                        screen.moveTo(x, y + spacing);
                        screen.lineTo(x + blocksize, y + spacing);
                    }
                    if ((G === null && D === 1 && E === 1) ||
                        (G === null && D === null && E === 1 && B !== 1) ||
                        (G === null && D === 1 && E === null && B !== 1)) {
                        screen.moveTo(x, y + blocksize - spacing);
                        screen.lineTo(x + blocksize, y + blocksize - spacing);
                    }
                    if (G === null && D === 1 && E !== 1 && B !== 1) {
                        screen.moveTo(x, y + blocksize - spacing);
                        screen.lineTo(x + parseInt(blocksize / 2), y + blocksize - spacing);
                    }
                    if (G === null && D !== 1 && E === 1 && B !== 1) {
                        screen.moveTo(x + parseInt(blocksize / 2), y + blocksize - spacing);
                        screen.lineTo(x + blocksize, y + blocksize - spacing);
                    }
                    if ((D === null && B === 1 && G === 1) ||
                        (D === null && E === 0)) {
                        screen.moveTo(x + spacing, y);
                        screen.lineTo(x + spacing, y + blocksize);
                    }
                    if ((E === null && B === 1 && G === 1) ||
                        (E === null && D === 0)) {
                        screen.moveTo(x + blocksize - spacing, y);
                        screen.lineTo(x + blocksize - spacing, y + blocksize);
                    }

                    // external borders extra
                    if (A === null && D === 1 && B === 1) {
                        screen.moveTo(x, y + spacing);
                        screen.arc(x, y, spacing, 0, Math.PI / 2);
                    }
                    if (C === null && E === 1 && B === 1) {
                        screen.moveTo(x + blocksize, y + spacing);
                        screen.arc(x + blocksize, y, spacing, Math.PI / 2, Math.PI);
                    }
                    if (F === null && D === 1 && G === 1) {
                        screen.moveTo(x, y + blocksize - spacing);
                        screen.arc(x, y + blocksize, spacing, Math.PI * 3 / 2, 2 * Math.PI);
                    }
                    if (H === null && E === 1 && G === 1) {
                        screen.moveTo(x + blocksize - spacing, y + blocksize);
                        screen.arc(x + blocksize, y + blocksize, spacing, Math.PI, Math.PI * 3 / 2);
                    }

                    // tips borders
                    if (G === null && D === 1 && E === 0) {
                        screen.moveTo(x + parseInt(blocksize / 2), y + parseInt(blocksize / 2));
                        screen.arc(x + parseInt(blocksize / 2), y + blocksize - parseInt(spacing * 3 / 2), spacing / 2, Math.PI * 3 / 2, Math.PI * 5 / 2);
                    }
                    if (G === null && D === 0 && E === 1) {
                        screen.moveTo(x + parseInt(blocksize / 2), y + blocksize - spacing);
                        screen.arc(x + parseInt(blocksize / 2), y + blocksize - parseInt(spacing * 3 / 2), spacing / 2, Math.PI / 2, Math.PI * 3 / 2);
                    }
                }
    
                screen.stroke();
                
                if (pivot === FOOD) {
                    screen.fillStyle = foodColor;
                    screen.arc(x + parseInt(blocksize / 2), y + parseInt(blocksize / 2), foodsize, 0, 2 * Math.PI);
                    screen.fill();
                }
                
                if (pivot === BIGFOOD) {
                    screen.fillStyle = foodColor;
                    screen.arc(x + parseInt(blocksize / 2), y + parseInt(blocksize / 2), bigfoodsize, 0, 2 * Math.PI);
                    screen.fill();
                }
            }
        }
    }
}


