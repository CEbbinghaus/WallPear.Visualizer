const DrawSide = {
    Mirror : 0,
    Top : 1,
    Bottom : 2
}
var CurrentSide = DrawSide.Top;

const DisplayType = {
    Curve : 0,
    Line : 1,
    Box : 2,
    Circle: 3,
    CircleAlt : 4,
    BoxAlt : 5,
    Bars : 6

};
var Display = DisplayType.Line;

const DrawType = {
    Line : 0,
    Fill : 1
};
var Draw = DrawType.Line;

const DrawMode = {
    center: 0,
    fit: 1,
    stretch: 2
}
var ImageMode = DrawMode.center;

var FRainbow = false;
var BRainbow = false;

const ColorType = {
    continuous: 0,
    rotating: 1,
    solid: 2,
    image: 3
}
var FColorType = ColorType.solid;
var BColorType = ColorType.solid;

var gradientSpeed = 0.0002;
var gradientSpeedB = 0.0002;

var colorIndices = [0,1,2,3];
var colorIndicesB = [0,1,2,3];

var step = 0;
var stepB = 0;

var Fade = true;
var FadeTime = 0.8;


var YPosition = Height / 2;

var Radius = 1;

var FGC = "#FFFFFF";
var BGC = "#212121"

var image = {
    isLoaded : false,
    img : new Image(),
    color: "#212121",
    height : 0,
    width : 0,
    pickCol : false
}

var Mouse = {
    isDown : false,
    x : 0,
    y : 0
}

var colors = new Array(
    [62,35,255],
    [60,255,60],
    [255,35,98],
    [45,175,230],
    [255,0,255],
    [255,128,0]
);

var ColorOffset = 0;
var ColorOffsetB = 0;

var LineWith = 20;

var multiplier = 0.2;

var CustomCol = false;

var Ajust = false;

var Width;
var Height;

var lastTime = 0;
var DeltaTime = 0;

const c = d("c");
const ctx = c.getContext("2d");

var Audio = [];

for(let i = 0; i < 64; i++){
    Audio.push({
        x:i * (window.innerWidth / 64) + (window.innerWidth / 64) / 2,
        y:0,
        iy:0
    });
}

window.onload = function() {
    document.body.style.overflow = 'hidden';
    Width = window.innerWidth;
    Height = window.innerHeight
    window.wallpaperRegisterAudioListener(wallpaperAudioListener);
    if(c.width != window.innerWidth)c.width = window.innerWidth;
    if(c.height != window.innerHeight)c.height = window.innerHeight;
};

window.addEventListener("mousemove", e => {
    Mouse.x = event.clientX;
    Mouse.y = event.clientY;
});
window.addEventListener("mousedown",()=>Mouse.isDown = true);
window.addEventListener("mouseup",()=>Mouse.isDown = false);

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.FadeAmount) {
            FadeTime = properties.FadeAmount.value / 100;
        }
        if(properties.Visualizer){
            Display = properties.Visualizer.value
            ctx.clearRect(0, 0, Width, Height)
        }
        if(properties.Fade){
            Fade = properties.Fade.value;
        }
        if(properties.draw){
            Draw = properties.draw.value
            ctx.clearRect(0, 0, Width, Height)
        }
        if(properties.Radius){
            Radius = properties.Radius.value / 100;
        }
        if(properties.DrawSide){
            CurrentSide = properties.DrawSide.value
            ctx.clearRect(0, 0, Width, Height)
        }
        if(properties.multiplier){
            multiplier = properties.multiplier.value / 100
        }
        if(properties.ypos){
            YPosition = properties.ypos.value / 1000 * Height;
            ctx.clearRect(0, 0, Width, Height)
        }
        if(properties.Rainbow){
            isRainbow = properties.Rainbow.value
        }
        if(properties.Fcol){
            FGC = getHEX(properties.Fcol.value)
        }
        if(properties.Bcol){
            document.bgColor = getHEX(properties.Bcol.value)
            ctx.clearRect(0, 0, Width, Height)
            BGC = getHEX(properties.Bcol.value)
        }
        if(properties.Line){
            LineWith = properties.Line.value
        }
        if(properties.CustomCol){
            CustomCol = properties.CustomCol.value
            ctx.clearRect(0, 0, Width, Height)
        }
        if(properties.FGColorType){
            FColorType = properties.FGColorType.value
        }
        if(properties.BGColorType){
            BColorType = properties.BGColorType.value
        }
        if(properties.Speed){
            gradientSpeed = properties.Speed.value / 10000
        }
        if(properties.BSpeed){
            gradientSpeedB = properties.BSpeed.value / 10000
        }
        if(properties.Col0){
            colors[0] = getRGBArr(properties.Col0.value)
        }
        if(properties.Col1){
            colors[1] = getRGBArr(properties.Col1.value)
        }
        if(properties.Col2){
            colors[2] = getRGBArr(properties.Col2.value)
        }
        if(properties.Col3){
            colors[3] = getRGBArr(properties.Col3.value)
        }
        if(properties.Col4){
            colors[4] = getRGBArr(properties.Col4.value)
        }
        if(properties.Col5){
            colors[5] = getRGBArr(properties.Col5.value)
        }
        if(properties.test){
            ctx.clearRect(0, 0, Width, Height)
        }
        if(properties.Ajust){
            Ajust = properties.Ajust.value
        }
        if(properties.drawMode){
            ctx.clearRect(0, 0, Width, Height)
            ImageMode = properties.drawMode.value
        }
        if(properties.pickCol){
            image.pickCol = true;
        }
        if(properties.img){
            ctx.clearRect(0, 0, Width, Height)
            console.log('url(file:///img)'.replace('img',properties.img.value))
            let url = properties.img.value;
            url = url.replace(/%3A/g, ":")
            url = url.replace(/%20/g, " ")
            console.log(url)
            image.isLoaded = false;
            image.img.onload = () => {
                let rat = image.img.width / image.img.height;
                image.isLoaded = true;
                let hRatio = Width / image.img.width;
                let vRatio = Height / image.img.height;
                let ratio  = Math.min ( hRatio, vRatio );
                image.width = image.img.width * ratio;
                image.height = image.img.height * ratio;
            }
            image.img.src = url;
        }
    }
};


function wallpaperAudioListener(audioArray) {
    ColorOffset += 0.001
    let MaxHeight = multiplier * (Height / 2) / 2
    let BlockRad = (Width / 128) * Radius

    totalAmount = 0;
    audioArray.forEach(e => {
        if(e > 1){
            e = 1;
        }
        totalAmount += e
    });
    if(!Fade){
        ctx.clearRect(0, 0, Width, Height);
        if(BColorType != ColorType.image){
            BGColor()
            ctx.fillRect(0, 0, Width, Height)
        }else{
            if(image.isLoaded){
                ctx.fillStyle = image.color
                ctx.fillRect(0, 0, Width, Height)
                drawImage()
            }
        }
    }else{
        ctx.globalAlpha = FadeTime;
        if(BColorType != ColorType.image){
            BGColor()
            ctx.fillRect(0, 0, Width, Height)
        }else{
            if(image.isLoaded){
                ctx.fillStyle = image.color
                ctx.fillRect(0, 0, Width, Height)
                drawImage()
            }
        }
        ctx.globalAlpha = 1;
    }

    if(image.pickCol){
        if(Mouse.isDown){

            let d = ctx.getImageData(Mouse.x, Mouse.y, 1, 1)
            image.color = rgbtoHex(`rgb(${d.data[0]},${d.data[0]},${d.data[0]})`);
            console.log(image.color)
            image.pickCol = false;
        }
    }

    if(totalAmount == audioArray.length || totalAmount <= 0.3){
        return;
    }

    let Left = audioArray.slice(0, 63)
    let Right = audioArray.slice(63, 127)

    let Average = new Array(64);
    for(let i = 0; i < audioArray.length / 2 ;i++){
        Average[i] = Math.max(Right[i], Left[i])
    }

    if(Ajust){
        let max = 0;
        Average.forEach(e => {
            if(e > max){
                max = e
            }
        })
        let multi = multiplier / max;
        Average.forEach((e, i) => {
            Average[i] = e * multi
        })
    }

    Average.forEach((e, i) => {
        Audio[i].y = e * MaxHeight + YPosition;
        Audio[i].iy = -(e*MaxHeight) + YPosition;
    })

    var barWidth = Math.round(1.0 / 128.0 * Width) * 2;
    var halfCount = audioArray.length / 2;

    ctx.lineWidth=LineWith;
    FGColor()


    switch(Display){
        case DisplayType.Curve:
            if(CurrentSide == DrawSide.Top || CurrentSide == DrawSide.Mirror){
                drawLine(true, true)
            }
            if(CurrentSide == DrawSide.Bottom || CurrentSide == DrawSide.Mirror){
                drawLine(true, false)
            }
        break;
        case DisplayType.Line:
            if(CurrentSide == DrawSide.Top || CurrentSide == DrawSide.Mirror){
                drawLine(false, true)
            }
            if(CurrentSide == DrawSide.Bottom || CurrentSide == DrawSide.Mirror){
                drawLine()
            }
        break;
        case DisplayType.Box:
            Audio.forEach((p, i) => {
                if(CurrentSide == DrawSide.Bottom || CurrentSide == DrawSide.Mirror){
                    drawRect(p.x, p.y, BlockRad)
                }
                if(CurrentSide == DrawSide.Top || CurrentSide == DrawSide.Mirror){
                    drawRect(p.x, p.iy, BlockRad)
                }
            })
        break;
        case DisplayType.Circle:
            Audio.forEach((p, i) => {
                if(CurrentSide == DrawSide.Top || CurrentSide == DrawSide.Mirror){
                    drawCircle(p.x, p.iy, BlockRad)
                }
                if(CurrentSide == DrawSide.Bottom || CurrentSide == DrawSide.Mirror){
                    drawCircle(p.x, p.y, BlockRad)
                };
            })
        break;
        case DisplayType.CircleAlt:
            Average.forEach(e => {
                drawCircle(Width / 2, Height / 2, e * MaxHeight)
            })
        break;
        case DisplayType.BoxAlt:
            Average.forEach(e => {
                drawRect(Width / 2, Height / 2, e * MaxHeight)
            })
        break;
        case DisplayType.Bars:
            Audio.forEach((p, i) => {
                if(CurrentSide == DrawSide.Top){
                    drawBar(p.x, YPosition, -(Average[i] * MaxHeight), BlockRad * 2)
                }
                if(CurrentSide == DrawSide.Bottom){
                    drawBar(p.x, YPosition, Average[i] * MaxHeight, BlockRad * 2)
                }
                if(CurrentSide == DrawSide.Mirror){
                    drawBar(p.x, p.iy, Average[i] * MaxHeight * 2, BlockRad * 2)
                }
            })
        break;
    }
    let ct = Date.now();
    DeltaTime = ct - lastTime;
    lastTime = ct;
    //console.log(`Done and it only took me ${DeltaTime} ms`)
}

function drawImage(){
    switch(ImageMode){
        case DrawMode.center:
            ctx.drawImage(image.img, Width / 2 - image.img.width / 2, Height / 2 - image.img.height / 2, image.img.width, image.img.height)
        break;
        case DrawMode.fit:
            ctx.drawImage(image.img, (Width / 2) - (image.width / 2), (Height / 2) - (image.height / 2), image.width, image.height)
        break;
        case DrawMode.stretch:
        ctx.drawImage(image.img, 0, 0, Width, Height)
        break;
    }
}

function drawBar(x, y, h, w){
 if(Draw == DrawType.Line){
    ctx.strokeRect(x, y, w, h)
 }else{
    ctx.fillRect(x, y, w, h)
 }
}

function drawRect(x, y, r){
    if(Draw == DrawType.Fill){
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }else if(Draw == DrawType.Line){
        ctx.strokeRect(x - r, y - r, r * 2, r * 2);
    }
}

function drawCircle(x, y, r){
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2*Math.PI);
    if(Draw == DrawType.Line){
        ctx.stroke()
    } else if(Draw == DrawType.Fill){
        ctx.fill()
    }
}

function rgbtoHex(s){
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(s)){
        return s
    }
    let r = s.replace(/(rgb\()|(\))/g, "")
    r = r.split(",")
    r.forEach((c, i) => {
         r[i] = parseInt(c).toString(16)
         if(r[i].length < 2){
             r[i] = "0" + r[i];
         }
    })
    return "#" + r.join("")
}

function getHEX(v){
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(v)){
        return v
    }
    let j = v.split(" ")
    for(let i = 0; i < j.length; i++){
        j[i] = parseFloat(j[i]) * 255
        j[i] = j[i].toString(16);
        if(j[i].length < 2){
            j[i] = "0" + j[i]
        }
    }
    return j = "#" + j.join("")
}

function test(k){
    let u = k;
    u.forEach((b, i) => {
        u[i] = b.toString(16)
    })
    return "#" + u.join("")
}

function getRGBArr(v){
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(v)){
        let k = v.split("#")
        k = k[1]
        k = k.split("")
        let r = k[0] + k[1]
        let g = k[2] + k[3]
        let b = k[4] + k[5]
        let rn = parseInt(r, 16)
        let gn = parseInt(g, 16)
        let bn = parseInt(b, 16)
        let retar = [rn, gn, bn]
        return retar
    }else{
        j = v.split(" ")
        for(let i = 0; i < j.length; i++){
            j[i] = parseFloat(j[i]) * 255
        }
        return j
    }
}

function drawLine(smooth, inverted){
    if(!inverted){
        inverted = false;
    }
    if(!smooth){
        smooth = false;
    }
    if(!smooth){
        if(inverted){
            ctx.beginPath();
            ctx.moveTo(0, YPosition);
            ctx.lineTo(Audio[0].x, Audio[0].iy);
            for (i = 1; i < Audio.length - 1; i ++)
            {
                ctx.lineTo(Audio[i].x, Audio[i].iy);
            }
            ctx.lineTo(Width, YPosition);
        }else{
            ctx.beginPath();
            ctx.moveTo(0, YPosition);
            ctx.lineTo(Audio[0].x, Audio[0].y);
            for (i = 1; i < Audio.length - 1; i ++)
            {
                ctx.lineTo(Audio[i].x, Audio[i].y);
            }
            ctx.lineTo(Width, YPosition);
        }
    }else{
        if(inverted){
            ctx.beginPath();
            ctx.moveTo(0, YPosition);
            for (i = 1; i < Audio.length - 2; i ++)
            {
                var xc = (Audio[i].x + Audio[i + 1].x) / 2;
                var yc = (Audio[i].iy + Audio[i + 1].iy) / 2;
                ctx.quadraticCurveTo(Audio[i].x, Audio[i].iy, xc, yc);
            }
            ctx.quadraticCurveTo(Audio[i].x, Audio[i].iy, Width, YPosition);
            ctx.lineTo(Width, YPosition);
        }else{
            ctx.beginPath();
            ctx.moveTo(0, YPosition);
            for (i = 1; i < Audio.length - 2; i ++)
            {
                var xc = (Audio[i].x + Audio[i + 1].x) / 2;
                var yc = (Audio[i].y + Audio[i + 1].y) / 2;
                ctx.quadraticCurveTo(Audio[i].x, Audio[i].y, xc, yc);
            }
            ctx.quadraticCurveTo(Audio[i].x, Audio[i].y, Width, YPosition);
            ctx.lineTo(Width, YPosition); 
        }
    }
    if(Draw == DrawType.Fill){
        ctx.fill()
    } else if(Draw == DrawType.Line){
        ctx.stroke()
    }
}

function d(l){
    return document.getElementById(l);
}

function loadImage(l){

}

function FGColor(){
    if(CustomCol){
        if(Display == DisplayType.CircleAlt || Display == DisplayType.BoxAlt){
            var grd=ctx.createRadialGradient(Width / 2,Height / 2,1,Width / 2,Height / 2,multiplier * (Height / 2));
        }else{
            var grd=ctx.createLinearGradient(0,0,Width,0);
        }
        switch(FColorType){
            case ColorType.rotating:
            var c0_0 = colors[colorIndices[0]];
            var c0_1 = colors[colorIndices[1]];
            var c1_0 = colors[colorIndices[2]];
            var c1_1 = colors[colorIndices[3]];

            var istep = 1 - step;
            var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
            var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
            var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
            var color1 = "rgb("+r1+","+g1+","+b1+")";

            var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
            var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
            var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
            var color2 = "rgb("+r2+","+g2+","+b2+")";

            step += gradientSpeed * 10;
            if ( step >= 1 )
            {
                step %= 1;
                colorIndices[0] = colorIndices[1];
                colorIndices[2] = colorIndices[3];
                colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
                colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
            }
            grd.addColorStop(0,color1);
            grd.addColorStop(1,color2);
            ctx.fillStyle=grd;
            ctx.strokeStyle=grd;
            break;
            case ColorType.continuous:
                i = 0;
                for(let i = 0; i < 6; i++){
                    let pos = (Width / 6 * i) / Width;
                    pos += ColorOffset;
                    pos %= 1;
                    grd.addColorStop(pos,`rgb(${colors[i][0]},${colors[i][1]},${colors[i][2]})`);
                }
                ColorOffset += gradientSpeed;
                ctx.fillStyle=grd;
                ctx.strokeStyle=grd;
            break;
            case ColorType.solid:
            ctx.fillStyle=FGC;
            ctx.strokeStyle=FGC;
            break;
        }
    }else{
        ctx.strokeStyle="#ffffff";
        ctx.fillStyle="#ffffff";
    }
}

function BGColor(){
    if(CustomCol){
        if(Display ==  DisplayType.CircleAlt || Display == DisplayType.BoxAlt){
            var grd=ctx.createRadialGradient(Width / 2,Height / 2,1,Width / 2,Height / 2,Height / 2);
        }else{
            var grd=ctx.createLinearGradient(0,0,Width,0);
        }
        switch(BColorType){
            case ColorType.rotating:
            var c0_0 = colors[colorIndicesB[0]];
            var c0_1 = colors[colorIndicesB[1]];
            var c1_0 = colors[colorIndicesB[2]];
            var c1_1 = colors[colorIndicesB[3]];

            var istep = 1 - stepB;
            var r1 = Math.round(istep * c0_0[0] + stepB * c0_1[0]);
            var g1 = Math.round(istep * c0_0[1] + stepB * c0_1[1]);
            var b1 = Math.round(istep * c0_0[2] + stepB * c0_1[2]);
            var color1 = "rgb("+r1+","+g1+","+b1+")";

            var r2 = Math.round(istep * c1_0[0] + stepB * c1_1[0]);
            var g2 = Math.round(istep * c1_0[1] + stepB * c1_1[1]);
            var b2 = Math.round(istep * c1_0[2] + stepB * c1_1[2]);
            var color2 = "rgb("+r2+","+g2+","+b2+")";

            stepB += gradientSpeedB * 10;
            if ( stepB >= 1 )
            {
                stepB %= 1;
                colorIndicesB[0] = colorIndicesB[1];
                colorIndicesB[2] = colorIndicesB[3];
                colorIndicesB[1] = ( colorIndicesB[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
                colorIndicesB[3] = ( colorIndicesB[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
            }
            grd.addColorStop(0,color1);
            grd.addColorStop(1,color2);
            ctx.fillStyle=grd;
            break;
            case ColorType.continuous:
                for(let i = 0; i < 6; i++){
                    let pos = (Width / 6 * i) / Width;
                    pos += ColorOffsetB;
                    pos %= 1;
                    grd.addColorStop(pos,`rgb(${colors[i][0]},${colors[i][1]},${colors[i][2]})`)
                }
                ColorOffsetB += gradientSpeedB;
                ctx.fillStyle=grd;
            break;
            case ColorType.solid:
            ctx.fillStyle=BGC;
            break;
        }
    }else{
        ctx.fillStyle="#212121";
    }
}