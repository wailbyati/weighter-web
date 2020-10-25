<template>
  <v-container>
    <v-card>
      <v-card-title>
        Weryfikacja adresu e-mail
      </v-card-title>

      <v-card-text>
        <v-alert v-if="!$route.query.id || !$route.query.secret" type="error">
          Nieprawidłowy token!
        </v-alert>

        <apollo-query
          v-else
          :query="
            gql => gql`
              query($id: ID!) {
                confirmationEmail(id: $id) {
                  id
                  createdAt
                }
              }
            `
          "
          :variables="{
            id: $route.query.id
          }"
        >
          <template v-slot="{ result: { data } }">
            <apollo-mutation
              v-if="data && data.confirmationEmail"
              :mutation="
                gql => gql`
                  mutation($id: ID!, $secret: String!) {
                    confirmEmail(id: $id, secret: $secret) {
                      id
                    }
                  }
                `
              "
              :variables="{
                id: $route.query.id,
                secret: $route.query.secret
              }"
              @done="$router.push({ name: 'log-in' })"
            >
              <template v-slot="{ mutate, loading, error }">
                <template v-if="error">
                  <v-alert
                    v-if="
                      error.graphQLErrors &&
                        error.graphQLErrors.find(
                          error => error.message === 'Invalid token'
                        )
                    "
                    type="error"
                  >
                    Nieprawidłowy token!
                  </v-alert>

                  <v-alert
                    v-else-if="
                      error.graphQLErrors &&
                        error.graphQLErrors.find(
                          error =>
                            error.message === 'Email has already been confirmed'
                        )
                    "
                    type="error"
                  >
                    Ten adres e-mail już został potwierdzony!
                  </v-alert>

                  <v-alert
                    v-else-if="
                      error.graphQLErrors &&
                        error.graphQLErrors.find(
                          error =>
                            error.message === 'Confirmation email has expired'
                        )
                    "
                    type="error"
                  >
                    <p>
                      Ta prośba o potwierdzenie adresu e-mail już wygasła!
                    </p>

                    <v-btn :to="{ name: 'resend-confirmation-email' }" text>
                      Wyślij ponownie
                    </v-btn>
                  </v-alert>
                </template>

                <v-btn :loading="loading" @click="mutate()">
                  Potwierdź adres e-mail
                </v-btn>
              </template>
            </apollo-mutation>

            <v-alert v-else-if="data && !data.confirmationEmail" type="error">
              Nieprawidłowy token!
            </v-alert>
          </template>
        </apollo-query>
      </v-card-text>
    </v-card>
  </v-container>
</template>
