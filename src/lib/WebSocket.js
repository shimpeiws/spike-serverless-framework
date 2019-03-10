import AWS from 'aws-sdk';

export default class WebSocket {
  static client(config) {
    return new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: `https://${config.requestContext.domainName}/${config.requestContext.stage}`
    });
  }
}
