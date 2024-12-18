import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as request from 'request';
import { Experian } from '../experian';
import * as utils from '../utils';

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
 * SBCS Headers
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function headers(data: object): Promise<any> {
    return bisRequest('headers', data);
}

/**
 * SBCS Search
 *
 * @param {object} data Search Request Object
 * @returns {Promise} Request as a promise
 */
function search(data: object): Promise<any> {
    return bisRequest('search', data);
}

/**
 * Business Aggregates
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function aggregates(data: object): Promise<any> {
    return bisRequest('aggregates', data);
}

/**
 * Premier Profiles HTML
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reportsSbcsHtml(data: object): Promise<any> {
    return bisRequest('reports/sbcs/html', data);
}

/**
 * Business API Request
 *
 * @param {string} url Request URL Segment
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function bisRequest(url: string, data: object): Promise<any> {
    const accessToken = experianInstance.getApiField('auth');

    if (!accessToken) {
        console.log("Access Token Missing");
        throw new Error('User not authenticated - use the "login" method before calling an API');
    }

    const basePath = experianInstance.getApiField('basePath');
    const timeout = experianInstance.getApiField('timeout');

    return new Promise(function(resolve, reject) {

        request({
            rejectUnauthorized: false,
            method: 'POST',
            baseUrl: basePath,
            timeout: timeout,
            json: true,
            uri: '/businessinformation/sbcs/v1/' + url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: data
        }, function(error, response, body) {

            if (error) {
                return reject(error);
            } else if (response.statusCode === 200) {
                //Checks to see if the 'success' boolean in the response is true
                const success = utils.get(body, 'success', false);
                if (success === true) {
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
    search,
    headers,
    aggregates,
    reportsSbcsHtml
};
