<template>
  <v-container>
    <apollo-mutation
      :mutation="
        gql => gql`
          mutation($email: String!, $password: String!, $userAgent: String!) {
            logIn(email: $email, password: $password, userAgent: $userAgent) {
              id
              secret
              deactivated
            }
          }
        `
      "
      :variables="{ ...form, userAgent }"
      @done="done"
    >
      <template v-slot="{ mutate, loading, error }">
        <validation-observer>
          <template v-slot="{ valid }">
            <v-form @submit.prevent="mutate()">
              <v-card :loading="loading">
                <v-card-title>
                  Logowanie
                </v-card-title>

                <v-card-text>
                  <template v-if="error">
                    <v-alert
                      v-if="
                        error.graphQLErrors &&
                          error.graphQLErrors.find(
                            error =>
                              error.message === 'Invalid email or password'
                          )
                      "
                      type="error"
                    >
                      Nieprawidłowy adres e-mail lub hasło!
                    </v-alert>

                    <v-alert
                      v-else-if="
                        error.graphQLErrors &&
                          error.graphQLErrors.find(
                            error =>
                              error.message ===
                              'Email has not been confirmed yet'
                          )
                      "
                      type="error"
                    >
                      <p>
                        Zanim będziesz mógł się zalogować musisz najpierw
                        potwierdzić swój adres e-mail!
                      </p>

                      <v-btn :to="{ name: 'resend-confirmation-email' }" text>
                        Wyślij ponownie
                      </v-btn>
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
                    name="Hasło"
                    rules="required|min:12"
                  >
                    <v-text-field
                      v-model="form.password"
                      type="password"
                      label="Hasło"
                      prepend-icon="mdi-lock"
                      required
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" type="submit" :disabled="!valid">
                    Zaloguj się
                  </v-btn>

                  <v-spacer />

                  <v-btn text :to="{ name: 'sign-up' }">
                    Zarejestruj się
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
import gql from 'graphql-tag'
import { onLogin } from '@/vue-apollo'
import Bowser from 'bowser'

interface Result {
  data: {
    logIn: {
      id: string
      secret: string
    }
  }
}

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
    password: ''
  }

  get userAgent() {
    const parsedUserAgent = Bowser.parse(window.navigator.userAgent)
    return `${parsedUserAgent.browser.name} ${parsedUserAgent.browser.version} on ${parsedUserAgent.os.name} ${parsedUserAgent.os.versionName}`
  }

  done(result: Result) {
    onLogin(
      this.$apollo.getClient(),
      `${result.data.logIn.id}.${result.data.logIn.secret}`
    )
    this.$router.push({ name: 'home' })
  }
}
</script>
