#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import s3 = require('@aws-cdk/aws-s3');
import apigateway = require('@aws-cdk/aws-apigateway');  
import lambda = require('@aws-cdk/aws-lambda');

export class Test1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create S3 bucket
    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true
    }); 
    
    // create lambda function1
    const getLambda = new lambda.Function(this, 'getOneUserFunction', {
      code: new lambda.AssetCode('src'),                                 // add code from folder src
      handler: 'get-first-user.ts',                                 // code file name
      runtime: lambda.Runtime.NODEJS_10_X,                               // set the code lang
      environment: {                                                     // passed parameter - Use to iner data
        NAME: "AVI",
        KEY: '1'
      }
    });

    // create new lambda function2 
    const postLambda = new lambda.Function(this, 'postNewUserFunction', {
      code: new lambda.AssetCode('src'),                                  // add code from folder src
      handler: 'post-user.ts',                                       // code file name
      runtime: lambda.Runtime.NODEJS_10_X,                                // set the code lang
      environment: {                                                      // passed parameters - Use to iner data
        PARAM: "AVI",
        KEY: '1',
      }
    });

    // create new lambda function3
    // const newGetLambda = new lambda.Function(this, 'GetAllFunction', {
    //   code: new lambda.AssetCode('src'),                                  // add code from folder src    
    //   handler: 'get-users.ts',                                            // code file name    
    //   runtime: lambda.Runtime.NODEJS_10_X,                                // set the code lang    
    // });

    // create the API
    const api = new apigateway.RestApi(this, 'usersApi', {
      restApiName: 'Users Service'
    });

    const users = api.root.addResource('users');                                // create the root path for the API

    // create the post method to root path 
    const createUserIntegration = new apigateway.LambdaIntegration(postLambda); // conect the lambda to api path
    users.addMethod('POST', createUserIntegration);                             // add the post method to the root path
    
    // const UserIntegration = new apigateway.LambdaIntegration(newGetLambda); // conect the lambda to api path
    // users.addMethod('GET', UserIntegration);                             // add the get method to the root path
    
    addCorsOptions(users);                                                      // make the path open to cross 
    
    // create the get method to another path     
    const getSingleUser = users.addResource('{id}');                        // create the new path path     
    const getUserIntegration = new apigateway.LambdaIntegration(getLambda); // conect the lambda to api path    
    getSingleUser.addMethod('GET', getUserIntegration);                          // add the get method  to the path
  }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },  
    }]
  })
}


const app = new cdk.App();
new Test1Stack(app, 'Test1Stack',{
    env: {
        region: 'us-west-2',
        account: '027065296145' 
    } 
});

// app.synth();   