import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as request from 'request';
import Experian from '../experian';
import * as utils from '../utils';

let experianInstance: Experian;

/**
 * Business API Module Init
 *
 * @param {Experian} instance Experian API Main Module
 */
function init(instance: Experian) {
    experianInstance = instance;
}

/**
 * Business Search
 *
 * @param {object} data Search Request Object
 * @returns {Promise} Request as a promise
 */
function search(data: object): Promise<any> {
    return bisRequest('search', data);
}

/**
 * Business Headers
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function headers(data: object): Promise<any> {
    return bisRequest('headers', data);
}

/**
 * Business Facts
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function facts(data: object): Promise<any> {
    return bisRequest('facts', data);
}

/**
 * Business Fraud Shield
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function fraudShields(data: object): Promise<any> {
    return bisRequest('fraudshields', data);
}

/**
 * Business Risk Dashboard
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function riskDashboards(data: object): Promise<any> {
    return bisRequest('riskDashboards', data);
}

/**
 * Business Bankruptcies
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function bankruptcies(data: object): Promise<any> {
    return bisRequest('bankruptcies', data);
}

/**
 * Business Scores
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function scores(data: object): Promise<any> {
    return bisRequest('scores', data);
}

/**
 * Business Trades
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function trades(data: object): Promise<any> {
    return bisRequest('trades', data);
}

/**
 * Business Credit Status
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function creditStatus(data: object): Promise<any> {
    return bisRequest('creditstatus', data);
}

/**
 * Business Corporate Linkage
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function corporateLinkage(data: object): Promise<any> {
    return bisRequest('corporatelinkage', data);
}

/**
 * Business Legal Collection Summaries
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function legalCollectionSummaries(data: object): Promise<any> {
    return bisRequest('legalcollectionsummaries', data);
}

/**
 * Business Liens
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function liens(data: object): Promise<any> {
    return bisRequest('liens', data);
}

/**
 * Business Judgements
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function judgments(data: object): Promise<any> {
    return bisRequest('judgments', data);
}

/**
 * Business Collections
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function collections(data: object): Promise<any> {
    return bisRequest('collections', data);
}

/**
 * Business UCC Filings
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function uccFilings(data: object): Promise<any> {
    return bisRequest('uccfilings', data);
}

/**
 * Business Corporate Registrations
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function corporateRegistrations(data: object): Promise<any> {
    return bisRequest('corporateregistrations', data);
}

/**
 * Business Business Contacts
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function businessContacts(data: object): Promise<any> {
    return bisRequest('businesscontacts', data);
}

/**
 * Business Reverse Addresses
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reverseAddresses(data: object): Promise<any> {
    return bisRequest('reverseaddresses', data);
}

/**
 * Business Reverse Phones
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reversePhones(data: object): Promise<any> {
    return bisRequest('reversephones', data);
}

/**
 * Business Reverse TaxIDs
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reverseTaxIDs(data: object): Promise<any> {
    return bisRequest('reversetaxids', data);
}

/**
 * Business Scores Search
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function scoresSearch(data: object): Promise<any> {
    return bisRequest('scores/search', data);
}

/**
 * Premier Profiles
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reportsPremierProfiles(data: object): Promise<any> {
    return bisRequest('reports/premierprofiles', data);
}

/**
 * Premier Profiles HTML
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reportsPremierProfilesHtml(data: object): Promise<any> {
    return bisRequest('reports/premierprofiles/html', data);
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
 * Business MultiSegments
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function multisegments(data: object): Promise<any> {
    return bisRequest('multisegments', data);
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
        throw new Error('User not authenticated - use the "login" method before calling an API');
    }

    const basePath = experianInstance.getApiField('basePath');
    const timeout = experianInstance.getApiField('timeout');

    return new Promise((resolve, reject) => {
        request({
            rejectUnauthorized: false,
            method: 'POST',
            baseUrl: basePath,
            timeout: timeout,
            json: true,
            uri: '/businessinformation/businesses/v1/' + url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: data
        }, (error, response, body) => {
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
    facts,
    fraudShields,
    riskDashboards,
    bankruptcies,
    scores,
    trades,
    creditStatus,
    corporateLinkage,
    legalCollectionSummaries,
    liens,
    judgments,
    collections,
    uccFilings,
    corporateRegistrations,
    businessContacts,
    reverseAddresses,
    reversePhones,
    reverseTaxIDs,
    scoresSearch,
    reportsPremierProfiles,
    reportsPremierProfilesHtml,
    aggregates,
    multisegments
};
