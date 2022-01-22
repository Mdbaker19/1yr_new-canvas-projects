const enemyBaseStats = {health: 10, speed: 5};
const enemyDrop = 30;
const enemyMoveRate = 10;
const enemyStartList = {
    x: [100, 200, 300, 400, 500, 600, 700],
    y: [100, 150]
}
const dimensions = {
    ship: {
        w: 20,
        h: 30
    },
    enemy: {
        w: 15,
        h: 11
    },
    fortPiece: {
        s: 5
    }
};
let enemies = [
    new Enemy(200, 100, enemyBaseStats, randomIdCreator()),
    new Enemy(200, 150, enemyBaseStats, randomIdCreator()),
    new Enemy(300, 100, enemyBaseStats, randomIdCreator()),
    new Enemy(300, 150, enemyBaseStats, randomIdCreator()),
    new Enemy(400, 100, enemyBaseStats, randomIdCreator()),
    new Enemy(400, 150, enemyBaseStats, randomIdCreator()),
    new Enemy(500, 100, enemyBaseStats, randomIdCreator()),
    new Enemy(500, 150, enemyBaseStats, randomIdCreator()),
];
let startStats = {
    attack: 5,
    speed: 15,
    health: 10,
    regenRate: 10,
    bulletCount: 10,
};

function Ship (x, y, baseStats) {
    this.x = x;
    this.y = y;
    this.attack = baseStats.attack;
    this.speed = baseStats.speed;
    this.health = baseStats.health;
    this.bulletCount = baseStats.bulletCount;
    this.bulletRegen = baseStats.regenRate;

    this.shotList = [];

    this.enemiesToKill = enemies;

    this.show = () => {
        fill(this.x, this.y, dimensions.ship.w, dimensions.ship.h, '#1d7c0f');
        fill(this.x - dimensions.ship.w / 1.8, this.y + dimensions.ship.h, dimensions.ship.w * 2, dimensions.ship.h / 4, '#6f9369');
        fill(this.x + dimensions.ship.w / 2.3, this.y - dimensions.ship.h / 1.5, dimensions.ship.w / 4, dimensions.ship.h / 1.5, '#54a648');
    }

    this.move = (dir) => {
        switch (dir) {
            case 'Right':
                this.x += this.speed;
                break;
            case 'Left':
                this.x -= this.speed;
                break;
            default:
                return;
        }
        if(this.x <= 5) {
            this.x = w - dimensions.ship.w;
        } else if(this.x >= w - dimensions.ship.w) {
            this.x = 0;
        }
    }

    this.shoot = () => {
        this.bulletCount -= 1;
        this.shotList.push(new Bullet(this.x + dimensions.ship.w / 2, this.y - dimensions.ship.h / 1.5, randomIdCreator()));
    }

    this.removeItem = (id, list) => {
        if(!list) return;
        for(let i = list.length - 1; i >= 0; i--) {
            if(list[i].id === id) {
                list.splice(i, 1);
            }
        }
    }
}

function Enemy (x, y, stats, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.health = stats.health;
    this.speed = stats.speed;
    this.shotList = [];
    this.dirFlag = false;
    // this.didDrop = false;

    this.move = () => {
        if(this.x < baseDiff /*&& !this.didDrop*/) {
            // this.didDrop = true;
            this.dirFlag = true;
            this.y += enemyDrop;
            this.speed += .1;
        } else if (this.x > w - baseDiff /*&& !this.didDrop*/) {
            // this.didDrop = true;
            this.speed += .1;
            this.dirFlag = false;
            this.y += enemyDrop;
        }
        if(this.dirFlag /*&& !this.didDrop*/) {
            this.x += enemyMoveRate;
        } else if(/*!this.didDrop && */!this.dirFlag) {
            this.x -= enemyMoveRate;
        }
        // this.didDrop = false;
    }

    this.show = () => {
        fill(this.x, this.y, dimensions.enemy.w, dimensions.enemy.h, '#dd5a5a');
        fill(this.x - dimensions.enemy.w / 2, this.y + dimensions.enemy.h / 2, dimensions.enemy.w * 2, dimensions.enemy.h / 2, '#941515');
        fill(this.x - dimensions.enemy.w / 5, this.y + dimensions.enemy.h, dimensions.enemy.w / 5, dimensions.enemy.h / 1.5, '#d42020');
        fill(this.x + dimensions.enemy.w / 2.2, this.y + dimensions.enemy.h, dimensions.enemy.w / 5, dimensions.enemy.h / 1.5, '#d42020');
        fill(this.x + dimensions.enemy.w, this.y + dimensions.enemy.h, dimensions.enemy.w / 5, dimensions.enemy.h / 1.5, '#d42020');
    }

    this.removeShot = id => {
        for(let i = this.shotList.length - 1; i >= 0; i--) {
            if(this.shotList[i].id === id) {
                this.shotList.splice(i, 1);
            }
        }
    }
}

function Bullet(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.size = 5;

    this.move = () => {
        this.y -= baseBulletSpeed;
    }

    this.show = () => {
        fill(this.x, this.y, this.size, this.size, '#fff');
    }

}

function Explosion(x, y) {
    this.x = x;
    this.y = y;

    this.deleteSelf = () => {
        this.x = undefined;
        this.y = undefined;
    }

    this.show = () => {
        fill(this.x, this.y, 10, 10, "#feca07");
        fill(this.x + 3, this.y + 3, 3, 3, "#fe0759");
        fill(this.x - 5, this.y, 5, 4, "#fc8701");
        fill(this.x + 10, this.y, 5, 4, "#fc8701");
        fill(this.x + 10, this.y + 6, 5, 4, "#fc8701");
        fill(this.x - 5, this.y + 6, 5, 4, "#fc8701");
        fill(this.x + 7, this.y - 4, 5, 4, "#fc8701");
        fill(this.x + 7, this.y + 8, 5, 4, "#fc8701");
        fill(this.x - 2, this.y - 4, 5, 4, "#fc8701");
        fill(this.x - 2, this.y + 8, 5, 4, "#fc8701");
    }
}


function EnemyBomb(x, y) {
    this.x = x;
    this.y = y;

    this.move = () => {
        this.y += 2;
    }

    this.show = () => {
        fill(this.x, this.y, 4, 4, "#abf888");
    }
}

function Fort(x, y) {
    this.x = x;
    this.y = y;
    this.pieceList = [];

    this.show = () => {
        this.pieceList.forEach(piece => {
            piece.show();
        });
    }

    this.breakPiece = id => {
        for(let i = this.pieceList.length - 1; i >= 0; i--) {
            if(this.pieceList[i].id === id) {
                this.pieceList.splice(i, 1);
            }
        }
    }
}

function FortPiece(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    this.show = () => {
        fill(this.x, this.y, dimensions.fortPiece.s, dimensions.fortPiece.s, "#e3dcdc");
    }

}
