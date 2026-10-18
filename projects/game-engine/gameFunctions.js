function damagePlayer(damage) {
    playerStats.hp -= damage;
    if(playerStats.hp <= 0) {
        playerDie();
    }
}

function playerDie() {
    alert("You died!");
    playerStats.hp = playerStats.maxHp;
    player.x = currentPlayer.x;
    player.y = currentPlayer.y;
    player.body.setVelocityY(0);
}