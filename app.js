/**
 * Created by woodrat on 1/12/15.
 */
var stage = new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", stage);


var gameView = new createjs.Container();
gameView.x = 30;
gameView.y = 30;
stage.addChild(gameView);

var play = false;
var circleArr =  [[], [], [], [], [], [], [], [], []];
var currentCat;
var MOVE_NONE = -1, MOVE_LEFT = 0, MOVE_UP_LEFT = 1, MOVE_UP_RIGHT = 2, MOVE_RIGHT = 3,
    MOVE_DOWN_RIGHT =4, MOVE_DOWN_LEFT = 5;
var distanceMap = [];

function getMoveDir(cat){
    //left
    distanceMap = [];
    var flag = true;
    var x = cat._indexX, y = cat._indexY;
    for(;x>=0;x--){
        if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED){
            flag = false;
            distanceMap[MOVE_LEFT] = cat._indexX - x;
            break;
        }
    }
    if (flag){
        return MOVE_LEFT;
    }
    //left up
    flag = true;
    x = cat._indexX;y = cat._indexY;
    while (true) {
        if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            flag = false;
            distanceMap[MOVE_UP_LEFT] = cat._indexY - y;
            break;
        }
        if (y%2 == 0) {
            x--;
        }
        y--;
        if (y<0 || x<0) {
            break;
        }
    }
    if (flag){
        return MOVE_UP_LEFT;
    }
    //right up
    flag = true;
    x = cat._indexX;y = cat._indexY;
    while (true) {
        if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            flag = false;
            distanceMap[MOVE_UP_RIGHT] = cat._indexY - y;
            break;
        }
        if (y%2 == 1) {
            x++;
        }
        y--;
        if (y < 0 || x > 8) {
            break;
        }
    }
    if (flag){
        return MOVE_UP_RIGHT;
    }
    //right
    flag = true;
    x = cat._indexX;y = cat._indexY;
    for(;x < 9;x++){
        if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED){
            flag = false;
            distanceMap[MOVE_RIGHT] = x - cat._indexX;
            break;
        }
    }
    if (flag){
        return MOVE_RIGHT;
    }
    //right down
    flag = true;
    x = cat._indexX;y = cat._indexY;
    while (true) {
        if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            flag = false;
            distanceMap[MOVE_DOWN_RIGHT] = y - cat._indexY;
            break;
        }
        if (y%2 == 1) {
            x++;
        }
        y++;
        if (y > 8 || x > 8) {
            break;
        }
    }
    if (flag){
        return MOVE_DOWN_RIGHT;
    }
    //left down
    flag = true;
    x = cat._indexX;y = cat._indexY;
    while (true) {
        if (circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED)
        {
            flag = false;
            distanceMap[MOVE_DOWN_LEFT] = y - cat._indexY;
            break;
        }
        if (y%2 == 0) {
            x--;
        }
        y++;
        if (y > 8 || x < 0) {
            break;
        }
    }
    if (flag){
        return MOVE_DOWN_LEFT;
    }
    var maxDir = -1,maxValue = 0;
    for (var dir = 0;dir < distanceMap.length; dir++){
        if(distanceMap[dir] > maxValue){
            maxValue = distanceMap[dir];
            maxDir = dir;
        }
    }
    if (maxValue > 1){
        return maxDir;
    }
    else{
        return MOVE_NONE;
    }
}

function circleClicked (event) {
    if (play == false){
        playSound();
    }
    play = true;
    if (event.target.getCircleType() != Circle.TYPE_CAT) {
        event.target.setCircleType(Circle.TYPE_SELECTED);
    }
    else{
        return;
    }
    if (currentCat._indexX == 0 || currentCat._indexX == 8 ||
        currentCat._indexY == 0 || currentCat._indexY == 8)
    {
        alert("Game Over!");
        return;
    }
    var dir = getMoveDir(currentCat);
    switch (dir){
        case MOVE_LEFT:
            moveCat(circleArr[currentCat._indexX - 1][currentCat._indexY]);
            break;
        case MOVE_UP_LEFT:
            if (currentCat._indexY % 2 == 0) {
                moveCat(circleArr[currentCat._indexX - 1][currentCat._indexY - 1]);
            }
            else{
                moveCat(circleArr[currentCat._indexX][currentCat._indexY-1]);
            }
            break;
        case MOVE_UP_RIGHT:
            if (currentCat._indexY % 2 == 0){
                moveCat(circleArr[currentCat._indexX][currentCat._indexY-1]);
            }
            else{
                moveCat(circleArr[currentCat._indexX + 1][currentCat._indexY-1]);
            }
            break;
        case MOVE_RIGHT:
            moveCat(circleArr[currentCat._indexX + 1][currentCat._indexY]);
            break;
        case MOVE_DOWN_LEFT:
            if (currentCat._indexY % 2 == 0) {
                moveCat(circleArr[currentCat._indexX - 1][currentCat._indexY + 1]);
            }
            else{
                moveCat(circleArr[currentCat._indexX][currentCat._indexY + 1]);
            }
            break;
        case MOVE_DOWN_RIGHT:
            if (currentCat._indexY % 2 == 0){
                moveCat(circleArr[currentCat._indexX][currentCat._indexY + 1]);
            }
            else{
                moveCat(circleArr[currentCat._indexX + 1][currentCat._indexY + 1]);
            }
            break;
        default :
            alert("Game Over!");
            break;
    }
}

function moveCat (target_circle) {
        target_circle.setCircleType(Circle.TYPE_CAT);
        currentCat.setCircleType(Circle.TYPE_UNSELECTED);
        currentCat = target_circle;
}

function addCircles() {
    for (var _indexY = 0; _indexY < 9;_indexY++){
        for (var _indexX = 0; _indexX < 9;_indexX++){
            var c = new Circle();
            gameView.addChild(c);
            circleArr[_indexX][_indexY] = c;
            c.setCirclePos(_indexX, _indexY);

            if (_indexX == 4 && _indexY == 4) {
                c.setCircleType(Circle.TYPE_CAT);
                currentCat = c;
            }
            else if(Math.random() < 0.2) {
                c.setCircleType(Circle.TYPE_SELECTED);
            }

            c.addEventListener("click", circleClicked);
        }
    }
}

function startGame() {
    circleArr =  [[], [], [], [], [], [], [], [], []];
    addCircles();
}

addCircles();
var soundID = "Lollipop";
function loadSound() {
    createjs.Sound.registerSound("./Lollipop.mp3", soundID);
}
function playSound () {
    createjs.Sound.play(soundID);
}
loadSound();