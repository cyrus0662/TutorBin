const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

const routes = require("./routes/index");

// Handle CORS error
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/api/v1', routes);

app.get("/health", (req, res) => {
    res.status(200).send("Health Check !!");
});

// Handle 404 for not found URL
app.use((req, res, next) => {
    const error = new Error("URL Not Found");
    error.status = 404
    next(error);
})

// Handle Error thrown by API
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

module.exports = routes;