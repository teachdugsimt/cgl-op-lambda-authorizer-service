require('dotenv').config();
const typeorm = require('typeorm');
const EntitySchema = typeorm.EntitySchema;
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
/*
const handler = async function (event, context, callback) {
  console.log(event);
  console.log(context);
  const token = event.authorizationToken;

  new InitialService.default();

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

handler(
  {
    type: 'TOKEN',
    authorizationToken: 'incoming-client-token',
    methodArn:
      'arn:aws:execute-api:ap-southeast-1:123456789012:example/prod/POST/{proxy+}',
  },
  {},
  function () {}
);
*/

const handler = async function (event, context, callback) {
  const connection = await typeorm.createConnection({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: '@t;ll4RT10032538',
    database: 'postgres',
    synchronize: true,
    logging: true,
    entities: [
      // new EntitySchema(require('./models/resource')),
      // new EntitySchema(require('./models/resource-action')),
      new EntitySchema({
        name: 'Role',
        tableName: 'role',
        columns: {
          id: {
            primary: true,
            type: 'int4',
            // generated: true,
          },
          name: {
            type: 'varchar',
          },
        },
      }),
      // new EntitySchema(require('./models/view-resource-action')),
    ],
  });

  // const roleRepository = connection.getRepository('role');
  // const allRoles = roleRepository.find();
  // console.log('allRoles :>> ', allRoles);
  // return allRoles;
  console.log('End');
  return true;
};

handler(
  {
    type: 'TOKEN',
    authorizationToken: 'incoming-client-token',
    methodArn:
      'arn:aws:execute-api:ap-southeast-1:123456789012:example/prod/POST/{proxy+}',
  },
  {},
  function () {}
);
