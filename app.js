if(process.env.NODE_ENV != "production"){
	require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema , reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLASDB_URL;


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const store = MongoStore.create({
	mongoUrl : dbUrl,
	crypto : {
		secret : process.env.SECRET,
	},
	touchAfter : 24*3600,
});

store.on("error" , () =>{
	console.log("ERROR IN MONGO SESSION STORE", error);
});

const sessionOptions = {
	store,
	secret : process.env.SECRET,
	resave : false,
	saveUninitialized : true,
	cookie : {
		expires : Date.now() + 7*24*60*60*1000,
		maxAge : 7*24*60*60*1000,
		httpOnly : true,
	},
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user; 
	next(); 
})

const path = require("path");
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true})); 
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


main()
.then(() =>{
	console.log("connected to DB");
})
.catch(err => console.log(err));
async function main() {
	// await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
	await mongoose.connect(dbUrl);
  }

app.listen(8080 , () =>{
	console.log("server is listening at the port 8080");
});

// app.get("/" , (req,res) =>{
// 	res.send("Hi, I am root");
// });

// demo user for authentication
// app.get("/demouser", async(req,res) =>{
// 	let fakeUser = new User({
// 		email : "student@gmail.com",
// 		username : "delta-student",
// 	});

// 	let registeredUser = await User.register(fakeUser , "helloworld");
// 	res.send(registeredUser);
// }); 


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// app.get("/testListing", async(req,res) => {
// 	let sampleListing = new Listing ({
// 		title: "My New Villa",
// 		description : "By the beach",
// 		price : 12000,
// 		location : "Calanguate , Goa",
// 		country : "India"
// 	});

// 	await sampleListing.save();
// 	console.log("sample was save");
// 	res.send("successful");
// });

// custom error handling

app.all("*", (req,res,next) =>{
	next(new ExpressError(404,"Page not found!"));			// if middleware does not match with any error than this middleware work
});

app.use((err,req,res,next) =>{
	let {statusCode=500 , message= "Something went wrong!"} = err;
	res.status(statusCode).render("error.ejs", {message});
	// res.status(statusCode).send(message);
});