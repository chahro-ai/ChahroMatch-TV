// script.js
// --- المتغيرات والعناصر الأساسية لواجهة VIP ---
const generateBtn = document.getElementById('generateBtn');
const secretInput = document.getElementById('secretInput');
const errorMsg = document.getElementById('errorMsg');
const codeDisplay = document.getElementById('codeDisplay');
const copyBtn = document.getElementById('copyBtn');
const copyNotification = document.getElementById('copyNotification');
const heart = document.querySelector('.heart');
const subtitleElement = document.querySelector('.subtitle');

// --- المتغيرات والعناصر الخاصة باللعبة ---
const playGameBtn = document.getElementById('playGameBtn');
const gameModal = document.getElementById('gameModal');
const closeModalBtn = gameModal.querySelector('.close-modal-btn');
const winCounterElement = gameModal.querySelector('#winCounter');
const gameBoardElement = gameModal.querySelector("#board");
const gameStatusMessageElement = gameModal.querySelector("#status-message");
const gameRestartButton = gameModal.querySelector("#restart-button");
const confettiCanvas = gameModal.querySelector('#confetti-canvas');

// --- حالة اللعبة وعداد الفوز ---
let humanWins = 0;
const WINS_REQUIRED = 3;
let game_gameActive = false;
let game_currentPlayer = "X";
let game_gameState = ["", "", "", "", "", "", "", "", ""];
const GAME_HUMAN_PLAYER = "X";
const GAME_BOT_PLAYER = "O";
const game_winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// --- إعداد Confetti ---
let game_myConfetti;

// --- دوال واجهة VIP ---
generateBtn.addEventListener('click', function() {
    const secret = secretInput.value;
    errorMsg.textContent = '';

    if (secret === '123' || humanWins >= WINS_REQUIRED) {
        heart.style.animation = 'heartBeat 0.5s ease-in-out 3, heartRotate 15s linear infinite';
        setTimeout(() => { heart.style.animation = 'heartBeat 2s ease-in-out infinite, heartRotate 15s linear infinite'; }, 1500);
        this.classList.add('btn-clicked');
        setTimeout(() => { this.classList.remove('btn-clicked'); }, 300);
        codeDisplay.innerHTML = '<span style="opacity: 0.7">جاري إنشاء الكود...</span>';
        copyBtn.style.display = 'none';

        setTimeout(() => {
            let code = '';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (let i = 0; i < 16; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            codeDisplay.style.opacity = '0';
            setTimeout(() => {
                codeDisplay.textContent = code;
                codeDisplay.style.opacity = '1';
                codeDisplay.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)';
                copyBtn.style.display = 'flex';
                copyBtn.style.opacity = '0';
                setTimeout(() => {
                    copyBtn.style.opacity = '1';
                    codeDisplay.style.boxShadow = 'inset 0 2px 5px rgba(0,0,0,0.1)';
                }, 300);
            }, 300);
        }, 800);
    } else {
        errorMsg.style.opacity = '0';
        copyBtn.style.display = 'none';
        setTimeout(() => {
            errorMsg.textContent = 'الرمز السري غير صحيح أو لم تحقق الانتصارات المطلوبة!';
            errorMsg.style.opacity = '1';
            secretInput.style.transform = 'translateX(10px)';
            setTimeout(() => { secretInput.style.transform = 'translateX(-10px)';
                setTimeout(() => { secretInput.style.transform = 'translateX(5px)';
                    setTimeout(() => { secretInput.style.transform = 'translateX(-5px)';
                        setTimeout(() => { secretInput.style.transform = 'translateX(0)'; }, 50);
                    }, 50);
                }, 50);
            }, 50);
        }, 200);
    }
});

copyBtn.addEventListener('click', function() {
    const codeText = codeDisplay.textContent;
    if (codeText && codeText !== 'الكود سيظهر هنا' && !codeText.includes('جاري إنشاء')) {
        navigator.clipboard.writeText(codeText).then(() => {
            this.style.backgroundColor = '#0a6e2c';
            setTimeout(() => { this.style.backgroundColor = 'rgba(17,134,58,0.8)'; }, 300);
            heart.style.animation = 'heartBeat 0.3s ease-in-out 2, heartRotate 15s linear infinite';
            setTimeout(() => { heart.style.animation = 'heartBeat 2s ease-in-out infinite, heartRotate 15s linear infinite'; }, 600);

            copyNotification.style.display = 'block';
            setTimeout(() => {
                copyNotification.classList.add('show');
                setTimeout(() => {
                    copyNotification.classList.remove('show');
                    setTimeout(() => { copyNotification.style.display = 'none'; }, 400);
                }, 2000);
            }, 10);
        });
    }
});

// فتح وإغلاق المودال
playGameBtn.addEventListener('click', () => {
    gameModal.style.display = 'flex';
    if (!game_myConfetti) {
        game_myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });
    }
    game_startGame();
});
closeModalBtn.addEventListener('click', () => { gameModal.style.display = 'none'; });
window.addEventListener('click', e => { if (e.target == gameModal) gameModal.style.display = 'none'; });

// لعبة X O
function game_createBoard() {
    gameBoardElement.innerHTML = "";
    gameBoardElement.style.opacity = '0';
    setTimeout(() => { gameBoardElement.style.opacity = '1'; }, 50);
    game_gameState.forEach((_, idx) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = idx;
        cell.addEventListener('click', game_handleCellClick);
        gameBoardElement.appendChild(cell);
    });
}
function game_handleCellClick(e) {
    const i = parseInt(e.target.dataset.index);
    if (!game_gameActive || game_gameState[i] !== "" || game_currentPlayer !== GAME_HUMAN_PLAYER) return;
    game_playMove(i, GAME_HUMAN_PLAYER);
    if (game_checkWinner()) return;
    game_currentPlayer = GAME_BOT_PLAYER;
    game_updateStatus();
    setTimeout(game_botMove, 400);
}
function game_playMove(index, player) {
    if (game_gameActive && game_gameState[index] === "") {
        game_gameState[index] = player;
        const cellEl = gameBoardElement.querySelector(`.cell[data-index='${index}']`);
        const sym = player === GAME_HUMAN_PLAYER ? 'symbol-x' : 'symbol-o';
        cellEl.innerHTML = `<span class="${sym}">${player}</span>`;
        cellEl.removeEventListener('click', game_handleCellClick);
        cellEl.style.cursor = 'default';
    }
}
function game_botMove() {
    if (!game_gameActive) return;
    const free = [];
    game_gameState.forEach((c,i) => { if (c==="") free.push(i); });
    if (free.length>0) {
        const pick = free[Math.floor(Math.random()*free.length)];
        game_playMove(pick, GAME_BOT_PLAYER);
        if (game_checkWinner()) return;
    }
    game_currentPlayer = GAME_HUMAN_PLAYER;
    game_updateStatus();
}
function game_checkWinner() {
    let won=false, winner=null, pat=[];
    for (let p of game_winPatterns) {
        const [a,b,c] = p;
        if (game_gameState[a] && game_gameState[a]===game_gameState[b] && game_gameState[a]===game_gameState[c]) {
            won=true; winner=game_gameState[a]; pat=p; break;
        }
    }
    gameStatusMessageElement.classList.remove('announce','tie','lose');
    if (won) {
        game_gameActive=false;
        let msgClass='announce', msgText="";
        if (winner===GAME_HUMAN_PLAYER) {
            msgText="🎉 لقد فزت! 🎉"; humanWins++;
            winCounterElement.textContent = `الانتصارات: ${humanWins} / ${WINS_REQUIRED}`;
            game_triggerConfetti();
            if (humanWins>=WINS_REQUIRED) {
                subtitleElement.textContent = "تهانينا! يمكنك الآن إنشاء الكود بدون الرمز السري.";
                secretInput.placeholder = "الشرط تحقق!";
                secretInput.disabled = true;
                playGameBtn.textContent = "الشرط تحقق! 🎉";
                playGameBtn.disabled = true;
                setTimeout(() => { gameModal.style.display = 'none'; }, 2500);
            }
        } else {
            msgText="💻 الكمبيوتر فاز! 💻"; msgClass+=" lose";
        }
        gameStatusMessageElement.textContent = msgText;
        gameStatusMessageElement.classList.add(msgClass);
        pat.forEach(i => {
            const cEl = gameBoardElement.querySelector(`.cell[data-index='${i}']`);
            cEl.classList.add('winner');
        });
        game_disableBoardClicks();
        return true;
    }
    if (!game_gameState.includes("")) {
        game_gameActive=false;
        gameStatusMessageElement.textContent="🤝 تعادل! 🤝";
        gameStatusMessageElement.classList.add('announce','tie');
        game_disableBoardClicks();
        return true;
    }
    return false;
}
function game_disableBoardClicks() {
    gameBoardElement.querySelectorAll('.cell').forEach(c => {
        if (!game_gameState[parseInt(c.dataset.index)]) {
            c.removeEventListener('click', game_handleCellClick);
            c.style.cursor = 'default';
        }
    });
}
function game_updateStatus() {
    if (game_gameActive) {
        gameStatusMessageElement.textContent = `دور: ${game_currentPlayer===GAME_HUMAN_PLAYER?'أنت (X)':'الكمبيوتر (O)'}`;
        gameStatusMessageElement.classList.remove('announce','tie','lose');
    }
}
function game_startGame() {
    game_gameActive=true;
    game_currentPlayer=GAME_HUMAN_PLAYER;
    game_gameState=["","","","","","","","",""];
    gameStatusMessageElement.classList.remove('announce','tie','lose');
    game_createBoard();
    game_updateStatus();
    winCounterElement.textContent = `الانتصارات: ${humanWins} / ${WINS_REQUIRED}`;
}
function game_triggerConfetti() {
    if (game_myConfetti) {
        game_myConfetti({ particleCount:150, spread:90, origin:{ y:0.6 }});
        setTimeout(() => {
            game_myConfetti({ particleCount:100, angle:60, spread:70, origin:{ x:0 }});
            game_myConfetti({ particleCount:100, angle:120, spread:70, origin:{ x:1 }});
        }, 250);
    }
}
gameRestartButton.addEventListener("click", game_startGame);

// تأثيرات عند التحميل والتركيز
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => { document.body.style.opacity = '1'; }, 300);
});
secretInput.addEventListener('focus', () => { secretInput.style.transform = 'translateY(-2px)'; });
secretInput.addEventListener('blur', () => { secretInput.style.transform = 'translateY(0)'; });
