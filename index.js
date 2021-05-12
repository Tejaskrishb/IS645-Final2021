// Required modules 
require("dotenv").config();

const dblib = require("./dblib.js");

const express = require("express");
const app = express();

const multer = require("multer");
const upload = multer();


// Add database package and connection string (can remove ssl)
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Add middleware to parse default urlencoded form
app.use(express.urlencoded({ extended: true }));

// Setup EJS
app.set("view engine", "ejs");

// Application folders
app.use(express.static("public"));

// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

// Setup routes - home is root path
app.get("/", (req, res) => {
    //res.send ("Hello world...");
    res.render("index");
});

//get sum of series page
app.get("/sum", (req, res) => {
    res.render("sumseries");
});


//get import
// app.get("/import", (req, res) => {
//     res.render("import");
// });

app.get("/import", async (req, res) => {
    const totRecs = await dblib.getTotalRecords();
    console.log("Import Call:", totRecs);
    res.render("import", {
        totRecs: totRecs.totRecords,
    });
});

//post import
app.post("/import", upload.single('filename'), async (req, res) => {
    if (!req.file || Object.keys(req.file).length === 0) {
        message = "Error: Import file not uploaded";
        return res.send(message);
    };
    // Declare variables
    let numFailed = 0;
    let numInserted = 0;
    let errorArray = [];
    let errorMessage = "";
    let totRecs = await dblib.getTotalRecords();

    //Read file line by line, inserting records
    const buffer = req.file.buffer;
    const books = buffer.toString().split(/\r?\n/);
    console.log("Total recs",totRecs);
    (async () => {
        console.log("--- STEP 1: Pre-Loop");
        for (book of books) {
            bookRecord = book.split(",");
            if (bookRecord.length > 1) {
                const result = await dblib.insertBooks(bookRecord);
                console.log("result is: ", result);
                if (result.trans === "success") {
                    numInserted++;
                } else {
                    numFailed++;
                    errorMessage = `${result.msg} \r\n`;
                    errorArray.push(errorMessage);
                };
            }
        };
        console.log("--- STEP 4: After-Loop");
        console.log(`Records processed: ${numInserted + numFailed}`);
        console.log(`Records successfully inserted: ${numInserted}`);
        console.log(`Records with insertion errors: ${numFailed}`);
        
        res.send(
            {
                successCount: numInserted,
                errorCount: numFailed,
                errorArray: errorArray,
                initialRec : totRecs.totRecords
            }
        )
    })()
});


