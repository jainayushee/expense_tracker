    const divs = document.getElementsByClassName('mdl-grid');

    let rawData = Array.prototype.map.call(divs, (divs) => divs)
    rawData = rawData.splice(1);

    let map = [{'key': "englishbmrc", 'value': 0}, 
    {'key':"swiggy" , 'value': 0},{ 'key':"Chandra M", 'value' : 0 }, {'key':"Med" , 'value': 0},
    {'key':"zepto" , 'value': 0}, {'key' :'roppen', 'value' : 0} , {'key':"recieved", 'value':0},{'key':"others" , 'value': 0, 'transaction' : []}];

    let transactionData = rawData.map(function (datum) {
        let transactionRemark = datum.childNodes[1].childNodes[0].nodeValue;
        let transactionDate = (datum.childNodes[1].childNodes[2].nodeValue);
        transactionDate = transactionDate.split(',');
        transactionDate = transactionDate[0] + " " + transactionDate[1];
        transactionDate = new Date(transactionDate);
        if(transactionRemark.includes('Received')) {
            transactionRemark = transactionRemark.split('Received')
            transactionRemark = {'summary' : 'Recieved' , 'amount' : convertMoney(transactionRemark[1].slice(1)), 'date': transactionDate};
        }
        else {
            transactionRemark = transactionRemark.slice(6);
            transactionRemark = transactionRemark.split('to');
            let transactionTo = transactionRemark[1];
            if(transactionTo)
                transactionRemark[1] = transactionTo.split('using')[0];
            else{
                transactionRemark[0] = transactionRemark[0].split('using')[0];
                transactionRemark[1] = 'Transfer from bank account'
            }
        
            transactionRemark = {'summary' : transactionRemark[1].trim() , 'amount' :  convertMoney(transactionRemark[0]),'date': transactionDate};
        
        }   
        return {transactionDate, transactionRemark}
    })
    let fromDate;
    let toDate;
    fillMap(transactionData, fromDate, toDate)

    function fillMap(transactionData, fromMonth, toMonth)  {


        for(let i = 0 ; i  < transactionData.length; i++) { 
            let isAdded = false;
            for(let j = 0; j < map.length; j++) {
                if(transactionData[i].transactionRemark.summary.toLowerCase().includes(map[j].key.toLowerCase())) {
                    map[j].value  += parseInt(transactionData[i].transactionRemark.amount);
                    isAdded = true;
                }
            }
            if(!isAdded) {
                map[map.length-1].value +=  parseInt(transactionData[i].transactionRemark.amount);
                map[map.length-1].transaction.push(transactionData[i].transactionRemark);
            }

        }
    }

    transactionData.sort( (a,b) => b.transactionRemark.amount - a.transactionRemark.amount)

    map[map.length-1].transaction.sort( (a,b) => b.amount - a.amount);
    console.log(map)
    console.log(transactionData);

    localStorage.setItem('gpayData' , createJson(map));
    localStorage.setItem('others_history', JSON.stringify(map[map.length-1].transaction))
    function createJson(map) {
        let a = {};
        for(let data of map) {
            a[data.key] = data.value;
        }

    return JSON.stringify(a);
  }

  function convertMoney (amount) {      
        let final_amount = Number(amount.replace(/[^0-9.-]+/g,""));
        return final_amount;

  }


