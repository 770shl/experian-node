import * as Promise from "bluebird";
import * as utils from "./utils";
import * as request from "request";

Experian.DEFAULT_BASE_PATH = "https://us-api.experian.com";
Experian.DEFAULT_SANDBOX_BASE_PATH = "https://sandbox-us-api.experian.com";
Experian.DEFAULT_API_VERSION = "v1";

// Use node's default timeout
Experian.DEFAULT_TIMEOUT = require("http").createServer().timeout;

import * as businessInformation from "./businessinformation";
import * as sbcsInformation from "./sbcsinformation";
import * as consumerCreditProfileInformation from "./consumerCreditProfileInformation";
import * as businessOwners from "./businessOwners";

//var consumerCreditProfileInformation = require('./consumerCreditProfileInformation');

interface ExperianApi {
  clientId: string;
  clientSecret: string;
  basePath: string;
  version: string;
  timeout: number;
  auth: string | null;
}

/**
 * Create an Experian API instance
 * Get Your App Client ID and Client Secret at:
 * https://developer.experian.com/user/me/apps
 *
 * @param {string} clientId Experian API App Client ID
 * @param {string} clientSecret Experian API App Client Secret
 * @param {string} [version='v1'] Experian API App version
 * @param {boolean} [sandbox=false] Experian API App sandbox mode
 * @returns {Experian} Experian API Instance
 */
class Experian {
  static DEFAULT_BASE_PATH: string;
  static DEFAULT_SANDBOX_BASE_PATH: string;
  static DEFAULT_API_VERSION: string;
  static DEFAULT_TIMEOUT: number;

  private _api: ExperianApi;

  constructor(
    clientId: string,
    clientSecret: string,
    version?: string,
    sandbox?: boolean
  ) {
    if (!clientId) {
      throw new Error("No Client ID Provided");
    }
    if (!clientSecret) {
      throw new Error("No Client Secret Provided");
    }

    this._api = {
      clientId: clientId,
      clientSecret: clientSecret,
      basePath: sandbox
        ? Experian.DEFAULT_SANDBOX_BASE_PATH
        : Experian.DEFAULT_BASE_PATH,
      version: Experian.DEFAULT_API_VERSION,
      timeout: Experian.DEFAULT_TIMEOUT,
      auth: null,
    };

    if (version) {
      this.setApiVersion(version);
    }

    businessInformation.init(this);
    sbcsInformation.init(this);
    consumerCreditProfileInformation.init(this);
    businessOwners.init(this);

    //console.log('Experian Instance Created');
  }

  private _setApiField(key: keyof ExperianApi, value: any) {
    this._api[key] = value;
  }

  getApiField(key: keyof ExperianApi) {
    return this._api[key];
  }

  setTimeout(timeout: number | null) {
    this._setApiField(
      "timeout",
      timeout == null ? Experian.DEFAULT_TIMEOUT : timeout
    );
  }

  setApiVersion(version: string) {
    if (version) {
      this._setApiField("version", version);
    }
  }

  setApiKey(key: string) {
    if (key) {
      this._setApiField("auth", "Bearer " + key);
    }
  }

  /**
   * Login to Experian API to authenticate access
   *
   * @param {string} [username] Username of the authorized API user
   * @param {string} [password] Password of the authorized API user
   * @returns {Promise}
   */
  login(username: string, password: string): Promise<any> {
    if (!username) {
      throw new Error("No Username Provided");
    }
    if (typeof username != "string") {
      throw new Error("Username Is Not A String");
    }
    if (!password) {
      throw new Error("No Password Provided");
    }
    if (typeof password != "string") {
      throw new Error("Password Is Not A String");
    }

    return new Promise((resolve, reject) => {
      request(
        {
          rejectUnauthorized: false,
          method: "POST",
          baseUrl: this.getApiField("basePath"),
          json: true,
          uri: "/oauth2/" + this.getApiField("version") + "/token",
          headers: {
            client_id: this.getApiField("clientId"),
            client_secret: this.getApiField("clientSecret"),
            "Content-Type": "application/json",
            grant_type: "password",
          },
          body: {
            username: username,
            password: password,
          },
        },
        (error, response, body) => {
          if (error) {
            return reject(error);
          } else if (response.statusCode === 200) {
            const accessToken = utils.get(body, "access_token", null);
            if (accessToken) {
              this._setApiField("auth", accessToken);
              return resolve(body);
            } else {
              return reject(body);
            }
          } else {
            return reject(body);
          }
        }
      );
    });
  }

  business = businessInformation;
  sbcs = sbcsInformation;
  consumerCreditProfile = consumerCreditProfileInformation;
  bop = businessOwners;
}

export = Experian;
