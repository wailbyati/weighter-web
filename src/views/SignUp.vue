<template>
  <v-container>
    <apollo-mutation
      :mutation="
        gql => gql`
          mutation($email: String!, $displayName: String!, $password: String!) {
            signUp(
              email: $email
              displayName: $displayName
              password: $password
            ) {
              id
              displayName
              createdAt
            }
          }
        `
      "
      :variables="{
        ...form
      }"
      @done="done = true"
    >
      <template v-slot="{ mutate, loading, error }">
        <v-card :loading="loading">
          <v-card-title>
            Rejestracja
          </v-card-title>

          <validation-observer v-if="!done" v-slot="{ valid }">
            <v-form @submit.prevent="mutate()">
              <v-card-text>
                <template v-if="error">
                  <v-alert
                    v-if="
                      error.graphQLErrors &&
                        error.graphQLErrors.find(
                          error => error.message === 'Email already in use'
                        )
                    "
                    type="error"
                  >
                    Konto o takim adresie e-mail już istnieje!
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

                <validation-provider
                  v-slot="{ errors }"
                  name="Nazwa wyświetlana"
                  rules="required|min:4|max:64"
                >
                  <v-text-field
                    v-model="form.displayName"
                    label="Nazwa wyświetlana"
                    prepend-icon="mdi-account"
                    counter="64"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>

                <validation-provider
                  v-slot="{ errors }"
                  name="Hasło"
                  rules="required|min:12"
                >
                  <v-text-field
                    v-model="form.password"
                    type="password"
                    label="Hasło"
                    prepend-icon="mdi-lock"
                    counter
                    required
                    :error-messages="errors"
                  />
                </validation-provider>

                <v-checkbox v-model="form.adult" required>
                  <template v-slot:label>
                    Potwierdzam, że mam ukończone 18 lat.
                    <span class="red--text">*</span>
                  </template>
                </v-checkbox>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="primary"
                  type="submit"
                  :disabled="!valid || !form.adult"
                >
                  Utwórz konto
                </v-btn>

                <v-spacer />

                <v-btn text :to="{ name: 'log-in' }">
                  Zaloguj się
                </v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>

          <template v-else>
            <v-card-text>
              <v-alert type="success">
                Pomyślnie utworzono konto. Na podany adres e-mail została
                wysłana wiadomość z linkiem umożliwiającym weryfikację konta.
              </v-alert>
            </v-card-text>

            <v-card-actions>
              <v-btn :to="{ name: 'log-in' }">
                Przejdź do logowania
              </v-btn>
            </v-card-actions>
          </template>
        </v-card>
      </template>
    </apollo-mutation>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import gql from 'graphql-tag'

@Component({
  apollo: {
    session: {
      query: gql`
        query {
          session {
            id
            deactivated
          }
        }
      `,
      result({ data }) {
        if (data.session && !data.session.deactivated) {
          this.$router.push({ name: 'home' })
        }
      }
    }
  }
})
export default class extends Vue {
  form = {
    email: '',
    displayName: '',
    password: '',
    adult: false
  }
  done = false
}
</script>
