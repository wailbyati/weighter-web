<template>
  <v-container>
    <apollo-mutation
      :mutation="
        gql => gql`
          mutation($email: String!) {
            sendConfirmationEmail(email: $email) {
              id
            }
          }
        `
      "
      :variables="{ ...form }"
    >
      <template v-slot="{ mutate, loading, error }">
        <validation-observer>
          <template v-slot="{ valid }">
            <v-form @submit.prevent="mutate()">
              <v-card :loading="loading">
                <v-card-title>
                  Ponownie wysłanie wiadomości potwierdzającej
                </v-card-title>

                <v-card-text>
                  <template v-if="error">
                    <v-alert
                      v-if="
                        error.graphQLErrors &&
                          error.graphQLErrors.find(
                            error =>
                              error.message === 'No user with such email exists'
                          )
                      "
                      type="error"
                    >
                      Nie istnieje konto o takim adresie e-mail!
                    </v-alert>

                    <v-alert
                      v-else-if="
                        error.graphQLErrors &&
                          error.graphQLErrors.find(
                            error =>
                              error.message ===
                              'This email has already been confirmed'
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
                              error.message ===
                              'Last confirmation email was sent in less than a minute'
                          )
                      "
                      type="error"
                    >
                      Musisz poczekać co najmniej 1 minutę przed wysłaniem
                      kolejnej wiadomości potwierdzającej!
                    </v-alert>

                    <v-alert v-else type="error">
                      Wystąpił nieoczekiwany błąd!
                    </v-alert>
                  </template>

                  <validation-provider
                    v-slot="{ errors }"
                    name="Adres e-mail"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="form.email"
                      type="email"
                      label="Adres e-mail"
                      prepend-icon="mdi-at"
                      required
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" type="submit" :disabled="!valid">
                    Wyślij wiadomość potwierdzającą
                  </v-btn>

                  <v-spacer />

                  <v-btn text :to="{ name: 'log-in' }">
                    Przejdź do logowania
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-form>
          </template>
        </validation-observer>
      </template>
    </apollo-mutation>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
  form = {
    email: ''
  }
}
</script>
