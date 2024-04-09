/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthError } from './AuthError';
import { HttpStatusCode } from '../utilities/http-status-code';

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  if(securityName !== 'jwt') return;

    const token = getToken(request);

    if (!token) throw new AuthError(HttpStatusCode.UNAUTHORIZED, 'No token provided');
      
    return new Promise((resolve, reject) => {
      jwt.verify(token, 'RANDOM_TOKEN_SECRET', function(err: any, decoded: any) {
        if (err) return reject(new AuthError(HttpStatusCode.UNAUTHORIZED, err.message));

        //verify jwt
        // Check if JWT contains all required scopes
        for (let scope of scopes) {
          if (!decoded.scopes.includes(scope)) return reject(new AuthError(HttpStatusCode.UNAUTHORIZED, 'JWT does not contain required scope.'));
        }

        return resolve(decoded);
      })
    });
      
        
}


export function getToken(request: express.Request): string {
  const header = request.headers.authorization || request.headers.Authorization;

  if (header) {
    const splitted = (<string>header).split(" ");
    const token = splitted[splitted.length - 1];
      if (token) return token;
  }

  return request.body?.token || request.query?.token || request.headers["x-access-token"];
}