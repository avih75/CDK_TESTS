const AWS = require('aws-sdk');  

export const handler =  (event: any = {}) : any => {
      return {statusCode: 400, body: `Error: You are using wrong inner parameters`}
};
