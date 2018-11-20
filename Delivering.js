//初始化p,s,c对象
var p = []; var s = []; var c = [];
//p,s,c对象计数
var pi = 0; var si = 0; var ci = 0;
var capacity = 4;
var savingSheetS = new Array();     //初始化节约表
var Temp = new Object();            //p,s距离最近
var pathSheet = new Array();        //初始化路径表
var pathArrayofSavingSheetS = new Array(); //每个节约表得到的路径
var clickChoice = 0;
var dPC = new Array();
var pathArrayofSavingSheetFinal = new Array();
/* -----Function Area-----*/
//点击
function cnvs_getCoordinates(e)
{
    var x = e.clientX;
    var y = e.clientY;
    clickOn(x,y);
}
function clickPost()
{
    clickChoice = 1;
}

function clickShop()
{
    clickChoice = 2;
}

function clickCustomer()
{
    clickChoice = 3;
}

function clickReset()
{
    clickChoice = 0;
}

function clickOn(ax,by)
{
    if(clickChoice == 1)         //1为配送
    {
        //点击动画
            var appearP = document.createElement("img");
            appearP.src="icon%20RE/deliver_fill2.png";
            appearP.id = "pointP"+(pi+1);
            appearP.style.width="30px";
            appearP.style.height="30px";
            appearP.style.position="absolute";
            appearP.style.left=(ax-15)+"px";
            appearP.style.top=(by-15)+"px";
            appearP.style.zIndex="2";
            appearP.style.transition="all .5s ease";
            appearP.style.opacity="0.7";
            appearP.style.animation="myfirst 0.75s";
            var elementP=document.getElementById("wrapper");
            elementP.appendChild(appearP);

        //

        p[pi] = new Object();
        p[pi].x = ax;
        p[pi].y = by;
        p[pi].name = "p"+(pi+1);
        console.log("配送员"+(pi+1)+"坐标为("+p[pi].x+","+p[pi].y+")");
        pi++;
    }
    if(clickChoice == 2)         //2为门店
    {
        //点击动画
        var appearS = document.createElement("img");
        appearS.src="icon%20RE/shopfill.png";
        appearS.id = "pointS"+(si+1);
        appearS.style.width="30px";
        appearS.style.height="30px";
        appearS.style.position="absolute";
        appearS.style.left=(ax-15)+"px";
        appearS.style.top=(by-15)+"px";
        appearS.style.zIndex="2";
        appearS.style.transition="all .5s ease";
        appearS.style.opacity="0.7";
        appearS.style.animation="myfirst 0.75s";
        var elementS=document.getElementById("wrapper");
        elementS.appendChild(appearS);
        //
        s[si] = new Object();
        s[si].x = ax;
        s[si].y = by;
        s[si].name = "s"+(si+1);
        console.log("门店"+(si+1)+"坐标为("+s[si].x+","+s[si].y+")");
        si++;
    }
    if(clickChoice == 3)         //3为顾客
    {
        //点击动画
        var appearC = document.createElement("img");
        appearC.src="icon%20RE/home_fill_light.png";
        appearC.id = "pointC"+(ci+1);
        appearC.style.width="30px";
        appearC.style.height="30px";
        appearC.style.position="absolute";
        appearC.style.left=(ax-15)+"px";
        appearC.style.top=(by-15)+"px";
        appearC.style.zIndex="2";
        appearC.style.transition="all .5s ease";
        appearC.style.opacity="0.7";
        appearC.style.animation="myfirst 0.75s";
        var elementC=document.getElementById("wrapper");
        elementC.appendChild(appearC);
        //
        c[ci] = new Object();
        c[ci].x = ax;
        c[ci].y = by;
        c[ci].name = "c"+(ci+1);
        console.log("顾客"+(ci+1)+"坐标为("+c[ci].x+","+c[ci].y+")");
        ci++;
    }
}


function isolate(arr)
{
    var hash = {};
    var result = [];
    for(var ik = 0, len = arr.length; ik<len;ik++)
    {
        if(!hash[arr[ik]])
        {
            result.push(arr[ik]);
            hash[arr[ik]]=true;
        }
    }
    arr = result;
    return arr;
}

function rule(key)      //规则：依据属性排序
{
    return function(a,b)
    {
        var value1 = a[key];
        var value2 = b[key];
        return value1 - value2;
    }
}

function getX()
{
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }

    return randomNum(1,200);
}

function getY()
{
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }
    return randomNum(1,200);
}
function getDistance(a,b)
{
    var distance = Math.sqrt(Math.pow((a.x - b.x),2)+ Math.pow((a.y - b.y),2))
 return Math.ceil(distance);
}

function getSavingSheet()
{
    if (s[0] === null) alert("请设定门店位置");
    if (c[0] === null) alert("请设定客户位置");
     else if (c[1] === null) alert("请设定两个以上客户位置");
    var shopLength = s.length ;
    var customerLength = c.length;
    var combineNumber = (customerLength * (customerLength - 1))/2;  //组合数C 2 N

/*-------------初始化节约表内部结构---------------*/
    for(var ar=0;ar<s.length;ar++)
    {
        savingSheetS[ar] = new Array();
        for(var ar2=0;ar2<combineNumber;ar2++)
        {
            savingSheetS[ar][ar2] = new Array();
        }
    }
/*--------------初始化节约表内部结构---------------*/


    for(var i=0;i<shopLength;i++) //得到每个S为起始点的节约里程表
    {
        for(var j=0;j<combineNumber;j++){savingSheetS[i][j][0]=s[i];} //第一列
        var iSecond = 0; var jSecond = customerLength - 1; var accumulateSecondIn = 0; var accumulateSecondOut = 0;
        for(var k=0;k<(customerLength-1);k++)//第二列分层
        {
            for(var o=0;o<jSecond;o++){savingSheetS[i][o+accumulateSecondIn][1]=c[iSecond];accumulateSecondOut++;}
            iSecond++;
            jSecond--;
            accumulateSecondIn = accumulateSecondOut;
        }                                                             //第二列
        var iThird = 1; var jThird = customerLength - 1; var uniThird = 1; var accumulateThirdIn = 0; var accumulateThirdOut = 0;
        for(var p=0;p<(customerLength-1);p++)//第三列分层
        {
            for(var q=0;q<jThird;q++){savingSheetS[i][q+accumulateThirdIn][2]=c[iThird];iThird++;accumulateThirdOut++;}
            iThird = uniThird + 1;
            uniThird++;
            jThird--;
            accumulateThirdIn = accumulateThirdOut;
        }                                                             //第三列
        for(var r=0;r<combineNumber;r++){savingSheetS[i][r][3]=getDistance(savingSheetS[i][r][0],savingSheetS[i][r][1]);} //第四列
        for(var v=0;v<combineNumber;v++){savingSheetS[i][v][4]=getDistance(savingSheetS[i][v][0],savingSheetS[i][v][2]);} //第五列
        for(var t=0;t<combineNumber;t++){savingSheetS[i][t][5]=getDistance(savingSheetS[i][t][1],savingSheetS[i][t][2]);} //第六列
        for(var u=0;u<combineNumber;u++){savingSheetS[i][u][6]=savingSheetS[i][u][3]+savingSheetS[i][u][4]-savingSheetS[i][u][5]} //第七列Delta
    }
    console.log("节约里程表为");
    console.log(savingSheetS);

}

function sortSheet()
{
    for(var ssi=0;ssi<s.length;ssi++) {
        savingSheetS[ssi].sort(function (a, b) {
            var t1 = (a[6]) * 1;
            var t2 = (b[6]) * 1;
            if (t1 > t2) return 1;
            else if (t1 < t2) return -1;
            else return 0;
        });

    }
    console.log("排序完毕")
}
function unique4(crr){
    console.log("有毒查重");console.log(crr);
    var hash=[];
    for (var s0 = 0; s0 < crr.length; s0++) {
        for (var kmm = s0+1; kmm< crr.length; kmm++) {
            if(crr[s0][0].name===crr[kmm][0].name){
                ++s0;
            }
        }
        hash.push(crr[s0]);
    }
    if(hash[0][1]==0){}
    console.log("TonyMa");console.log(hash);
    return hash;
    /* crr = removeEmptyArrayEle(crr);
     console.log(crr);
     for(var poik =0;poik<crr.length;poik++)
     {
         for(var oiu =0;oiu<crr.length;oiu++)
         {
             if(crr[poik][0].name == crr[oiu][0].name)
             {
                 crr[oiu] = new Array();
             }
         }
     }

     return removeEmptyArrayEle(crr);
 */
 }

 function selectPath(Ai,cap)
 {
     if(cap>c.length){cap = c.length;}  //如果承载能力大于客户数量，以承载客户数量计算
     var Arrayi = new Array();
     var combineN = (c.length * (c.length - 1))/2;  //组合数C 2 N
   /*  for(var ari = 0;ari<(combineN - 1);ari++)
     {
         Arrayi[0] = s[Ai];  //第一行为当前Shop
         Arrayi[1] = savingSheetS[Ai][0][1]; //第二行为节约表第一列第二行
         Arrayi[2] = savingSheetS[Ai][0][2]; //第三行为节约表第一列第三行
         Arrayi[3] = savingSheetS[Ai][ari + 1][1]; //第四行为节约表第二+ari列第二行
         Arrayi[4] = savingSheetS[Ai][ari + 1][2]; //第五行为节约表第二+ari列第三行
         console.log(Arrayi);
         Arrayi = unique(Arrayi);
         console.log("长度为" + Arrayi.length);
         if(Arrayi.length == 4){return Arrayi;}

     } */
  Arrayi[0] = new Array();
  Arrayi[0][0] = s[Ai];//第一列为当前shop

  var ariplus = 0;
  for(var ari = 0;ari<((combineN - 1)*2);ari++)
  {
      Arrayi[ari+ariplus+1] = new Array();
      Arrayi[ari+ariplus+1][0] = savingSheetS[Ai][ari][1]

      if(Arrayi.length== cap+2) {
          Arrayi = unique4(Arrayi);
          if (Arrayi.length == cap + 1) {
              return Arrayi;
          }
          else {
              ariplus = ariplus - 2;
          }
      }
      Arrayi[ari+ariplus+2] = new Array();
      Arrayi[ari+ariplus+2][0] = savingSheetS[Ai][ari][2];
      if(Arrayi.length == cap+2){
      Arrayi = unique4(Arrayi);
          if(Arrayi.length == cap+1){return Arrayi;}
          else{ariplus = ariplus - 2;}
      }
      ariplus++;
  }
}

function getPathSC()
{
    /*
    var psDistance = new Array();
    for(var ppi=0;ppi<p.length;ppi++)
    {
        psDistance[ppi] = new Array();
        for (var psi = 0; psi < s.length; psi++)
        {
            psDistance[ppi][psi] = getDistance(p[ppi],s[psi]);
        }
    }                                              //配送员与门店距离表

    Temp.distance = 0;
    Temp.p = 0;
    Temp.s = 0;
    for(var ppt=0;ppt<p.length;ppt++)
    {
        for(var pst=0;pst<s.length;pst++)
        {
            if(Temp.distance<psDistance[ppt][pst])
            {
                Temp.distance = psDistance[ppt][pst];
                Temp.p = ppt;
                Temp.s = pst;
            }
        }
    }                                               //得到p与s最近
    */


    for(var i23 = 0; i23<s.length;i23++)
    {
        for(var sci=0;sci<capacity;sci++)  //计算路径表内顾客与门店距离属性
        {
            pathArrayofSavingSheetS[i23][0][1] = 1;
            pathArrayofSavingSheetS[i23][sci+1][1] = getDistance(pathArrayofSavingSheetS[i23][0][0],pathArrayofSavingSheetS[i23][sci+1][0]);
        }

    }
    console.log("已获取各S节点节约路径表");

    for(var i24 = 0; i24<s.length;i24++)
    {
        pathArrayofSavingSheetS[i24].sort(function(x,y){return x[1]-y[1];});  //据SC距离排序
        console.log("S"+i24+"完成SC排序");
        console.log(pathArrayofSavingSheetS[i24]);
    }

}



function mainGetRoute()
{
    if(capacity>c.length){capacity = c.length;}
getSavingSheet();
sortSheet();
    for(var i22 = 0; i22<s.length; i22++)
    {
        pathArrayofSavingSheetS[i22] = new Array();
        pathArrayofSavingSheetS[i22] = selectPath(i22,capacity);
    }
getPathSC();
    PathP();
//console.log("路径表为");
//console.log(pathSheet);
drawPath();
//clearAll();
}

function PathP()
{

    for(var i25 = 0; i25<p.length; i25++)
    {
        dPC[i25] = [];
        for(var i26 = 0;i26<s.length;i26++)
        {
            dPC[i25][i26] = [];
            dPC[i25][i26][0] = getDistance(p[i25],s[i26]);
            dPC[i25][i26][1] = s[i26];
        }
        dPC[i25].sort(function(x,y){return x[0]-y[0];});  //据PS距离排序
        console.log(dPC[i25]);
    }
    var akil=0;
    for(var dot=0;dot<p.length;dot++){pathSheet[dot] = [];}
    for(var iol=0;iol<p.length;iol++)
    {
        for(var i28=0;i28<s.length;i28++)
        {

            if(dPC[iol][0][1].name === s[i28].name)
            {/*

                pathArrayofSavingSheetFinal[akil] =[];
                pathArrayofSavingSheetFinal[akil] = pathArrayofSavingSheetS[i28];
                console.log("final");console.log(pathArrayofSavingSheetFinal);
                pathArrayofSavingSheetFinal[akil][capacity+1] = new Array();
                console.log(pathArrayofSavingSheetFinal);
                pathArrayofSavingSheetFinal[akil][capacity+1][0] = p[iol];
                pathArrayofSavingSheetFinal[akil][capacity+1][1] = 0;
                pathArrayofSavingSheetFinal[akil].sort(function(x,y){return x[1]-y[1];});  //加入P后排序
                pathSheet[i28] = pathArrayofSavingSheetFinal[akil];
                akil++;
                */
                pathSheet[iol][0] = p[iol];
                for(var nk=0;nk<capacity+1;nk++){
                pathSheet[iol][nk+1] = pathArrayofSavingSheetS[i28][nk];}
            }

        }
    }
    //removeEmptyArrayEle(pathArrayofSavingSheetFinal);
    console.log(pathSheet);
}


function removeEmptyArrayEle(ark){
    for(var mn = 0; mn < ark.length; mn++) {
        if(ark[mn] == undefined) {
            ark.splice(mn,1);
            mn = mn - 1;

        }
    }
    return ark;
}

function clearAll()
{
    //初始化p,s,c对象
    p = []; s = []; c = [];
    //p,s,c对象计数
    pi = 0; si = 0; ci = 0;
    savingSheetS = new Array();     //初始化节约表
    Temp = new Object();            //p,s距离最近
    pathSheet = new Array();        //初始化路径表
    pathArrayofSavingSheetS = new Array(); //每个节约表得到的路径
    clickChoice = 0;
}
function clearReset()
{

    for(var crpi = 0;crpi<p.length;crpi++)
    {
        var parenta = document.getElementById("wrapper");
        var childa = document.getElementById("pointP"+(crpi+1));
        childa.style.animation = "mylast 0.75s";
        parenta.removeChild(childa);
    }
    for(var crpj = 0;crpj<s.length;crpj++)
    {
        var parentb = document.getElementById("wrapper");
        var childb = document.getElementById("pointS"+(crpj+1));
        childb.style.animation = "mylast 0.75s";
        parentb.removeChild(childb);
    }
    for(var crpk = 0;crpk<c.length;crpk++)
    {
        var parentc = document.getElementById("wrapper");
        var childc = document.getElementById("pointC"+(crpk+1));
        childc.style.animation = "mylast 0.75s";
        parentc.removeChild(childc);
    }


    //初始化p,s,c对象
    p = []; s = []; c = [];
    //p,s,c对象计数
    pi = 0; si = 0; ci = 0;

    var kn=document.getElementById("pathline");
    kn.width=kn.width;
    kn.height=kn.height;

    clearAll();

}
var colorSheet =
    [
        "#62ff90",
        "#ff8530",
        "#ff7590",
        "#cb89ff",
        "#000000",
        "#f2f8ff",
        "#c0ff7f",
        "#ff0075",
        "#4afff8",
        "#6fabff",
    ];
function drawPath()
{   document.getElementById("pathline").style.zIndex="1";
    var canvas = document.getElementById("pathline");
    var context = canvas.getContext("2d");


    for(var canvi = 0;canvi<p.length;canvi++)
    {   context.beginPath();
        context.strokeStyle = colorSheet[canvi];
        context.moveTo(pathSheet[canvi][0].x-1064,pathSheet[canvi][0].y-55);
        for(var canin = 0;canin<capacity+1;canin++)
        {
            context.lineTo(pathSheet[canvi][canin+1][0].x-1064,pathSheet[canvi][canin+1][0].y-55);
        }

        context.stroke();
        context.closePath();
    }
}
