import { gql } from "@apollo/client";

export const CHARGES_DATE_RANGE_KPI = gql`
  query ChargesDateRangeKPI($startDate: Int, $endDate: Int) {
    chargesDateRangeKPI(startDate: $startDate, endDate: $endDate) {
      currency
      total {
        succeededAmount
        succeededCount
        capturedAmount
        capturedCount
        directAmount
        directCount
        canceledAmount
        canceledCount
        refundedAmount
        refundedCount
        failedAmount
        failedCount
        cuSucceededAmount
        cuSucceededCount
        cuCapturedAmount
        cuCapturedCount
        cuDirectAmount
        cuDirectCount
      }
      data {
        timestamp
        succeededAmount
        succeededCount
        capturedAmount
        capturedCount
        directAmount
        directCount
        canceledAmount
        canceledCount
        refundedAmount
        refundedCount
        failedAmount
        failedCount
        cuSucceededAmount
        cuSucceededCount
        cuCapturedAmount
        cuCapturedCount
        cuDirectAmount
        cuDirectCount
      }
    }
  }
`;
