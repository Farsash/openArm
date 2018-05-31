var groupList = {}; // Данные о слоях
var _massGRP = []; // Временный массив

var Animations = {
  animationName:{
    g: {
      grName: 'g',
      next: ['g2', 'g3']
    },
    g2: {
      grName: 'g2'
    }, g3: {
      grName: 'g3'
    }
  }
}

window.addEventListener("mousedown", SelectElement, false);

// Shift + Click

function SelectElement(){
  
  if (event.shiftKey) {
      var x = event.clientX;
      var y = event.clientY;
      var elementFromPoint = document.elementFromPoint(x, y).id;
  
      if ( elementFromPoint != 'svg'){
        
        
        // Проверка на двойное добавление
        var flagDuble = false;
        
        for ( var i = 0; i < _massGRP.length; i++ ) {
          // Проверка на двойное добавление
          if ( _massGRP[i] === elementFromPoint ){
              flagDuble = true;
              break;
          } 
          
        }
        
        // КОНЕЦ Проверка на двойное добавление
        
        if (flagDuble === false){
          _massGRP.push(elementFromPoint);
          var elem = document.getElementById(elementFromPoint);
          
          if (elem.hasAttribute("style") === true){
            ResetAttribute(elementFromPoint, elem.getAttribute("style"));
            elem.removeAttribute("style");
          }
          
          elem.setAttribute("stroke", 'green');
          
        }        
        console.log(_massGRP);        
      }    
  }
  
}

function CreateGroup(){
  var nameGrp = prompt('Создать группу из ' + _massGRP, 'Имя группы');
  var latFlag = isLat(nameGrp);
  if(latFlag === true){
    if (nameGrp != null){
      if (_massGRP.length === 0) {
        alert('Выбирите хотябы один элемент');
      } else {
        if ( groupList[nameGrp] ){
          alert('Такое имя уже существует');
        } else {
          groupList[nameGrp] = _massGRP;
          UILayers(nameGrp);
        }        
      }
    }  
    deselect();
    _massGRP = [];
    console.log(groupList);

  } else {
    alert('Имя должно содержать латинские символы');
  }

}

// В помощь
function isLat(str) {
    return /^\s*(\w+)\s*$/.test(str);
}

function deselect(){
   for (var i = 0; i < _massGRP.length; i++) {          document.getElementById(_massGRP[i]).setAttribute("stroke", 'black');
   }
  
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Интерфейс

function UILayers( name ){
    var ly = document.createElement("li");
    ly.textContent = name;
    //ly.onmouseover = HoverLayers(name);
    ly.setAttribute('onmouseover','HoverLayers("'+ name +'")');
    ly.setAttribute('onmouseout','DeHoverLayers("'+ name +'")');
  

  
    var wp = document.getElementById('layers'); 
    wp.appendChild(ly);
}

function HoverLayers(ds){
  for (var i = 0; i < groupList[ds].length; i++) {   
      document.getElementById( groupList[ds][i]).setAttribute("stroke", 'green');
  }
}

function DeHoverLayers(ds){
  for (var i = 0; i < groupList[ds].length; i++) {   
      document.getElementById( groupList[ds][i]).setAttribute("stroke", 'black');
  }
}

function setParam( grp, attribute, param ){
  for (var i = 0; i < groupList[grp].length; i++) {   
      document.getElementById( groupList[grp][i]).setAttribute(attribute, param);
  }
}

function ResetAttribute( name, attribute ){

  var arr = attribute.split(';');
  for( var i = 0; i<arr.length; i++){
    var iten = arr[i].split(':');
    document.getElementById( name ).setAttribute(iten[0], iten[1]);
  }
  
}



////////////// СЦЕНАРИЙ АНИМАЦИИ  ////////////////
function Animation(name, startObject){
  var anObj = Animations[name][startObject];
  setParam(startObject, "stroke", 'red');
  if(anObj.next){
     for (var i = 0; i < anObj.next.length; i++){
       Animation('animationName', anObj.next[i]);  
     }
       
  } else {
    return
  }    
}



// ====================== Ноды =======================
var bridgeConnect;

var stn = 'name';
var rn = 0;

var bl = 0;
var ch = 0;

function SelectNode( el ){
    var id_node = el.getAttribute('nodes');
    bridgeConnect = id_node;
    console.log('Записал', bridgeConnect);
    el.id = id_node + "_p";
  
}
function AddNode( el ){
    console.log('Принял', bridgeConnect);
    var nameBlock = el.getAttribute('name');
    var node = document.getElementById(bridgeConnect);
    var node_p = document.getElementById(bridgeConnect + "_p");
    
    var _child = node_p.getAttribute('child');
    console.log(_child);
    if(!_child){
        console.log('Создал Child');
        var node_chld = document.createElement('ul');
        node.appendChild(node_chld);
        node_p.setAttribute('child', nameBlock + ch + rn);
        node_chld.id = nameBlock + ch + rn;
        bl += 1;
    } else {
        var node_chld = document.getElementById(_child);
    }
    
    var node_block = document.createElement('li'); 
    node_block.id = nameBlock + ch + 'block' + bl + rn;
    var node_block_name = document.createElement('a');
    node_block_name.innerHTML= nameBlock + ch + 'block' + bl + rn;
    node_block.appendChild(node_block_name);
    
    var node_block_but = document.createElement('a');
    node_block_but.innerHTML= "+";
    node_block_but.setAttribute('nodes', nameBlock + ch + 'block' + bl + rn);
    node_block_but.setAttribute('onclick', 'SelectNode( this )');
    node_block.appendChild(node_block_but);

    node_chld.appendChild(node_block);
    node.appendChild(node_chld);
    
    ch += 1;
    // КОСТЫЛЬ из-за постоянного совпадения ID и имён
    rn = getRandomInt(0, 1000);
  
}

function AddNode2( el ){

  var id_node = el.getAttribute('nodes'); 
  var node = document.getElementById(id_node);
  
  
  var _child = el.getAttribute('child'); 
  
  if(!_child){
    var node_chld = document.createElement('ul');
    node.appendChild(node_chld);
    el.setAttribute('child', stn + rn);
    node_chld.id = stn + rn;
  } else {
    var node_chld = document.getElementById(_child);
  }

  var node_block = document.createElement('li');  
  node_block.id = stn + rn + 'block';
  var node_block_name = document.createElement('a');
  node_block_name.innerHTML= stn + rn;
  node_block.appendChild(node_block_name);


  
  
  var node_block_but = document.createElement('a');
  node_block_but.innerHTML= "+";
  node_block_but.setAttribute('nodes', stn + rn + 'block');
  node_block_but.setAttribute('onclick', 'AddNode( this )');
  node_block.appendChild(node_block_but);
  
  node_chld.appendChild(node_block);
  node.appendChild(node_chld);
  
  if (Animations.animationName[id_node].next){
    Animations.animationName[id_node].next.push(stn + rn);
  } else {
    Animations.animationName[id_node].next = [];
    Animations.animationName[id_node].next.push(stn + rn);    
  }
 
  var obj = {
    grName: stn + rn
  }
  
  
  var nm = stn + rn;
  Animations.animationName[nm] = obj;
  //console.log(Animations.animationName);
  
  
  rn += 1;
}




