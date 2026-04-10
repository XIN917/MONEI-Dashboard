import { gql } from "@apollo/client";

export const CHARGE = gql`
  query Charge($id: ID!) {
    charge(id: $id) {
      id
      accountId
      checkoutId
      providerId
      providerInternalId
      providerReferenceId
      createdAt
      updatedAt
      amount
      amountEUR
      authorizationCode
      billingDetails {
        name
        email
        phone
        address {
          line1
          line2
          city
          state
          postalCode
          country
        }
      }
      billingPlan {
        id
        name
      }
      currency
      customer {
        id
        name
        email
        phone
      }
      description
      descriptor
      livemode
      orderId
      storeId
      pointOfSaleId
      terminalId
      sequenceId
      subscriptionId
      paymentMethod {
        type
        brand
        last4
        expMonth
        expYear
      }
      cancellationReason {
        code
        description
      }
      lastRefundAmount
      lastRefundReason {
        code
        description
      }
      refundedAmount
      shippingDetails {
        name
        email
        phone
        address {
          line1
          line2
          city
          state
          postalCode
          country
        }
      }
      shop {
        id
        name
      }
      status
      statusCode
      statusMessage
      sessionDetails {
        id
        ip
        userAgent
      }
      traceDetails {
        id
      }
      pageOpenedAt
      metadata {
        key
        value
      }
      fraudDetectorScore
      callbackUrl
      completeUrl
      failUrl
      cancelUrl
    }
  }
`;
