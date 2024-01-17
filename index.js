const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const mongodb = require('./db');
const app = express();
const PORT = 8000;
mongodb().then(() => {
    app.use(cors(
        {
            origin: '*'
        }

    ));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use('/api',require('./Routes/Createuser'));
    app.use('/api',require('./Routes/Secretlist'));
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}).catch((err)=>console.log(err));