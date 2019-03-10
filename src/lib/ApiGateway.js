import AWS from 'aws-sdk';

export default class ApiGateway {
  static client(config) {
    return new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: config.requestContext
        ? `https://${config.requestContext.domainName}/${config.requestContext.stage}`
        : `${process.env.API_GATEWAY_URL}`
    });
  }
}
