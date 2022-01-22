const c = document.getElementById('game');
const cc = c.getContext('2d');

const w = c.width;
const h = c.height;
let baseBulletSpeed = 15;
let baseDiff = 50;

function fill(x, y, w, h, c) {
    cc.fillStyle = c;
    cc.fillRect(x, y, w, h);
}

function randomIdCreator() {
    let options = 'abcdefgLMNOPhijklmABCDEFGnopqrsHIJKtuvw xyz1234567890-=[];.\!@#$%^QRSTUV&*()_+WXYZ{}|:>?<';
    let idStr = '';
    for(let i = 0; i < 50; i++) {
        let idx = ~~(Math.random() * options.length);
        idStr += options[idx];
    }
    return idStr;
}

function evalEnemyHit(bulletX, bulletY, bulletSize, enemyX, enemyY, enemyWidth, enemyHeight) {

    let bulletIsInEnemyBoundsLeftRight = bulletX + bulletSize >= enemyX && bulletX <= enemyX + enemyWidth;
    let bulletIsInEnemyBoundsTopBottom = bulletY + bulletSize >= enemyY && bulletY <= enemyY + enemyHeight;

    let bulletHitBottomOfEnemy = bulletIsInEnemyBoundsLeftRight && bulletIsInEnemyBoundsTopBottom;

    let bulletHitLeftOfEnemy = bulletIsInEnemyBoundsTopBottom && bulletX + bulletSize >= enemyX;
    let bulletHitRightOfEnemy = bulletIsInEnemyBoundsTopBottom && bulletX <= enemyX + enemyWidth;

    return bulletHitBottomOfEnemy && (bulletHitRightOfEnemy && bulletHitLeftOfEnemy);
}
