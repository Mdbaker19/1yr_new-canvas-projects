(() => {

    // import { stuff from util.js } from ../util/util why doesnt this work when module script is added? anyone there ?..

    const colorSlide = document.getElementById('color');
    const sizeSlide = document.getElementById('scale');
    const yPosition = document.getElementById('yPosition');
    const xPosition = document.getElementById('xPosition');
    const multiplier = document.getElementById('multiplier');
    const changeShape = document.getElementById('circle-square');
    const spacer = document.getElementById('spacing');
    const options = document.getElementsByClassName('directionButtons');
    const width = c.width;
    const height = c.height;
    let baseAmount = parseInt(sizeSlide.value) * 3;
    let spacing = parseInt(spacer.value);
    let baseMult = parseInt(multiplier.value) / 1000;
    let startPositionX = parseInt(xPosition.value);
    let startPositionY = parseInt(yPosition.value);
    let color = "#d7d770";

    let up = false;
    let down = false;
    let left = false;
    let right = false;

    let circle = false;

    Array.from(options).forEach(button => button.addEventListener("click", () => {
        let text = button.innerText;
        switch (text) {
            case "Up":
                up = !up;
                break;
            case "Down":
                down = !down;
                break;
            case "Left":
                left = !left;
                break;
            case "Right":
                right = !right;
                break;
        }
        load();
    }));


    load();

    colorSlide.addEventListener('input', () => {
        color = genColorFromRange(parseInt(colorSlide.value));
        baseAmount = parseInt(sizeSlide.value) * 3;
        load();
    });

    spacer.addEventListener('input', () => {
        spacing = parseInt(spacer.value);
        load();
    });

    multiplier.addEventListener('input', () => {
        baseMult = parseInt(multiplier.value) / 1000;
        baseAmount = parseInt(sizeSlide.value) * 3;
        load();
    });

    sizeSlide.addEventListener('input', () => {
        baseAmount = parseInt(sizeSlide.value) * 3;
        load();
    });

    xPosition.addEventListener('input', () => {
        startPositionX = parseInt(xPosition.value);
        baseAmount = parseInt(sizeSlide.value) * 3;
        load();
    });

    yPosition.addEventListener('input', () => {
        startPositionY = parseInt(yPosition.value);
        baseAmount = parseInt(sizeSlide.value) * 3;
        load();
    });

    changeShape.addEventListener('change', () => {
        circle = changeShape.checked;
        load();
    });

    function load() {
        draw();
    }

    function draw() {
        fill(0, 0, width, height, "#000");
        recurseCall(startPositionX, startPositionY, color, baseAmount);
    }

    function recurseCall(x, y, colors, base) {
        circle ? drawCircle(x, y, base, colors): square(x, y, base, base, colors);
        if(base > 2) {
            if(right) recurseCall(x + base + spacing, y, colors, base * baseMult);
            if(left) recurseCall(x - base + spacing, y, colors, base * baseMult);
            if(up) recurseCall(x, y - base + spacing, colors, base * (baseMult * .5));
            if(down) recurseCall(x, y + base + spacing, colors, base * (baseMult * .5));
        }
    }


    function genColorFromRange(range) {
        let out = "rgb(";
        for(let i = 0; i < 3; i++) {
            out += ~~(Math.random() * convert(range)) + 55;
            out += ",";
        }
        out = out.substring(0, out.length - 1);
        out += ")";
        return out;
    }

    function convert(num) {
        let n = 256 * (num / 100);
        return n > 200 ? 200 : n;
    }



})();