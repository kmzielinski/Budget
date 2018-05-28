var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var allExpenses =[];
    var allIncomes = [];
    var totalExpanses = 0;

    var data ={
        allItems:{
            exp:[],
            inc: []
        },
        totals:{
            exp: 0,
            inc:0
        }
    };
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            // Create new ID
            if (data.allItems[type] > 0){
            ID = data.allItems[type][data[type].length - 1].id +1;}
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

        }
    };




})();

var UIController = (function () {
        var DOMstrings = {
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list'

        };


                return {
        getInput : function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,   // Wil be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
         addListItem: function (obj, type) {
          // Create html string with placeholder text
             var html, newHtml, element;
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%">' +
                '<div class="item__description">%description%</div>' +
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn">' +
                '<i class="ion-ios-close-outline"></i></button></div></div></div>'}

            else if(type ==='exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix">' +
                '<div class="item__value">%value%</div>' +
                 '<div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>'
             }

             // Replace the placeholder
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert element into DOM
             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

         },

         clearFields: function () {
            var fields, fieldsArr;
               fields = document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue)

             fieldsArr = Array.prototype.slice.call(fields);
               fieldsArr.forEach(function (current, index, array) {
                   current.value = "";

               });
               fieldsArr[0].focus();
         },

         getDOMStrings : function () {
                return DOMstrings;
         }
        
    };
})();

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
    };
    var ctrlAddItem = function () {
        var input, newItem;
        // 1. Get the field input data
        input = UICtrl.getInput();
        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3 Ad the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 3.1 Clear fields
        UICtrl.clearFields();
        // 4. Calculate the budget

        // 5.Display the budget on the UI

    };
return{
    init: function () {
        console.log('Application has started,')
        setupEventListeners();
    }
}

})(budgetController, UIController);

controller.init();







