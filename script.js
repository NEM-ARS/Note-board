
document.addEventListener('dblclick', (e)=> createNote(e));


for(let i=0; i<localStorage.length; i++){
    let key = localStorage.key(i);
    let value =JSON.parse(localStorage.getItem(key));

    noteParams(value);
};

function createNote(obj){
    let noteObj = {
        id: Date.now(),
        top: obj.clientY,
        left: obj.clientX,
        color: '',
        text: null,
    };

    localStorage.setItem(noteObj.id, JSON.stringify(noteObj));

    noteParams(noteObj);
};


function noteParams(elem){
    let note = document.createElement('div');
    note.id = elem.id;
    note.className = 'noteBody';

    board.append(note);
     
    note.style.top = elem.top + 10 + 'px';
    note.style.left = elem.left - 60 + 'px';
    note.style.position = 'absolute';

    let color = elem.color ||  '#e44a4a';

    note.insertAdjacentHTML("afterbegin", `
    <div class="shadow"></div>
    <div>
        <div class="icons" style="background:${color};">
            <label for="inputColor" class="color"></label>
            <div class="del"></div>
        </div>
        <div class="textBlock" style="background:${color};">
            <textarea class="text" autocomplete="off" spellcheck="false">${elem.text||''}</textarea>
        </div>
    </div>`);

    note.querySelector('textarea').focus();

    note.querySelector('textarea').oninput = function(){
        let newText = JSON.parse(localStorage[note.id]);
        newText.text = this.value;
        localStorage.setItem(note.id, JSON.stringify(newText));
    };
};


let isDragging = false;

document.addEventListener('mousedown', 
function(event) {
    let noteBody = event.target.closest('.noteBody');
    let del = event.target.closest('.del');
    let color = event.target.closest('.color');
    let icons = event.target.closest('.icons');

    if(!noteBody) return;
    
    if(color){
        inputColor.focus();
        board.oninput = function(){
            noteBody.querySelector('.textBlock').style.background = inputColor.value;
            noteBody.querySelector('.icons').style.background = inputColor.value;
            
            let newColor = JSON.parse(localStorage[noteBody.id]);
            newColor.color = inputColor.value;
            localStorage.setItem(noteBody.id, JSON.stringify(newColor))

    }
    }else  if(del){
        localStorage.removeItem(noteBody.id);
        noteBody.remove();
    }else{
        board.append(noteBody);
    }

    if(icons){
        if(isDragging) return;
            isDragging=true;
            
            dragging(event, noteBody);
        };
    }
);


function dragging(event,elem){
    
    let shiftX = event.clientX - elem.getBoundingClientRect().left;
    let shiftY = event.clientY - elem.getBoundingClientRect().top;
    
    moveAt(event.pageX, event.pageY);
    
    function moveAt(pageX, pageY) {
        elem.style.left = pageX - shiftX + 'px';
        elem.style.top = pageY - shiftY + 'px';
    };
    
    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
        let newCoordinates = JSON.parse(localStorage[elem.id]);
        newCoordinates.top = elem.getBoundingClientRect().top -10;
        newCoordinates.left = elem.getBoundingClientRect().left + 60;
    
        localStorage.setItem(elem.id, JSON.stringify(newCoordinates));
    };
    
    document.addEventListener('mousemove', onMouseMove);
    
    document.onmouseup = function() {
        if(elem.getBoundingClientRect().top<20)elem.style.top = 20 +'px';
        if(elem.getBoundingClientRect().top>document.body.clientHeight){
            elem.style.top = document.body.clientHeight +'px';
        };

        document.removeEventListener('mousemove', onMouseMove);
 
        if(!isDragging) return;
        isDragging=false;
    };
};
