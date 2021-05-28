require('dotenv').config();
const lambdaAuth = require('./dist/lambda-authorizer').default;

const run = async (event) => {
  await lambdaAuth(event);
};

run({
  type: 'TOKEN',
  authorizationToken: 'incoming-client-token',
  methodArn:
    'arn:aws:execute-api:ap-southeast-1:123456789012:example/prod/POST/{proxy+}',
});
