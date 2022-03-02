// selecting items
const form = document.querySelector('#form');
const alerts = document.querySelector('#alert');
const grocery = document.querySelector('#grocery');
const submitbtn = document.querySelector('#submit');
const container = document.querySelector('.grocerycon');
const list = document.querySelector(".grocerylist");
const clearBtn = document.querySelector(".clearbtn");
const navbar = document.querySelector(".nav-container")

//edit option
let editElement;
let editFlag = false;
let editId = '';

// ***** event listners *****

// submission

form.addEventListener('submit', addItem);

// clear items

clearBtn.addEventListener('click', clearItem );

// loading content

window.addEventListener('DOMContentLoaded', setUpItems);

// ***** functions *****

function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag){

        createList(id, value);

        // display alert

        displayAlert('Item added', 'nice');

        // display the container

        container.style.display = "block";

        //set back to default

        setBackToDefault();

        // add to local storage

        addToLocalStorage(id , value);
        

    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('item edited', 'nice');
        editLocalStorage(editId, value);
        setBackToDefault();
    }
    else{
        displayAlert('Please enter a value', 'bad')
    }
}


// display alert

function displayAlert(text, action){
    alerts.innerHTML=text;
    alerts.classList.add(`alert-${action}`);

    // set timeout

    setTimeout(function(){
        alerts.innerHTML="";
        alerts.classList.remove(`alert-${action}`);
    }, 2000);
}

// clear items

function clearItem (){
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach(item=>{
            list.removeChild(item);
        })
    }
    container.style.display = 'none';
    displayAlert('List is Cleared', 'bad')
    localStorage.removeItem('list');
    setBackToDefault();
}

// delete item 

function deleteItem(e){
    const item = e.currentTarget.parentElement.parentElement;
    list.removeChild(item);

    const id = item.dataset.id;

    displayAlert("item deleted", 'bad');

    if(list.children.length == 0){
        container.style.display = "none";
    }
    removeFromLocalStorage(id);

    setBackToDefault();
}

// edit item

function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;

    grocery.value = editElement.innerHTML;

    editFlag = true;

    editId = element.dataset.id;
    submitbtn.textContent = "Edit";
}

// set back to default

function setBackToDefault(){
    grocery.value = '';
    editFlag = false;
    editId = '';
    submitbtn.textContent = 'submit';
}

// ***** Local Storage *****

// add to local storage

function addToLocalStorage(id, value){
    const grocery = {id, value} // this is a object; we could have wrote {id:id , value:id}; but in es6 you can write like this if id and key name is same;
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
    console.log(items);
}


function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(item =>{
        if(item.id !== id){
            console.log(item.id);
            console.log(id);
            return item;
        }
    })
    localStorage.setItem('list', JSON.stringify(items));
}

function editLocalStorage(id, value){
    items = getLocalStorage();
    items = items.map(item=>{
        if(item.id == id){
            item.value = value;
        }
        return item;
    })
    localStorage.setItem('list', JSON.stringify(items));
};

function getLocalStorage(){
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

// setup the item

function setUpItems(){
    let items = getLocalStorage();
    if (items.length > 0){
        items.forEach(item=>{
            createList(item.id, item.value)
        })
    }
    container.style.display = "block";
}

function createList(id, value){
    const element = document.createElement('article');
    element.classList.add('grocery-item');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML=
        `<p class="item">${value}</p>
            <div class="btn-container">
                <button type="button" class="edit-btn">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>
                <button type="button" class="del-btn">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </div>`;
    const delbtn = element.querySelector('.del-btn');
    const editbtn = element.querySelector('.edit-btn');

    delbtn.addEventListener('click', deleteItem);
    editbtn.addEventListener('click', editItem);

    // apped child means adding the element in the list
    
    list.appendChild(element);
}



