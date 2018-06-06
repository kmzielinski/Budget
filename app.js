
////////////////////////////////////////

/////////////BUDGET CONTROLLER//////////////

////////////////////////////////////////
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    };
    Expense.prototype.calcPercentages = function (totalIncome) {

        if(totalIncome > 0 ) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var allExpenses =[];
    var allIncomes = [];
    var totalExpanses = 0;

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        /*
         0
         [200, 400, 100]
         sum = 0 +200
         sum + 400
         */
        data.totals[type] = sum;
    };
    var data ={
        allItems:{
            exp:[],
            inc: []
        },
        totals:{
            exp: 0,
            inc:0
        },
        budget: 0,
        percentage: -1
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            // Create new ID
            if (data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id +1;}
            else{
                ID =0;
            }
            // Create new Item based on 'inc or 'exp typ
            if (type === 'exp' ) {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income (ID, des, val);
            }
            // Push into data structure
            data.allItems[type].push(newItem);
            // return the new element
            return newItem;

        },
        deleteItem: function (type, id) {
            var ids, index;
            // id = 6
            //ids = [ 1,2,4,6,8,]
            // index = 3
            var ids = data.allItems[type].map(function(current) {
               return current.id;

            });

            index = ids.indexOf(id);

            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }

        },
            ///////// CALCULATE METHODS ///////

        calculateBudget: function () {
            // calculate total income and expances
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expanses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else {
                data.percentage = -1
            }

        },

        calculatePercentages : function () {
            /*
                a=100
                b=200
                c=300
                income = 600
                a= 100/600 = 17%
             */
            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentages(data.totals.inc);
            })
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
          return {
              budget : data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          };
        },
        testing: function () {
            console.log(data);
        }
    };


})();
////////////////////////////////////////

/////////////UI CONTROLLER//////////////

////////////////////////////////////////
var UIController = (function () {
        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expenseLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container:'.container',
            expancesPercLabel: '.item__percentage',
            dateLabel : '.budget__title--month'

        };
    var formatNumber = function(num, type){
        // + and - before numbers
        // 2 decimal points
        // coma
        var numSplit, int, dec;

        num = Math.abs(num);
        num = num.toFixed(2);


        numSplit = num.split('.');
        int = numSplit [0];
        if( int.length >3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit [1];


        return (type ==='exp' ?  '-' : '+') + ' ' + int +'.' + dec;
    };
        var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++){
            callback(list[i], i)
        }
    };

                return {
        getInput : function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,   // Wil be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
         addListItem: function (obj, type) {
          // Create html string with placeholder text
             var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%">' +
                '<div class="item__description">%description%</div>' +
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">' +
                '<i class="ion-ios-close-outline"></i></button></div></div></div>'}

            else if(type ==='exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix">' +
                '<div class="item__value">%value%</div>' +
                 '<div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>'
             }

             // Replace the placeholder
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert element into DOM
             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

         },
         deleteListItem: function (selectorId) {
            var el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);


        //   document.getElementById(itemID).parentNode.removeChild()

         },

         clearFields: function () {
            var fields, fieldsArr;
               fields = document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue);

             fieldsArr = Array.prototype.slice.call(fields);
               fieldsArr.forEach(function (current, index, array) {
                   current.value = "";

               });
               fieldsArr[0].focus();
         },
            displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : 'exp';
                document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
                document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
                document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
               if(obj.percentage > 0 ) {
                   document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage = obj.percentage + '%';
               } else { document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage = '---';

               }
            },
         displayPercentages: function(percentages){
                var fields = document.querySelectorAll(DOMstrings.expancesPercLabel);



                nodeListForEach(fields, function (current, index) {
                   /// Code percentages??
                    if(percentages[index] > 0 ) {
                        current.textContent = percentages[index] + '%';
                    } else {
                        current.textContent = '---';
                    }
                });


         },


                    displayDate: function () {
            var now, year,month, months;

              now = new Date();
              month = now.getMonth();
              months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień' ];
              year = now.getFullYear();
              document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' '+ year;

         },
                    changedType: function () {
                        var fields;
                        fields = document.querySelectorAll(
                            DOMstrings.inputType + ',' +
                            DOMstrings.inputDescription + ',' +
                            DOMstrings.inputValue);


                        nodeListForEach(fields, function (cur) {
                            cur.classList.toggle('red-focus');
                        });
                        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
                    },

         getDOMStrings : function () {
                return DOMstrings;
         }
        
    };
})();

//////////////////////////////////////////////////////

/////////////GLOBAL APPLICATION CONTROLLER //////////////

//////////////////////////////////////////////////////

var controller = (function (budgetCtrl, UICtrl) {
    //Some code
    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector('.add__btn').addEventListener('click',ctrlAddItem);
        document.addEventListener(DOM.inputBtn, function(event) {
            if (event.keyCode === 13 || event.which === 13 ) {
                ctrlAddItem()
            }
        });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updatePercentages = function () {
        // 1 Calculate percentages
            budgetCtrl.calculatePercentages();
        // 2 Read percentages frum budget controller
            var percentages = budgetCtrl.getPercentages();
        // 3 Update  UI with new percentages
            UICtrl.displayPercentages(percentages);
    };


    var updateBudget = function () {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return the budget
        var budget = budgetCtrl.getBudget();
        // 3.Display the budget on the UI
        UICtrl.displayBudget(budget);

    };


    var ctrlAddItem = function () {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !=="" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3 Ad the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 3.1 Clear fields
            UICtrl.clearFields();

            // 4. Calculate and update budget
            updateBudget();

            // 5 Calculate and update percentages
            updatePercentages();
        }
    };
    var ctrlDeleteItem = function (event) {
        var itemID,splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. delete item from the user interface
            UICtrl.deleteListItem(itemID);
            // 3. Update and show new budget
            updateBudget();
            // 4 Calculate and update percentages
            updatePercentages();
        }
        console.log(itemID)
    };
return{
    init: function () {
        console.log('Application has started,');
        UICtrl.displayDate();
        UICtrl.displayBudget({
            budget : 0,
            totalInc: 0,
            totalExp: 0,
            percentage: -1
        });
        setupEventListeners();
    }
}

})(budgetController, UIController);

controller.init();







