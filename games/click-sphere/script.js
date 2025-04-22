const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // Context để vẽ 2D lên canvas
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const startButton = document.getElementById('startButton');

// Cài đặt Game
const gridSize = 20; // Kích thước mỗi ô lưới (và kích thước mỗi đốt rắn/mồi)
const canvasSize = canvas.width; // Giả sử canvas là hình vuông
const tileCount = canvasSize / gridSize; // Số ô theo mỗi chiều

// Trạng thái Game
let snake = [ { x: 10, y: 10 } ]; // Vị trí ban đầu của rắn (theo ô lưới)
let food = { x: 15, y: 15 };     // Vị trí ban đầu của mồi
let dx = 0; // Hướng di chuyển ngang (1: phải, -1: trái, 0: đứng yên)
let dy = 0; // Hướng di chuyển dọc (1: xuống, -1: lên, 0: đứng yên)
let score = 0;
let changingDirection = false; // Cờ để ngăn đổi hướng ngược lại ngay lập tức
let gameLoopTimeout;
let gameSpeed = 150; // Tốc độ game (ms giữa các lần cập nhật), số nhỏ hơn -> nhanh hơn
let isGameOver = true; // Bắt đầu ở trạng thái chờ

// --- Vẽ ---
function clearCanvas() {
    ctx.fillStyle = '#a3d9a5'; // Màu nền sân chơi (khớp CSS)
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}

function drawSnakePart(part) {
    ctx.fillStyle = '#006400'; // Màu xanh đậm cho rắn
    ctx.strokeStyle = '#004d00'; // Viền đậm hơn chút
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    ctx.fillStyle = '#ff0000'; // Màu đỏ cho mồi
    ctx.strokeStyle = '#cc0000'; // Viền đậm hơn chút
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// --- Logic Game ---
function moveSnake() {
    // Tạo đầu rắn mới dựa trên hướng di chuyển
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Thêm đầu mới vào đầu mảng

    // Kiểm tra ăn mồi
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 10;
        scoreDisplay.textContent = score;
        // Tăng tốc độ (tùy chọn)
        if (gameSpeed > 50) { // Đặt giới hạn tốc độ tối thiểu
             gameSpeed -= 5;
        }
        createFood(); // Tạo mồi mới
        // Không cần xóa đuôi vì rắn đã dài ra
    } else {
        snake.pop(); // Xóa đốt cuối cùng nếu không ăn mồi
    }
}

function createFood() {
    // Tạo vị trí ngẫu nhiên trong lưới
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Đảm bảo mồi không xuất hiện trên thân rắn
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            createFood(); // Nếu trùng, tạo lại
        }
    });
}

function checkGameOver() {
    // Đâm vào tường
    if (
        snake[0].x < 0 ||
        snake[0].x >= tileCount ||
        snake[0].y < 0 ||
        snake[0].y >= tileCount
    ) {
        return true;
    }

    // Đâm vào chính mình
    for (let i = 4; i < snake.length; i++) { // Bắt đầu kiểm tra từ đốt thứ 4
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

// --- Vòng lặp Game ---
function gameLoop() {
    if (isGameOver) {
        gameOverDisplay.classList.remove('hidden');
        startButton.disabled = false; // Cho phép nhấn nút chơi lại
        return;
    }

    // Xóa timeout cũ để đặt timeout mới (quan trọng để thay đổi tốc độ)
    clearTimeout(gameLoopTimeout);

    changingDirection = false; // Cho phép đổi hướng cho frame tiếp theo

    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();

    // Kiểm tra kết thúc game SAU KHI di chuyển và vẽ xong
    isGameOver = checkGameOver();

    // Tiếp tục vòng lặp
    gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
}

// --- Điều khiển ---
function changeDirection(event) {
    if (changingDirection) return; // Nếu vừa đổi hướng, bỏ qua

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    // Ngăn di chuyển ngược lại hướng hiện tại
    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
        changingDirection = true;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
        changingDirection = true;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
        changingDirection = true;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
        changingDirection = true;
    }
}

// --- Bắt đầu Game ---
function startGame() {
    isGameOver = false;
    gameOverDisplay.classList.add('hidden'); // Ẩn thông báo game over
    startButton.disabled = true; // Vô hiệu hóa nút khi đang chơi

    // Reset trạng thái
    snake = [ { x: 10, y: 10 } ];
    dx = 0; // Reset hướng để người chơi chọn lại
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    gameSpeed = 150; // Reset tốc độ

    createFood(); // Tạo mồi đầu tiên
    clearTimeout(gameLoopTimeout); // Xóa timeout cũ nếu có
    gameLoop(); // Bắt đầu vòng lặp
}

// --- Lắng nghe sự kiện ---
document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);

// --- Hiển thị ban đầu (trước khi nhấn Start) ---
function initializeDisplay() {
     clearCanvas();
     drawSnake(); // Vẽ con rắn ban đầu
     drawFood(); // Vẽ cục mồi ban đầu
     gameOverDisplay.classList.add('hidden');
     startButton.disabled = false;
}

initializeDisplay(); // Chạy khi tải trang