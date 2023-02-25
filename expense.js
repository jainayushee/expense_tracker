// Assigning a variable to a function (without the parenthesis) copies the reference to the function. 
//Putting the parenthesis at the end of a function name, calls the function, returning the functions return value.


function onInit(){
    let expenses;
    let flattened_json;
    let other_transaction_history = JSON.parse(localStorage.getItem('others_history'));
    const transaction_map = new Map();
    let possible_keys = [];
    console.log(other_transaction_history)
    if(localStorage.getItem('gpayData')) {
        expenses = localStorage.getItem('gpayData')
        expenses = JSON.parse(expenses) 
    }
    else {
        expenses = {
            "investment" : { "mutual fund" : "1500", "ppf" : "10000"},
            "rent" : "11000",
            "mausi":"7000",
            "DTF" : "3900",
            "gpay": "10000",
            "Recharge": "675",
            "other_expenses" : {
                "bus" : "168",
                "food" : "1078",
                "swiggy":"1315",
                "playo":"652",
                "rapido":"600",
                "grocery":"506",
                "books":"110",
                "miscellaneous": {
                    "papa_birth" : "745",
                    "Truffles" : "365",
                    "akul" : "400",
                    "water" : "235",
                    "parcel": "135",
                    "utensils":"694"
                }
            }
        
        }
    }
    
    flattened_json = recursion(expenses,false)
    function recursion(expenses, isRecursion) {
        let final_obj = {};
        var sum = 0;
        var final_sum = 0;
        for(let prop in expenses) {
            console.log(prop)
            if(typeof(expenses[prop]) == 'object') {
                
                let result = recursion(expenses[prop], prop, true);
                final_sum += result.sum;
                final_obj[prop] = {subdata: JSON.stringify(result.final_obj) , sum:result.sum}
            }
            else{
                if(isRecursion){
                    sum +=  parseInt(expenses[prop]);
                    final_obj[prop] = parseInt(expenses[prop]);
                }
                    
                else{
                    sum = parseInt(expenses[prop]);
                    final_obj[prop] = {sum , subdata: ''};
                    final_sum+= sum;
                }
            }
    
        }
        return {final_obj,sum,final_sum};
    }
    
    function _generatePossibleKeys (){
        
        for(let i = 0 ; i < other_transaction_history.length ; i++) {
            if(transaction_map.has(other_transaction_history[i].summary))
                transaction_map.set(other_transaction_history[i].summary, transaction_map.get(other_transaction_history[i].summary) + 1)
            else
                transaction_map.set(other_transaction_history[i].summary, 1)
        }

        for (let [key, value] of transaction_map) {
            if(value > 1)
                possible_keys.push(key);
        }
        
        console.log(possible_keys);

    }   
    return {
        flattened_json,
        other_transaction_history,
        generatePossibleKeys : _generatePossibleKeys
    }
}
function handleDragandDropFunctions() {
    function handleDragStart(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData("text", e.target.id);
    }
      
    function handleDragEnd(e) {
        //console.log('dragEnd')
      }
      
    function handleDrop(e) {
        e.preventDefault();
        let target = e.target;
        console.log(target.className)
        if(target.className !== 'draggable-items' && target.className !== 'draginme')  
            return false;      // stops the browser from redirecting.
        var data = e.dataTransfer.getData("text");
        //console.log(document.getElementById(data))
        e.target.appendChild(document.getElementById(data));
      }

      return {
        handleDragStart_function: handleDragStart,
        handleDragEnd_function : handleDragEnd,
        handleDrop_function : handleDrop

    }
}
function generateFunctions(){

    let legends_data = [];
    let button = document.getElementById('addTags');
    button.addEventListener('click', generateDroppableDiv);
    let tags_wrapper = document.getElementById('tags');
    let modal = _modal();
    modal.onInit();
    function generateRandomHexaDecimalColor() {
        let arr = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
        let code = '#';
        for(let i = 0; i < 3; i++){
            let randNumber = Math.floor((Math.random() * 15) + 1);
            code += arr[randNumber];
        }
    
        return code;
    }
    
    function generatePieChart(flattened_json) {
        let final_sum = flattened_json.final_sum;
        let gradient = '';
        let index = 0;
        let degreeSum = 0;
        for(let prop in flattened_json.final_obj) {
            let final_color = '';
            let color_generated = '';
            color_generated = generateRandomHexaDecimalColor();
            let percentage = (parseFloat(flattened_json.final_obj[prop].sum) / parseFloat(final_sum)*100).toFixed(2);
            legends_data.push({color_generated, prop, percentage});
    
            degreeSum += parseInt(percentage);
            percentage = degreeSum;
            percentage+= '%';
            if(index > 0) {
                final_color += color_generated + " " + "0 " + percentage;
            }
            else {
                final_color = color_generated + " " + percentage;
            }
            final_color += ',';
            gradient += final_color;
            gradient += " "; 
            index++;
        } 
        gradient = gradient.slice(0,-2);
        generateLegendsData(legends_data);
        return gradient;
      
    }
    
    function generateID() {
        return new Date().getTime().toString();
    }

    function generateLegendsData(legends_data){
        let ul_element  = document.getElementById('key');
        for(let i = 0 ; i < legends_data.length; i++) {
            let list_elem = document.createElement('li');
            let strong_elem = document.createElement('strong');
            strong_elem.innerHTML = legends_data[i].percentage;
            strong_elem.setAttribute('style', `background-color: ${legends_data[i].color_generated}`);
            let h3_elem  = document.createElement('h3');
            h3_elem.innerHTML = legends_data[i].prop;
            list_elem.appendChild(strong_elem);
            list_elem.appendChild(h3_elem);
            ul_element.appendChild(list_elem);

        }
    }

    function generateDraggableDivs(other_transaction_history){
        let data_div = document.getElementById('draggable-items');
        data_div.addEventListener('drop', handleDragandDropFunctions().handleDrop_function);
        data_div.addEventListener('dragover',allowDrop)
        for(let i = 0 ; i < other_transaction_history.length; i++) {
            let div = document.createElement('div');
            div.setAttribute('id', generateID() + i)
            div.classList.add('transaction-wrapper')
            let span_elem = document.createElement('span');
            span_elem.innerHTML = other_transaction_history[i].summary;
            span_elem.classList.add('remarks');

            let h4_elem = document.createElement('h4')
            h4_elem.innerHTML = new Date(other_transaction_history[i].date).toLocaleDateString('en-GB');
            h4_elem.classList.add('date');

            let wrapper_div = document.createElement('div');
            wrapper_div.appendChild(span_elem);
            wrapper_div.appendChild(h4_elem);
            wrapper_div.classList.add('datewrapper')
            let h3_elem = document.createElement('h3');
            h3_elem.innerHTML = other_transaction_history[i].amount;
            h3_elem.classList.add('pill')
            h3_elem.classList.add('pill-removed')
            div.appendChild(wrapper_div);
            div.appendChild(h3_elem);
            div.setAttribute('draggable', 'true')
            div.addEventListener('dragstart', handleDragandDropFunctions().handleDragStart_function)
            div.addEventListener('dragend', handleDragandDropFunctions().handleDragEnd_function)
            data_div.appendChild(div);
        }
    }

    function generateDroppableDiv(){    
        let droppable_div = document.createElement('div');
        droppable_div.classList.add('draginme');
        droppable_div.addEventListener('drop', handleDragandDropFunctions().handleDrop_function);
        droppable_div.addEventListener('dragover',allowDrop)
        tags_wrapper.appendChild(droppable_div);
        modal.toggleModal();

        
    }
   
    return {
        generatePieChart_function : generatePieChart,
        generateDraggableDivs_function : generateDraggableDivs,
        generateDroppableDiv_function : generateDroppableDiv
    }
    
}
function allowDrop(e) {
    e.preventDefault();
}
function updateDraggableData(other_transaction_history) {
    let original_transaction_history;
    let updated_transaction_history = JSON.parse(JSON.stringify(other_transaction_history));
    let dropdown = document.getElementById('sort_data');
    let from_date = document.getElementById('datetime-local-from');
    let to_date = document.getElementById('datetime-local-to');
    let type_to_filter =  document.getElementById('typetoFilter');
    let reset = document.getElementById('reset-filter-btn');
    function onInit(){
        dropdown.addEventListener('change' , handleChange);
        from_date.addEventListener('change', fromdateChange);
        to_date.addEventListener('change',todateChange)
        type_to_filter.addEventListener('input', handleTyped);
        reset.addEventListener('click', resetDateFilter);
        original_transaction_history = other_transaction_history;
        getDate();
    }

    function handleChange(e){
        _sort(e);
    }

    function fromdateChange(){
        filterData(from_date.value, 'from');
    }

    function todateChange(){
        filterData(to_date.value, 'to')
    }

    function resetDateFilter() {
        filterData(null, 'default')
    }

    function filterData(date, action){
        if (action === 'default') {
            updateData(original_transaction_history)
            from_date.value = null;
            getDate();
        }
        else {
            updated_transaction_history = updated_transaction_history.filter((transaction) => {
                if (action === 'from') if (transaction.date.slice(0, 10) > date) return true;
                if (action === 'to') if (transaction.date.slice(0, 10) < date) return true;
            })            
            updateData(updated_transaction_history);
        }
    }

    function updateData(transaction_history) {
        removeChildren('draggable-items');
        generateFunction.generateDraggableDivs_function(transaction_history);
    }   

    function handleTyped(e) {
        if(e.target.value.length === 0){
            updateData(updated_transaction_history);
        }
        if(e.target.value.length > 3) {
           let filtered_transaction_history = updated_transaction_history.filter((transaction) => {
                if(transaction.summary.toLowerCase().includes(e.target.value.toLowerCase())) {
                    return true;
                }

                return false;
           })

           updateData(filtered_transaction_history);
        }
    }   

    function getDate(){
        document.getElementById('datetime-local-to').value = new Date().toISOString().slice(0, 10);
    }

    function removeChildren(classname) {
        tags_wrapper = document.getElementById(classname);
        let child = tags_wrapper.firstElementChild; 
        while (child) {
            tags_wrapper.removeChild(child);
            child = tags_wrapper.firstElementChild;
        }
    }
    function _sort (event, type) {
        let sort_type = event.target.value;
        switch (sort_type) {
            case 'Hightolow':
                updated_transaction_history.sort((a,b) => b.amount - a.amount);
            break;

            case 'lowtohigh':
                updated_transaction_history.sort((a,b) => a.amount - b.amount);
            break;

            case 'mostrecentfirst':
                updated_transaction_history.sort(function(a,b) {
                    return new Date(b.date) - new Date(a.date);
                })
            break;

            case 'oldesttolatest':
                updated_transaction_history.sort(function(a,b) {
                    return new Date(a.date) - new Date(b.date);
                })
            break;
            
            case 'customDate':
                updated_transaction_history.filter( function (datum) {
                    if(datum <= to_date.value && datum >= from_date.value)
                        return true;
                    return false;
                })
            break;
            case 'typeToFilter' :

            break;
            default:
                updated_transaction_history = JSON.parse(JSON.stringify(original_transaction_history));

        }
        updateData(updated_transaction_history);
    }

    return {
        _on_init: onInit,
    }
} 

function _modal(){
    const modal = document.querySelector(".modal");
    const closeButton = document.querySelector(".close-button");
    

    function _toggleModal() {
        modal.classList.toggle("show-modal");
    }
    
    function windowOnClick(event) {
        console.log('win')
        if (event.target === modal) {
            _toggleModal();
        }
    }

    function _onInit() {
        closeButton.addEventListener("click", _toggleModal);
        window.addEventListener("click", windowOnClick);
    }


    return {
        onInit : _onInit,
        toggleModal : _toggleModal
    }
   
}

let onInitData = onInit();
onInitData.generatePossibleKeys();
let generateFunction = generateFunctions();
let sortable_functions = updateDraggableData(onInitData.other_transaction_history);
sortable_functions._on_init();

let gradient = generateFunction.generatePieChart_function(onInitData.flattened_json);
let piechart = document.getElementById('my-pie-chart')
piechart.setAttribute('style', `background-image: conic-gradient(${gradient})`);
generateFunction.generateDraggableDivs_function(onInitData.other_transaction_history);



