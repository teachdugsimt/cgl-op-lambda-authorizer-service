exports.handler = async (event, context, callback) => {
  // TODO implement
  console.log(event);
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        roles: 'Admin|Driver',
      },
      claimsToSuppress: ['email'],
    },
  };

  // Return to Amazon Cognito
  callback(null, event);
};
