// imports the express framework and modules
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

// express.urlencoded() - Express function = recognises requests as strings or arrays
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("public"));

mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log("Connected to DB.");

        // Listens on port 3000 and runs function
        app.listen(3000, () => console.log("Server Up and running"));       
    })
    .catch((err) => { console.error(err); });

// Sets Express to use EJS
app.set("view engine", "ejs");

/*
app.get('/', (req, res) => {
    // Run 'todo.ejs'
    res.render('todo.ejs');
});
*/

app.get('/', async (req, res) => {
    try {
        const tasksresults = await TodoTask.find({},);
        res.render("todo.ejs", { todoTasks: tasksresults });
    } catch(err) {
        res.send(500, err);
        res.redirect("/");
    }
});

/*
// 'req'(Request) contains the form content which is posted when the user clicks 'add' button
app.post('/', (req, res) => {
    // Logs onto the console the form input
    console.log(req.body);
});
*/

app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch(err) {
        res.send(500, err);
        res.redirect("/");
    }
});

app.route('/remove/:id').get(async (req, res) => {
    try {
        const id = req.params.id;
        await TodoTask.findByIdAndDelete(id);
        res.redirect('/');
    } catch(err) {
        res.status(500).send(err);
    }
})

app.route('/edit/:id')
.get(async (req, res) => {
    try {
        const id = req.params.id;
        const taskedits = await TodoTask.find({},);
        res.render('todoEdit.ejs', { todoTasks: taskedits, idTask: id });
    } catch(err) {
        res.send(500, err);
        res.redirect('/');
    }
})
.post(async (req, res) => {
    try {
        const id = req.params.id;
        await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
        res.redirect('/');
    } catch(err) {
        res.send(500, err);
        res.redirect('/');
    }
});