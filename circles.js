

let frameCount = 0;
let speed = 4000;
let fadeInterval = 1;
let mathsPerFrame = 1;
let initialVelocityFactor = 1;
let randomness = 0;
let forceCutoff = 0.00005;
let t0 = performance.now();
let can = document.getElementById('circles');
let w = $(can).width();
let h = $(can).height();
can.width = w;
can.height = h;
let ctx = can.getContext('2d');
let resizing = false;
let canFade = document.createElement('canvas');
canFade.width = w;
canFade.height = h;
let ctxFade = canFade.getContext('2d');
ctx.strokeStyle = "#fff";
ctx.fillStyle = '#fff';
ctx.lineWidth = 2;
ctxFade.strokeStyle = "#fff";
ctxFade.fillStyle = "rgba(0,0,0,0.1)";
let circleCount = 12;
let radius = 10;
let deterministic=false;

let data = [
]

$(window).resize(function () {
    resizing = true;
});

loadPreset(0)
bindButtons();
initializeData();
multiloop();

function bindButtons(){
    let buttons=$('.buttonbar').children();
    for(let i=0;i<buttons.length;i++){
        $(buttons[i]).click(function(e){
            $('.buttonbar').find('.active').removeClass('active');
            $(e.currentTarget).addClass('active')
            loadPreset(i);
        })
    }
    $('.buttonbar2').children().first().click(function(e){
        deterministic=false;
        $('.buttonbar2').find('.active').removeClass('active');
        $(e.currentTarget).addClass('active')
        initializeData();
    })
    $('.buttonbar2').children().last().click(function(e){
        deterministic=true;
        $('.buttonbar2').find('.active').removeClass('active');
        $(e.currentTarget).addClass('active')
        initializeData();
    })
}

function loadPreset(id) {
    switch (id) {
        case 0:
            fadeInterval = 1
            speed = 10000
            circleCount = 4;
            radius = 10
            forceCutoff = 0.00002;
            break;
        case 1:
            fadeInterval = 1
            speed = 2000
            circleCount = 9;
            radius = 10
            forceCutoff = 0.00005;
            break;
        case 2:
            fadeInterval = 1
            speed = 1000
            circleCount = 16;
            radius = 10
            forceCutoff = 0.00005;
            break;
        case 3:
            fadeInterval = Number.MAX_SAFE_INTEGER;
            forceCutoff = 0.00005;
            speed = 2000
            circleCount = 36;
            radius = 10
            break;
        case 4:
            forceCutoff = 0.00001
            fadeInterval = Number.MAX_SAFE_INTEGER;
            speed = 500
            circleCount = 100;
            radius = 2
            break;
        case 5:
            fadeInterval = Number.MAX_SAFE_INTEGER
            speed = 200
            forceCutoff = 0.000002
            circleCount = 529
            radius = 2
            break;
        case 6:
            fadeInterval = Number.MAX_SAFE_INTEGER
            speed = 200
            forceCutoff = 0.000001
            circleCount = 1089
            radius = 2
            break;
    }
    initializeData();
}

function multiloop() {
    if (resizing) {
        resizing = false;
        w = $(can).width();
        h = $(can).height();
        ctx.canvas.width = w;
        ctx.canvas.height = h;
        ctxFade.canvas.width = w;
        ctxFade.canvas.height = h;
        initializeData();
        ctx.strokeStyle = "#fff";
        ctx.fillStyle = '#fff';
        ctxFade.strokeStyle = "#fff";
        ctxFade.fillStyle = "rgba(0,0,0,0.2)";
    }
    frameCount++;
    ctxFade.fillRect(0, 0, w, h);
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(canFade, 0, 0);
    for (let i = 0; i < mathsPerFrame; i++) {
        calculateMovement();
        move();

    }
    drawCircles();
    // ctx.fillText(Math.round(1/((performance.now()-t0)/1000)),10,10);
    // t0=performance.now();
    requestAnimationFrame(multiloop);
}


function initializeData() {
    ctxFade.clearRect(0,0,w,h)
    data=[];
    if(deterministic){
        let perRow=Math.sqrt(circleCount);
        let widthPerCircle=(w/2)/(perRow-1);
        let heightPerCircle=(h/2)/(perRow-1);
        for (let i = 0; i < circleCount; i++) {
            data.push({
                x: w/4+(i%perRow)*widthPerCircle,
                y: h/4+Math.floor(i/perRow)*heightPerCircle,
                lastax: 0,
                lastay: 0,
                vx: (randomness * (Math.random() - 0.5)) * initialVelocityFactor,
                vy: (randomness * (Math.random() - 0.5)) * initialVelocityFactor
            })
        }
    }else{
        for (let i = 0; i < circleCount; i++) {
            data.push({
                x: getRandomXPos(),
                y: getRandomYPos(),
                lastax: 0,
                lastay: 0,
                vx: (randomness * (Math.random() - 0.5)) * initialVelocityFactor,
                vy: (randomness * (Math.random() - 0.5)) * initialVelocityFactor
            })
        }
    }
    
}

function calculateMovement() {
    let dx = 0;
    let dy = 0;
    let dsq = 0;
    let f = 0;
    let ax = 0;
    let ay = 0;
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            dx = data[i].x - data[j].x;
            dy = data[i].y - data[j].y;
            dsq = Math.pow(dx, 2) + Math.pow(dy, 2);
            f = 1 / dsq;
            if (f > forceCutoff) f = forceCutoff;
            d = Math.sqrt(dsq);
            ax = speed * f * dx / d;
            ay = speed * f * dy / d;
            data[i].vx -= (ax + data[i].lastax) / 2;
            data[i].lastvx = ax;
            data[i].vy -= (ay + data[i].lastay) / 2;
            data[i].lastvy = ay;
            data[j].vx += (ax + data[j].lastax) / 2;
            data[j].lastvx = ax;
            data[j].vy += (ay + data[j].lastay) / 2;
            data[j].lastvy = ay;
        }
    }
}

function move() {
    for (let i = 0; i < data.length; i++) {
        data[i].x += data[i].vx;
        data[i].y += data[i].vy;
        if(!deterministic){
            if (data[i].x < 0 || data[i].x > w) {
                data[i].x = getRandomXPos();
                data[i].y = getRandomYPos();
                data[i].lastax = 0;
                data[i].lastay = 0;
                data[i].vx = (randomness * (Math.random() - 0.5)) * initialVelocityFactor;
                data[i].vy = (randomness * (Math.random() - 0.5)) * initialVelocityFactor;
    
            }
            if (data[i].y < 0 || data[i].y > h) {
                data[i].x = getRandomXPos();
                data[i].y = getRandomYPos();
                data[i].lastax = 0;
                data[i].lastay = 0;
                data[i].vx = (randomness * (Math.random() - 0.5)) * initialVelocityFactor;
                data[i].vy = (randomness * (Math.random() - 0.5)) * initialVelocityFactor;
            }
        }
        
    }
}

function getRandomXPos() {
    return Math.random() * w / 2 + (w / 4)
}

function getRandomYPos() {
    return Math.random() * h / 2 + (h / 4)
}

function drawCircles() {
    ctx.beginPath();
    if (frameCount % fadeInterval == 0) {
        ctxFade.beginPath();
    }
    for (let i = 0; i < data.length; i++) {
        ctx.moveTo(data[i].x + radius, data[i].y);
        ctx.arc(data[i].x, data[i].y, radius, 0, Math.PI * 2);
        if (frameCount % fadeInterval == 0) {
            ctxFade.moveTo(data[i].x + radius, data[i].y);
            ctxFade.arc(data[i].x, data[i].y, radius, 0, Math.PI * 2);
        }
    }
    ctx.stroke();
    if (frameCount % fadeInterval == 0) {
        ctxFade.stroke();
    }
}