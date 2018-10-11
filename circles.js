

let frameCount=0;
let speed=0.00005;
let fadeInterval=10000000;
const mathsPerFrame=5000;
const initialVelocityFactor=0.0001;

let can=document.getElementById('circles');
let w=$(can).width();
let h=$(can).height();
can.width=w;
can.height=h;
let ctx=can.getContext('2d');
let resizing=false;
let canFade=document.createElement('canvas');
canFade.width=w;
canFade.height=h;
let ctxFade=canFade.getContext('2d');
ctx.strokeStyle="#fff";
ctxFade.strokeStyle="#fff";
ctxFade.fillStyle="rgba(0,0,0,0.2)";

let data=[
    {
        x:400,
        y:500,
        vx:0*initialVelocityFactor,
        vy:0*initialVelocityFactor,
        lastax:0,
        lastay:0,
        r:10,
        m:1
    },
    {
        x:600,
        y:400,
        vx:-1*initialVelocityFactor,
        vy:0*initialVelocityFactor,
        lastax:0,
        lastay:0,
        r:10,
        m:1
    },
    {
        x:600,
        y:360,
        vx:1*initialVelocityFactor,
        vy:0*initialVelocityFactor,
        lastax:0,
        lastay:0,
        r:10,
        m:1
    },
    {
        x:600,
        y:500,
        vx:0*initialVelocityFactor,
        vy:0*initialVelocityFactor,
        lastax:0,
        lastay:0,
        r:10,
        m:1
    },
    {
        x:400,
        y:600,
        vx:0*initialVelocityFactor,
        vy:0*initialVelocityFactor,
        lastax:0,
        lastay:0,
        r:10,
        m:1
    },
    {
        x:400,
        y:600,
        vx:0*initialVelocityFactor,
        vy:0*initialVelocityFactor,
        lastax:0,
        lastay:0,
        r:10,
        m:1
    }
]

$(window).resize(function(){
    resizing=true;
});

randomizeData();
multiloop();

function multiloop(){
    if(resizing){
        resizing=false;
        w=$(can).width();
        h=$(can).height();
        ctx.canvas.width=w;
        ctx.canvas.height=h;
        ctxFade.canvas.width=w;
        ctxFade.canvas.height=h;
        randomizeData();
        ctx.strokeStyle="#fff";
        ctxFade.strokeStyle="#fff";
        ctxFade.fillStyle="rgba(0,0,0,0.2)";
    }
    frameCount++;
    ctxFade.fillRect(0,0,w,h);
    ctx.clearRect(0,0,w,h);
    ctx.drawImage(canFade,0,0);
    for(let i=0;i<mathsPerFrame;i++){
        calculateMovement();
        move();

    }
    drawCircles();
    requestAnimationFrame(multiloop);
}

function randomizeData(){
    for(let i=0;i<data.length;i++){
        data[i].x=getRandomXPos();
        data[i].y=getRandomYPos();
        data[i].lastax=0;
        data[i].lastay=0;
        data[i].vx=0;
        data[i].vy=0;
    }
}

function calculateMovement(){
    let dx=0;
    let dy=0;
    let dsq=0;
    let f=0;
    let ax=0;
    let ay=0;
    for(let i=0;i<data.length-1;i++){
        for(let j=i+1;j<data.length;j++){
            dx=data[i].x-data[j].x;
            dy=data[i].y-data[j].y;
            dsq=Math.pow(dx,2)+Math.pow(dy,2);
            f=1/dsq;
            if(f>20) f=20;
            d=Math.sqrt(dsq);
            ax=speed*f*dx/d;
            ay=speed*f*dy/d;
            data[i].vx-=(ax+data[i].lastax)/2;
            data[i].lastvx=ax;
            data[i].vy-=(ay+data[i].lastay)/2;
            data[i].lastvy=ay;
            data[j].vx+=(ax+data[j].lastax)/2;
            data[j].lastvx=ax;
            data[j].vy+=(ay+data[j].lastay)/2;
            data[j].lastvy=ay;
        }
    }
}

function move(){
    for(let i=0;i<data.length;i++){
        data[i].x+=data[i].vx;
        data[i].y+=data[i].vy;
        if(data[i].x<0 || data[i].x>w){
            data[i].x=getRandomXPos();
            data[i].y=getRandomYPos();
            data[i].lastax=0;
            data[i].lastay=0;
            data[i].vx=0;
            data[i].vy=0;
            
        }
        if(data[i].y<0 || data[i].y>h){
            data[i].x=getRandomXPos();
            data[i].y=getRandomYPos();
            data[i].lastax=0;
            data[i].lastay=0;
            data[i].vx=0;
            data[i].vy=0;
        }
    }
}

function getRandomXPos(){
    return Math.random()*200+(w/2-100)
}

function getRandomYPos(){
    return Math.random()*200+(h/2-100)
}

function drawCircles(){
    ctx.beginPath();
    if(frameCount%fadeInterval==0){
        ctxFade.beginPath();
    }
    for(let i=0;i<data.length;i++){
        ctx.moveTo(data[i].x+data[i].r,data[i].y);
        ctx.arc(data[i].x,data[i].y,data[i].r,0,Math.PI*2);
        if(frameCount%fadeInterval==0){
            ctxFade.moveTo(data[i].x+data[i].r,data[i].y);
            ctxFade.arc(data[i].x,data[i].y,data[i].r,0,Math.PI*2);
        }
    }
    ctx.stroke();
    if(frameCount%fadeInterval==0){
        ctxFade.stroke();
    }
}