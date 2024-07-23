// 캔버스 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 다시하기 버튼 설정
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);

// 게임 상태
let isGameOver = false;
let score = 0;

// 플레이어 설정 (LoL 스타일 캐릭터)
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height / 2 - 40,
  width: 50,
  height: 80,
  speed: 5,
  color: 'blue',
  hp: 100
};

// 키보드 입력 설정
const keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// 스킬 설정
const skills = [];

// 적 설정
const enemies = [];
function spawnEnemy() {
  const x = Math.random() * (canvas.width - 60);
  const y = Math.random() * (canvas.height - 60);
  enemies.push({
    x,
    y,
    width: 40,
    height: 40,
    speed: Math.random() * 2 + 1,
    color: 'red',
    hp: 50
  });
}

// 충돌 감지 함수
function detectCollision(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}

// 게임 루프
function gameLoop() {
  if (isGameOver) {
    ctx.font = '48px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
    ctx.font = '24px serif';
    ctx.fillText('Score: ' + score, canvas.width / 2 - 60, canvas.height / 2 + 50);
    restartButton.style.display = 'block';
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 플레이어 그리기
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 스킬 그리기
  for (let i = skills.length - 1; i >= 0; i--) {
    const skill = skills[i];
    skill.y -= skill.speed;
    ctx.fillStyle = skill.color;
    ctx.fillRect(skill.x, skill.y, skill.width, skill.height);
    if (skill.y < 0) {
      skills.splice(i, 1);
    }
  }

  // 적 그리기
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.y += enemy.speed;

    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
      continue;
    }

    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

    // 플레이어와 충돌 감지
    if (detectCollision(player, enemy)) {
      player.hp -= 10;
      if (player.hp <= 0) {
        isGameOver = true;
      }
    }

    // 스킬과 충돌 감지
    for (let j = skills.length - 1; j >= 0; j--) {
      if (detectCollision(skills[j], enemy)) {
        enemy.hp -= 20;
        skills.splice(j, 1);
        if (enemy.hp <= 0) {
          enemies.splice(i, 1);
          score += 1; // 점수 추가
          break;
        }
      }
    }
  }

  // 점수 표시
  ctx.font = '24px serif';
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 10, 30);
  ctx.fillText('HP: ' + player.hp, 10, 60);

  // 플레이어 이동
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
  if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
  if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;

  requestAnimationFrame(gameLoop);
}

// 스킬 발사
function shootSkill() {
  skills.push({
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 10,
    height: 20,
    speed: 6,
    color: 'cyan'
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') shootSkill();
});

// 게임 재시작
function restartGame() {
  isGameOver = false;
  score = 0;
  player.hp = 100;
  enemies.length = 0;
  skills.length = 0;
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height / 2 - 40;
  restartButton.style.display = 'none';
  requestAnimationFrame(gameLoop);
}

// 적 생성 주기적으로 호출
setInterval(spawnEnemy, 1000);

requestAnimationFrame(gameLoop);

