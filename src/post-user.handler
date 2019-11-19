const AWS = require('aws-sdk'); 
const uuidv4 = require('uuid/v4');
const NAME = process.env.NAME || '';
const KEY = process.env.KEY || '';

export const handler =  (event: any = {}) : any => {

  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  }
  else if (KEY=="1" && NAME=="AVI") {
    const user = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    return { statusCode: 201, body: user };
  }
  else {
      return {statusCode: 400, body: `Error: You are using wrong inner parameters`}
  }   
};
