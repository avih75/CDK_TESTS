const AWS = require('aws-sdk'); 
const KEY = process.env.KEY || ''; 
const NAME = process.env.NAME || '';

export const handler = (event: any = {}) : any => {
  const requestedUserId = event.pathParameters.id; // take the id from the path
  if (!requestedUserId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter id` };
  }
  else if (KEY=="1" && NAME=="AVI") {
    const response = "good params and and the id is : " + requestedUserId ;
    return { statusCode: 200, body: JSON.stringify(response) };
  }
  else {
      return {statusCode: 400, body: `Error: You are using wrong inner parameters`}
  }  
};