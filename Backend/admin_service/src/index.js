const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const cors = require("cors");
const dotenv = require("dotenv");
const { config } = require("dotenv");
const logger = require("./config/logger");
const authRoutes = require("./routes/auth.route");

const { corsMiddleware } = require("./middleware/cors.middleware");
const errorHandler = require('./middlewares/error.middleware');
const { reqLogger } = require("./middlewares/req.middleware");

const app = express();


app.use(helmet());
app.use(corsMiddleware());
app.use(cookieParser());
app.use(reqLogger);
app.use(express.json());
app.use("/api/v1/auth", authRoutes)


app.get("/", (req, res) => {
    res.send("Hello  from index.js of user-service")


})

app.get("/health", (req, res) => {
    res.status(200).json({ message: "User service is healthy" });
});

app.use(errorHandler)

const startServer = () => {
    try {
        const server = app.listen(config.PORT, () => {
            logger.info(
                `${config.SERVICE_NAME} is running on port ${config.PORT}`

            );
        })

    } catch (error) {
        logger.error(`Error starting ${config.SERVICE_NAME}: ${error.message}`);

    }
}
startServer();