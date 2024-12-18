"use strict";

import * as Promise from "bluebird";
import * as _ from "lodash";
import * as request from "request";
import Experian from "../experian";
import * as utils from "../utils";

let experianInstance: Experian;

/**
 * BOP API Module Init
 *
 * @param {Experian} instance Experian API Main Module
 */
function init(instance: Experian) {
  experianInstance = instance;
}

/**
 * BOP Reports
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reportsBop(data: object): Promise<any> {
  return bisRequest("reports/bop", data);
}

/**
 * BOP Reports HTML
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reportsBopHtml(data: object): Promise<any> {
  return bisRequest("reports/bop/html", data);
}

/**
 * BOP Reports PDF
 *
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function reportsBopPdf(data: object): Promise<any> {
  return bisRequest("reports/bop/pdf", data);
}

/**
 * Business API Request
 *
 * @param {string} url Request URL Segment
 * @param {object} data Request Object
 * @returns {Promise} Request as a promise
 */
function bisRequest(url: string, data: object): Promise<any> {
  const accessToken: string = experianInstance.getApiField("auth");

  if (!accessToken) {
    console.log("Access Token Missing");
    throw new Error(
      'User not authenticated - use the "login" method before calling an API'
    );
  }

  const basePath: string = experianInstance.getApiField("basePath");
  const timeout: number = experianInstance.getApiField("timeout");

  return new Promise(function (resolve, reject) {
    request(
      {
        rejectUnauthorized: false,
        method: "POST",
        baseUrl: basePath,
        timeout: timeout,
        json: true,
        uri: "/businessinformation/businessowners/v1/" + url,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: data,
      },
      function (error, response, body) {
        if (error) {
          return reject(error);
        } else if (response.statusCode === 200) {
          //Checks to see if the 'success' boolean in the response is true
          const success: boolean = utils.get(body, "success", false);
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
      }
    );
  });
}

export = {
  init: init,
};

export const us = {
  reportsBop: reportsBop,
  reportsBopHtml: reportsBopHtml,
  reportsBopPdf: reportsBopPdf,
};
