import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
// import connection from "./plugins/connection";
import axios from "axios";
// import { Like } from "typeorm";

interface StatementOne {
  Action?: string
  Effect?: string
  Resource?: any
}

interface PolicyDocument {
  Version?: string
  Statement?: Array<any>
}

interface AuthenResponse {
  principalId?: string
  policyDocument?: PolicyDocument
  context?: any
}

const getCognitoKeys = async (userPoolId: string) => {
  const url = `https://cognito-idp.${process.env.AWS_REGION || 'ap-southeast-1'}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
  const result = await axios.get(url)
    .then(response => response.data);
  console.log('result :>> ', result);
  return result;
}

const generatePolicy = function (principalId: string, effect: string, resource: any, responseData?: object | undefined): AuthenResponse {
  let authResponse: AuthenResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: PolicyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne: StatementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  authResponse.context = responseData

  return authResponse;
};

const validateToken = (token: string, key: any): any => {
  const pem = jwkToPem(key);
  let result = null
  jwt.verify(token, pem, (err: any, decoded: any): void => {
    console.log('decoded :>> ', decoded);
    if (decoded) {
      const expireTime = decoded.exp
      console.log('expireTime > Math.floor(Date.now() / 1000)', expireTime > Math.floor(Date.now() / 1000))
      if (expireTime > Math.floor(Date.now() / 1000)) {
        result = decoded
      }
    }
  });
  return result
}

const convertHttpMethodToAction = (httpMethod: string) => {
  let action: string
  switch (httpMethod) {
    case 'GET':
      action = 'read';
      break;
    case 'POST':
      action = 'create';
      break;
    case 'PUT':
      action = 'update';
      break;
    case 'PATCH':
      action = 'update';
      break;
    case 'DELETE':
      action = 'delete';
      break;
    default:
      action = 'read';
      break;
  }
  return action;
}

export const handler = async (event: any, context: any, callback: any): Promise<any> => {
  try {
    console.log('event :>> ', event);
    return generatePolicy('user', 'Allow', event.methodArn);
    // const token = event.headers.Authorization;
    // const resourcePath = event.path;
    // const httpMethod = event.requestContext.httpMethod;

    // const jwk = await getCognitoKeys(process.env.USER_POOL_ID || 'ap-southeast-1_yuSKTYKwM');
    // const payload = validateToken(token, jwk.keys[0])

    // if (!payload) {
    //   return callback('Unauthorized');
    // }

    // const action: string = convertHttpMethodToAction(httpMethod);
    // const userId: number | undefined = payload?.userId;

    // if (!userId) {
    //   return callback('Unauthorized');
    // }

    // const db = await connection();

    // const repository = db?.vwUserRoleResource;
    // const roles = await repository.find({
    //   where: {
    //     user_id: userId,
    //     url: resourcePath,
    //     action: Like(`${action}%`)
    //   },
    //   select: ['action'],
    //   order: {
    //     action: 'ASC',
    //     id: 'ASC'
    //   }
    // });
    // console.log('JSON.stringify(allRoles) :>> ', JSON.stringify(roles));

    // if (!roles || !roles.length) {
    //   return callback('Unauthorized');
    // }

    // const responseAction = roles[0].action
    // return generatePolicy('user', 'Allow', event.methodArn, { action: responseAction });
  } catch (err) {
    console.log('err :>> ', err);
    return callback('Unauthorized');
  }
};
