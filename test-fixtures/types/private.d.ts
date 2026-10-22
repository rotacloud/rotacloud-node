export interface EndpointResponseDetails {
  value: string;
}

export interface SdkEndpointResponse {
  nested: EndpointResponseDetails;
}

export interface UnusedEndpointResponse {
  secret: string;
}
