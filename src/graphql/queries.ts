import { gql } from "@apollo/client"

export const GET_ALL_NEWS = gql`
  query Query {
    getAllNews {
      title
      description
      image

      type
      _id
      sections {
        title
        content
        images
        listItems
      }
    }
  }
`

export const GET_SINGLE_NEWS = gql`
  query Query($getNewsDetailId: String) {
    getNewsDetail(getNewsDetailId: $getNewsDetailId) {
      _id
      title
      description
      image
      type
      sections {
        title
        content
        images
        listItems
      }
    }
  }
`
