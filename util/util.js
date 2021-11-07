const c = document.getElementById('canvas');
const cc = c.getContext('2d');

function drawCircle(x, y, r, c) {
    cc.fillStyle = c;
    cc.beginPath();
    cc.arc(x, y, r, 0, Math.PI * 2);
    cc.stroke();
}

function square(x, y, w, h, c) {
    cc.strokeStyle = c;
    cc.lineWidth = 1;
    cc.strokeRect(x, y, w, h);
}

function fill(x, y, w, h, c) {
    cc.fillStyle = c;
    cc.fillRect(x, y, w, h);
}