const app = require('./app');
const GlobalError = require('./Controllers/errorController');
const appError = require('./utils/appError');

const dotenv = require('dotenv');
const cors = require('cors')




// add .env variables
dotenv.config({ path: '.env' });

// connect to DB
const { connect_database } = require('./Config/ConnectDB')();

app.use(cors({
    origin: ["*"]
}));

const Port = 3000;


app.listen(Port, () => {
    console.log(`app is running on port ${Port}`);
})


app.all("*", (req, res, next) => {
    // if next has argument express automaticly will skip all middlewares and go to our error handler middlerware
    next(new AppErorr(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(GlobalError);
