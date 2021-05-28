import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import connection from "./connection";
import axios from "axios";

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
  // return {
  //   at_hash: 'vnOM9nA2hMuBb1ceY5ax_Q',
  //   sub: '53930315-2ce4-4a53-9600-7a247378043e',
  //   'cognito:groups': ['cgl-s3-read-only'],
  //   email_verified: true,
  //   roles: 'Admin|Driver',
  //   'cognito:preferred_role': 'arn:aws:iam::911597493577:role/cgl-s3-read-only-test',
  //   iss: 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_yuSKTYKwM',
  //   'cognito:username': 'user001',
  //   'cognito:roles': ['arn:aws:iam::911597493577:role/cgl-s3-read-only-test'],
  //   aud: '321fdqna1g0s3190nkde4j4qif',
  //   event_id: '906687d1-a320-40b8-aec9-fb86e5d1a18c',
  //   token_use: 'id',
  //   auth_time: 1621495162,
  //   exp: 1621498762,
  //   iat: 1621495162
  // }
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

const handler = async (event: any, context: any, callback: any): Promise<any> => {
  try {
    // console.log(event);
    // console.log(context);
    const token = event.headers.Authorization;
    const resourcePath = event.path;
    const httpMethod = event.requestContext.httpMethod;

    const jwk = await getCognitoKeys(process.env.USER_POOL_ID || 'ap-southeast-1_yuSKTYKwM');
    const payload = validateToken(token, jwk.keys[0])

    if (!payload) {
      // return callback(null, generatePolicy('user', 'Deny', event.methodArn));
      return callback('Unauthorized');
    }

    let action: string;

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

    const userRoles: Array<string> | undefined = payload?.roles?.split('|')

    if (!userRoles) {
      // return callback(null, generatePolicy('user', 'Deny', event.methodArn));
      return callback('Unauthorized');
    }

    const conditionRole = userRoles.map((role: string) => `role = '${role}' `).join('OR ')

    const db = await connection();

    const repository = db?.viewResourceAction;
    const roles = await repository.find({
      where: `(${conditionRole}) AND resource = '${resourcePath}' AND action LIKE '${action}%'`,
      select: ['action'],
      order: {
        action: 'ASC',
        id: 'ASC'
      }
    });
    console.log('JSON.stringify(allRoles) :>> ', JSON.stringify(roles));

    if (!roles || !roles.length) {
      // return callback(null, generatePolicy('user', 'Deny', event.methodArn));
      return callback('Unauthorized');
    }

    const responseAction = roles[0].action

    return callback(null, generatePolicy('user', 'Allow', event.methodArn, { action: responseAction }));
  } catch (err) {
    console.log('err :>> ', err);
    // return callback(null, generatePolicy('user', 'Deny', event.methodArn));
    return callback('Unauthorized');
  }
};

// export default handler

handler(
  {
    type: 'REQUEST',
    methodArn: 'arn:aws:execute-api:ap-southeast-1:911597493577:n6s36pb9cj/prod/GET/api/v1/trucks',
    resource: '/api/v1/trucks/{proxy+}',
    path: '/api/v1/trucks',
    httpMethod: 'ANY',
    headers: {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Authorization: 'eyJraWQiOiJnY3pjUXNjSWdDSHdjZENPRE5vZUNQaGdNd1wvd2ZWc0U1T2xLZkpjWHd1Yz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoidm5PTTluQTJoTXVCYjFjZVk1YXhfUSIsInN1YiI6IjUzOTMwMzE1LTJjZTQtNGE1My05NjAwLTdhMjQ3Mzc4MDQzZSIsImNvZ25pdG86Z3JvdXBzIjpbImNnbC1zMy1yZWFkLW9ubHkiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVzIjoiQWRtaW58RHJpdmVyIiwiY29nbml0bzpwcmVmZXJyZWRfcm9sZSI6ImFybjphd3M6aWFtOjo5MTE1OTc0OTM1Nzc6cm9sZVwvY2dsLXMzLXJlYWQtb25seS10ZXN0IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX3l1U0tUWUt3TSIsImNvZ25pdG86dXNlcm5hbWUiOiJ1c2VyMDAxIiwiY29nbml0bzpyb2xlcyI6WyJhcm46YXdzOmlhbTo6OTExNTk3NDkzNTc3OnJvbGVcL2NnbC1zMy1yZWFkLW9ubHktdGVzdCJdLCJhdWQiOiIzMjFmZHFuYTFnMHMzMTkwbmtkZTRqNHFpZiIsImV2ZW50X2lkIjoiOTA2Njg3ZDEtYTMyMC00MGI4LWFlYzktZmI4NmU1ZDFhMThjIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjE0OTUxNjIsImV4cCI6MTYyMTQ5ODc2MiwiaWF0IjoxNjIxNDk1MTYyfQ.cKM_xzZJNz-YLG40eK3wwssjvYZiUFG3y_jwIV4Fi1P-fKSKRM99-8bqyGmQTzAr7uRMTNmqct1khVDsN8LT98dAzMzsbPP-Wx-SR_rqttw1JFHT5FUflst4eMJrCxGzo1iUUUWZ51Lk3A6vRRYHHk4DcciZYqyNR8XQB-qpQxuFynyElZT8lMVsk3H1_WqYMgkZ2gV9Riq4v8EA0o7MnrIFwvZrNelSvuNsnspvjDE40n2VC__H2kOwcQ9AVKPOZNau7ajmb9zPwrv_vKLXrTei75YGwgGFHSHNFotP_ILgUBzqFwHUA8AOOnavGwMOmEqAdxca_x343QGhKvrMWw',
      'Cache-Control': 'no-cache',
      'CloudFront-Forwarded-Proto': 'https',
      'CloudFront-Is-Desktop-Viewer': 'true',
      'CloudFront-Is-Mobile-Viewer': 'false',
      'CloudFront-Is-SmartTV-Viewer': 'false',
      'CloudFront-Is-Tablet-Viewer': 'false',
      'CloudFront-Viewer-Country': 'TH',
      Host: 'n6s36pb9cj.execute-api.ap-southeast-1.amazonaws.com',
      'Postman-Token': '0cadb6de-6c25-464f-9707-c6ffff08390c',
      'User-Agent': 'PostmanRuntime/7.28.0',
      Via: '1.1 0b17f415cf5d7e2917c2c11dbc649d2e.cloudfront.net (CloudFront)',
      'X-Amz-Cf-Id': 'DogypQp_22l86IR2HY25UFVbuvwAQApr9tAD-AwO2k6ceWh_tSAgmQ==',
      'X-Amzn-Trace-Id': 'Root=1-60a60fb8-2e202aad7a387f617df0e516',
      'X-Forwarded-For': '223.206.140.173, 130.176.144.74',
      'X-Forwarded-Port': '443',
      'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
      Accept: ['*/*'],
      'Accept-Encoding': ['gzip, deflate, br'],
      Authorization: [
        'eyJraWQiOiJnY3pjUXNjSWdDSHdjZENPRE5vZUNQaGdNd1wvd2ZWc0U1T2xLZkpjWHd1Yz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoidm5PTTluQTJoTXVCYjFjZVk1YXhfUSIsInN1YiI6IjUzOTMwMzE1LTJjZTQtNGE1My05NjAwLTdhMjQ3Mzc4MDQzZSIsImNvZ25pdG86Z3JvdXBzIjpbImNnbC1zMy1yZWFkLW9ubHkiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVzIjoiQWRtaW58RHJpdmVyIiwiY29nbml0bzpwcmVmZXJyZWRfcm9sZSI6ImFybjphd3M6aWFtOjo5MTE1OTc0OTM1Nzc6cm9sZVwvY2dsLXMzLXJlYWQtb25seS10ZXN0IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoZWFzdC0xLmFtYXpvbmF3cy5jb21cL2FwLXNvdXRoZWFzdC0xX3l1U0tUWUt3TSIsImNvZ25pdG86dXNlcm5hbWUiOiJ1c2VyMDAxIiwiY29nbml0bzpyb2xlcyI6WyJhcm46YXdzOmlhbTo6OTExNTk3NDkzNTc3OnJvbGVcL2NnbC1zMy1yZWFkLW9ubHktdGVzdCJdLCJhdWQiOiIzMjFmZHFuYTFnMHMzMTkwbmtkZTRqNHFpZiIsImV2ZW50X2lkIjoiOTA2Njg3ZDEtYTMyMC00MGI4LWFlYzktZmI4NmU1ZDFhMThjIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MjE0OTUxNjIsImV4cCI6MTYyMTQ5ODc2MiwiaWF0IjoxNjIxNDk1MTYyfQ.cKM_xzZJNz-YLG40eK3wwssjvYZiUFG3y_jwIV4Fi1P-fKSKRM99-8bqyGmQTzAr7uRMTNmqct1khVDsN8LT98dAzMzsbPP-Wx-SR_rqttw1JFHT5FUflst4eMJrCxGzo1iUUUWZ51Lk3A6vRRYHHk4DcciZYqyNR8XQB-qpQxuFynyElZT8lMVsk3H1_WqYMgkZ2gV9Riq4v8EA0o7MnrIFwvZrNelSvuNsnspvjDE40n2VC__H2kOwcQ9AVKPOZNau7ajmb9zPwrv_vKLXrTei75YGwgGFHSHNFotP_ILgUBzqFwHUA8AOOnavGwMOmEqAdxca_x343QGhKvrMWw'
      ],
      'Cache-Control': ['no-cache'],
      'CloudFront-Forwarded-Proto': ['https'],
      'CloudFront-Is-Desktop-Viewer': ['true'],
      'CloudFront-Is-Mobile-Viewer': ['false'],
      'CloudFront-Is-SmartTV-Viewer': ['false'],
      'CloudFront-Is-Tablet-Viewer': ['false'],
      'CloudFront-Viewer-Country': ['TH'],
      Host: ['n6s36pb9cj.execute-api.ap-southeast-1.amazonaws.com'],
      'Postman-Token': ['0cadb6de-6c25-464f-9707-c6ffff08390c'],
      'User-Agent': ['PostmanRuntime/7.28.0'],
      Via: [
        '1.1 0b17f415cf5d7e2917c2c11dbc649d2e.cloudfront.net (CloudFront)'
      ],
      'X-Amz-Cf-Id': ['DogypQp_22l86IR2HY25UFVbuvwAQApr9tAD-AwO2k6ceWh_tSAgmQ=='],
      'X-Amzn-Trace-Id': ['Root=1-60a60fb8-2e202aad7a387f617df0e516'],
      'X-Forwarded-For': ['223.206.140.173, 130.176.144.74'],
      'X-Forwarded-Port': ['443'],
      'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    pathParameters: { proxy: 'is-installed' },
    stageVariables: {},
    requestContext: {
      resourceId: '0omj6d',
      resourcePath: '/api/v1/trucks/{proxy+}',
      httpMethod: 'GET',
      extendedRequestId: 'fndkzHJTyQ0FhAA=',
      requestTime: '20/May/2021:07:28:56 +0000',
      path: '/prod/api/v1/trucks',
      accountId: '911597493577',
      protocol: 'HTTP/1.1',
      stage: 'prod',
      domainPrefix: 'n6s36pb9cj',
      requestTimeEpoch: 1621495736228,
      requestId: '9ecefec1-3590-4a3a-b583-a4933721981f',
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: '223.206.140.173',
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: 'PostmanRuntime/7.28.0',
        user: null
      },
      domainName: 'n6s36pb9cj.execute-api.ap-southeast-1.amazonaws.com',
      apiId: 'n6s36pb9cj'
    }
  },
  {},
  function () { }
);
