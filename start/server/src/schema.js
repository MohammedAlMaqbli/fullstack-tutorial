import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    Post(id: ID!): Post
    allPosts(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: PostFilter
    ): [Post]
    _allPostsMeta(
      page: Int
      perPage: Int
      sortField: String
      sortOrder: String
      filter: PostFilter
    ): ListMetadata

    launches(
      """
      The number of results to show. Must be >= 1. Default = 20
      """
      pageSize: Int
      """
      If you add a cursor here, it will only return results _after_ this cursor
      """
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  type Mutation {
    createPost(title: String!, views: Int!, user_id: ID!): Post
    updatePost(id: ID!, title: String!, views: Int!, user_id: ID!): Post
    deletePost(id: ID!): Post
    # if false, signup failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): User

    # for use with the iOS tutorial
    uploadProfileImage(file: Upload!): User
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Post {
    id: ID!
    title: String!
    views: Int!
    user_id: ID!
    User: User
    Comments: [Comment]
  }

  input PostFilter {
    q: String
    id: ID
    title: String
    views: Int
    views_lt: Int
    views_lte: Int
    views_gt: Int
    views_gte: Int
    user_id: ID
  }

  type ListMetadata {
    count: Int!
  }

  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    profileImage: String
    trips: [Launch]!
    token: String
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;

module.exports = typeDefs;
