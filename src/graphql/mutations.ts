import { gql } from "@apollo/client"

export const ADD_NEWS = gql`
  mutation AddNews($input: NewsInput) {
    addNews(input: $input) {
      _id
      title
      description
      image
      type
      sections {
        title
        content
        images
      }
    }
  }
`

export const DELETE_NEWS = gql`
  mutation DeleteNews($newsId: String) {
    deleteNews(newsId: $newsId) {
      success
      message
    }
  }
`

export const EDIT_NEWS = gql`
  mutation EditNews($newsId: String!, $input: NewsInput) {
    editNews(newsId: $newsId, input: $input) {
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
