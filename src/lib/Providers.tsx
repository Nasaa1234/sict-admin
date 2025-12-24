"use client"
import React from "react"
import { ApolloProvider } from "@apollo/client"
import { apolloClient } from "@/graphql/apollo-client"
import { AuthProvider } from "@/contexts/AuthContext"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </AuthProvider>
  )
}
