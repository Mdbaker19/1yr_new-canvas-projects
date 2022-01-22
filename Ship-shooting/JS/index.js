(() => {

    let explosionList = [];
    let fortList = [];
    const fortCount = 7;
    let pointCounter = document.getElementById("points");
    let points = 0;
    let bulletCounter = document.getElementById("bulletCount");
    let difAdj = document.getElementById("diffRange");
    difAdj.addEventListener("change", (e) => {
        //TODO: some kind of point multiplier
        baseDiff = parseInt(e.target.value);
    });

    let starterShip = new Ship(w / 2, h - 40, startStats);

    window.addEventListener('keydown', (e) => {
        let key = e.code;
        if(key.includes('Arrow')) {
            let arrowKey = e.code.replace('Arrow', '');
            starterShip.move(arrowKey);
        } else if (key === 'Space') {
            if(starterShip.bulletCount > 0) {
                starterShip.shoot();
            }
        }
    });


    // TODO : edit something here to fix the enemy bombs persisting on the screen after the ship is destroyed
    //  they are also freezing randomly.. seems to be right as a new wave of enemies spawn
    function enemyLogic(enemiesList) {
        enemiesList.forEach(enemy => {
            enemy.show();
            enemy.shotList.forEach(bomb => {
                if(enemiesList.includes(enemy)) {
                    if (bomb.move) bomb.move();
                    bomb.show();
                }
            });
        });
    }

    function bulletLogic(bulletList) {
        bulletList.forEach(bullet => {
            bullet.move();
            bullet.show();
            // need to add a || hit enemy.... here or in the evalContact function with both enemy and bullets as params
            if(bullet.y <= 0) {
                starterShip.removeItem(bullet.id);
            }
        });
    }

    setInterval(() => {
        starterShip.enemiesToKill.forEach(enemy => {
            enemy.move();
        });
    }, 300);

    setInterval(() => {
        // will pick random enemies from the list to drop a bomb
        let randomEnemiesToShootList = new Set();
        for(let i = 0; i < starterShip.enemiesToKill.length; i++) {
            randomEnemiesToShootList.add(~~(Math.random() * starterShip.enemiesToKill.length));
        }
        starterShip.enemiesToKill.forEach((enemy, idx) => {
            if(randomEnemiesToShootList.has(idx)) {
                enemy.shotList.push(new EnemyBomb(enemy.x, enemy.y));
            }
        });
    }, 3350);

    setInterval(load, 50);

    // setInterval(difficultyIncrease, 11700);

    setInterval(() => {
        starterShip.bulletCount++;
    }, 2000 - (starterShip.bulletRegen * 100))

    function difficultyIncrease() {
        // console.log('Spawning more if you are ready or not!');
        let currEnemies = starterShip.enemiesToKill;
        starterShip.enemiesToKill = [...currEnemies, ...createMoreEnemies()];
        starterShip.enemiesToKill.forEach(e => e.shotList.forEach(s => s.move++));
    }

    function createMoreEnemies() {
        let eList = [];
        for(let i = 0; i < 7; i++) {
            let yIdx = i % 2 === 0 ? 1 : 0;
            eList.push(new Enemy(enemyStartList.x[i], enemyStartList.y[yIdx], enemyBaseStats, randomIdCreator()));
        }
        return eList;
    }

    Array.from(document.getElementsByClassName('control-button')).forEach(button => {
        button.addEventListener('click', (e) => {
            if(e.pointerId < 0) return; // handle some sort of evt bubble that is happening when you click an upgrade and then shoot
            let choice = e.target.innerText;
            if(points >= 2) {
                performUpgrade(choice);
                points -= 2;
            }
        });
    });

    function performUpgrade(upgradeChoice) {
        switch (upgradeChoice) {
            case 'Damage':
                return starterShip.attack++;
            case 'Bullet Speed':
                return baseBulletSpeed++;
            case 'Ship Speed':
                return starterShip.speed++;
            case 'Health':
                return starterShip.health++;
            case 'Bullet Regen Speed':
                return starterShip.bulletRegen++;
            default:
                return null;
        }
    }


    function playerHitEnemyLogic(enemyList, bulletList) {
        enemyList.forEach(enemy => {
           bulletList.forEach(bullet => {
              if(evalEnemyHit(bullet.x, bullet.y, bullet.size, enemy.x, enemy.y, dimensions.enemy.w, dimensions.enemy.h + 5)) {
                  points++;
                  starterShip.removeItem(bullet.id, starterShip.shotList);
                  starterShip.removeItem(enemy.id, starterShip.enemiesToKill);
                  explosionList.push(new Explosion(enemy.x, enemy.y));
              }
           });
        });
    }

    function initForts() {
        for(let i = 1; i <= fortCount; i++) {
            fortList.push(createFort(i));
        }
    }

    initForts();

    function createFort(idx) {
        let fort = new Fort(100 * idx, h - 100);
        for(let i = 0; i < 10; i++) {
            fort.pieceList.push(new FortPiece(100 * idx, 650 + (i * 5), randomIdCreator()));
            fort.pieceList.push(new FortPiece(100 * idx + (i * 2), 650 + (i * 5), randomIdCreator()));
            fort.pieceList.push(new FortPiece(100 * idx - (i * 2), 650 + (i * 5), randomIdCreator()));
            fort.pieceList.push(new FortPiece(100 * idx - (i * 2), 700, randomIdCreator()));
            fort.pieceList.push(new FortPiece(100 * idx + (i * 2), 700, randomIdCreator()));
        }
        return fort;
    }


    function fortLogic() {
        let shipShotList = starterShip.shotList;
        let enemies = starterShip.enemiesToKill;
        fortList.forEach(fort => {
            fort.show();
            fort.pieceList.forEach(piece => {
                shipShotList.forEach(shot => {
                    if(evalEnemyHit(shot.x, shot.y, shot.size, piece.x, piece.y, dimensions.fortPiece.s, dimensions.fortPiece.s)) {
                        starterShip.removeItem(shot.id, shipShotList);
                        fort.breakPiece(piece.id);
                    }
                });
                enemies.forEach(enemy => {
                    enemy.shotList.forEach(bomb => {
                        if(evalEnemyHit(bomb.x, bomb.y, 4, piece.x, piece.y, dimensions.fortPiece.s, dimensions.fortPiece.s)) {
                            enemy.removeShot(bomb.id); // TODO: this seems to be removing more than just that bullet...? id's not unique?
                            fort.breakPiece(piece.id);
                        }
                    });
                });
            });
        });
    }

    function load() {
        draw();
        starterShip.show();
        playerHitEnemyLogic(starterShip.enemiesToKill, starterShip.shotList);
        enemyLogic(starterShip.enemiesToKill);
        bulletLogic(starterShip.shotList);
        fortLogic();
        pointCounter.innerText = points.toString();
        bulletCounter.innerText = starterShip.bulletCount.toString();
        document.getElementById("shipHealth").innerText = starterShip.health;
        explosionList.forEach(exp => {
            exp.show();
            exp.deleteSelf();
        });
        explosionList = [];
    }

    function draw() {
        fill(0, 0, w, h, '#062c65');
    }



})();
