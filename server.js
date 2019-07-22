const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

require("./config/passport")(passport)

var app = express();

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/pictify"

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
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

// Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/test", require("./routes/test"))

// This is our port number depending on if we are using a third party service like heroku or our own localhost
var PORT = process.env.PORT || 4815;

// Have the server start!
app.listen(PORT, console.log(`Server started on port ${PORT}`))
