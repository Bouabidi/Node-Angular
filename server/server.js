const compression = require('compression');
const express = require("express");
const bodyParser = require("body-parser");
const logger = require('logger').createLogger(); 
const cors = require("cors");


const app = express();
const expressSwagger = require('express-swagger-generator')(app);

app.use(compression());

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:8080',
        basePath: '/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/**/*.js'] //Path to the API handle folder
};
expressSwagger(options)

var corsOptions = {
    origin: "http"
};

app.use(cors());


app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() => {
    logger.info("Drop and re-sync db.");
});


app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
});