const jwt = require('jsonwebtoken');

const generatePolicy = function (principalId, effect, resource) {
  let authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: 'stringval',
    numberKey: 123,
    booleanKey: true,
  };

  return authResponse;
};

exports.handler = function (event, context, callback) {
  console.log(event);
  console.log(context);
  const token = event.authorizationToken;
  return callback(null, generatePolicy('user', 'Allow', event.methodArn));
  // switch (token) {
  //     case 'allow':
  //         callback(null, generatePolicy('user', 'Allow', event.methodArn));
  //         break;
  //     case 'deny':
  //         callback(null, generatePolicy('user', 'Deny', event.methodArn));
  //         break;
  //     case 'unauthorized':
  //         callback("Unauthorized");   // Return a 401 Unauthorized response
  //         break;
  //     default:
  //         callback("Error: Invalid token"); // Return a 500 Invalid token response
  // }
};
