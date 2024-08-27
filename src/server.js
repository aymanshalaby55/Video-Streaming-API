const app = require('./app');

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