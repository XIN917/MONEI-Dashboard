import { gql } from "@apollo/client";

export const CHARGES = gql`
  query Charges($first: Int, $after: String, $filter: ChargeFilter) {
    charges(first: $first, after: $after, filter: $filter) {
      edges {
        node {
          id
          amount
          currency
          status
          createdAt
          description
          providerReferenceId
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
