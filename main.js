const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
let expenses = [];
let dayLimit = 0;
class Expense {
    constructor(cost, date,name, category) {
        this.cost = Number(cost);
        this.date = StringDate(date);
        this.name = name;
        this.category = category;
    }
}
app.post('/createExpense', (req, res) => {
    const { cost, date, name, category } = req.body;
    if (!cost){
        res.status(400).send('The cost field is empty');
    } else if (Number(req.body.cost) <= 0 || isNaN(req.body.cost) ){
        res.status(400).send('Cost must be a positive');
    } else if (!date){
        res.status(400).send('The date field  is empty');
    } else if (!name){
        res.status(400).send('The name field  is empty');
    } else if (!category){
        res.status(400).send('The category field  is empty');
    } else {
        const expense = new Expense(req.body.name, req.body.category, req.body.cost, req.body.date);
        expenses.push(expense);
        res.status(200).send({
            cost: expense.cost,
            date: expense.date.toLocaleDateString(),
            name: expense.name,
            category: expense.category
        });
    }
});
app.post('/findExpensesByDay', (req, res) => {
    if (!req.body.date){
        res.status(400).send('The date field is empty');
    }else {
        const date = StringDate(req.body.date);
        let expenseFound = [];
        for (let i = 0; i < expenses.length; i++) {
            if (expenses[i].date.getTime() === date.getTime()){
                expenseFound.push({
                    cost: expenses[i].cost,
                    date: expenses[i].date.toLocaleDateString(),
                    name: expenses[i].name,
                    category: expenses[i].category
                });
            }
        }

        if (expenseFound.length){
            res.status(200).send(expenseFound);
        }else {
            res.status(400).send(`No expenses found for ${req.body.date}`);
        }
    }
});
app.post('/setLimitDay', (req, res) => {
    if (!req.body.dayLimit){
        res.status(400).send('The day limit field is empty');
    }else if (isNaN(req.body.dayLimit) || Number(req.body.dayLimit) <= 0){
        res.status(400).send('Day limit must be a positive');
    }else {
        dayLimit = Number(req.body.dayLimit);
        res.status(200).send(`Set a day limit = ${dayLimit}`);
    }
});
app.get('/getLimitDay', (req, res) => {
    res.send(dayLimit.toString());
});
app.get('/getExpenses', (req, res) => {
    if (expenses.length){
        let expenseValue = [];
        for ( let i = 0; i < expenses.length; i++) {
            expenseValue.push({
                cost:expenses[i].cost,
                date:expenses[i].date.toLocaleDateString(),
                name:expenses[i].name,
                category:expenses[i].category
            });
        }
        res.status(200).send(expenseValue);
    }else {
        res.status(400).send('Expenses is empty');
    }
});
function StringDate(stringDate){
    const dateParts = stringDate.split('-');
    return new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
}
app.listen(3000, () => {
    console.log('App is running on port 3000');
});


