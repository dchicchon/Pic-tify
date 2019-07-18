const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

require("./config/passport")(passport)

var app = express();

var db = require("./config/keys").MongoURI;

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err))

app.engine("handlebars", exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.urlencoded({extended: false}));

// Express Session
app.use(session({
    secret: "keyboard dog",
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")

    next()
})

app.use(express.static("public"))

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

var PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server started on port ${PORT}`))
