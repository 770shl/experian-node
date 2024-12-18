import { Experian } from '../experian';
import { get } from '../utils';
import { Request, Response } from 'request';
import { Promise } from 'bluebird';
import { isUndefined } from 'lodash';

let experianInstance: Experian;

/**
 * SBCS API Module Init
 *
 * @param {Experian} instance Experian API Main Module
 */
function init(instance: Experian): void {
    experianInstance = instance;
}

/**
 * Credit Reports
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function creditReports(data: object): Promise<any> {
    return bisRequest('creditreports', data);
}

/**
 * Business API Request
 *
 * @param {string} url Request URL Segment
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function bisRequest(url: string, data: object): Promise<any> {
    const accessToken: string | null = experianInstance.getApiField('auth');

    if (!accessToken) {
        console.log("Access Token Missing");
        throw new Error('User not authenticated - use the "login" method before calling an API');
    }

    const basePath: string = experianInstance.getApiField('basePath');
    const timeout: number = experianInstance.getApiField('timeout');

    return new Promise(function(resolve, reject) {

        request({
            rejectUnauthorized: false,
            method: 'POST',
            baseUrl: basePath,
            timeout: timeout,
            json: true,
            uri: '/consumerservices/consumercreditprofile/v1/' + url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: data
        }, function(error: any, response: Response, body: any) {

            if (error) {
                return reject(error);
            } else if (response.statusCode === 200) {
                //Checks to see if the 'success' boolean in the response is true
                const creditProfile: any = get(body, 'creditProfile', null);
                if (!isUndefined(creditProfile) && creditProfile !== null) {
                    //Successful response
                    return resolve(body);
                } else {
                    //Unsucessful response
                    return reject(body);
                }
            } else {
                return reject(body);
            }
        });
    });
}

export {
    init,
    creditReports
};
