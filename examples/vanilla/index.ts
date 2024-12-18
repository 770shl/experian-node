'use strict';
import Experian from 'experian-node';

//Create instance of Experian API
const myExperianAPI = new Experian(CLIENT_ID, CLIENT_SECRET);

//Login Method - Returns a promise
myExperianAPI.login(EXPERIAN_USERNAME, EXPERIAN_PASSWORD)
    .then((result: any) => {

        //Make a request to the business - Business Headers API with a BIN and Subcode
        myExperianAPI.business.us.headers({
                subcode: "1234567",
                bin: "1234567"
            })
            .then(function(data: any) {
                //Success
                console.log(data);
            }, function(error: any) {
                //Error
                console.error(error);
            });

    });
