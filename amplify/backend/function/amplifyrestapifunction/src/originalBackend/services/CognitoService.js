const AWS = require("AWS-sdk");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.COG_ACCESS,
  secretAccessKey: process.env.COG_SECRET,
});

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
});

class CognitoService {
  static async registerMember(signObj) {
    const memberEmail = signObj.memberEmail;
    const tempPass = signObj.tempPass;
    // const name = memberInfo.name;
    const params = {
      UserPoolId: "us-east-1_HAwxfut71" /* required */,
      Username: memberEmail /* required */,
      /*   ClientMetadata: {
          "<StringType>": "STRING_VALUE",
          
        }, */
      DesiredDeliveryMediums: [
        /* "SMS" | */ "EMAIL",
        /* more items */
      ],
      ForceAliasCreation: false,
      //MessageAction: RESEND | SUPPRESS,
      TemporaryPassword: tempPass,
      UserAttributes: [
        {
          Name: "email",
          Value: memberEmail,
        },
        {
          Name: "email_verified",
          Value: "true",
        },
        /* more items */
      ],
      ValidationData: [
        {
          Name: "valid_name" /* required */,
          Value: "STRING_VALUE",
        },
        /* more items */
      ],
    };

    return new Promise((res, rej) => {
      cognito.adminCreateUser(params, function (err, data) {
        if (err) {
          rej(err);
        } else {
          res(data);
        }
      });
    });
  }
}

module.exports = CognitoService;
