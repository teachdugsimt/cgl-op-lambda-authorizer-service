import connection from "./connection";

const handler = async (event: any, context: any, callback: any): Promise<any> => {
  // TODO implement
  const userId = event.request?.userAttributes['custom:userId']
  // if (userId) {
  const db = await connection();

  const repository = db?.viewUserRole;
  const userRole = await repository.find({
    where: { user_id: userId },
    select: ['role_name']
  });

  const roles = userRole?.map((user: any) => user.role_name);
  const strRole = roles.join('|');

  console.log(event);
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
        // roles: 'Admin|Driver',
        roles: strRole,
      },
      // claimsToSuppress: ['email'],
    },
  };
  // }

  // Return to Amazon Cognito
  callback(null, event);
};
