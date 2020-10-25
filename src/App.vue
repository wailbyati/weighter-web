<template>
  <apollo-query
    :query="
      gql => gql`
        query {
          session {
            id
            deactivated
            user {
              id
              email
            }
          }
        }
      `
    "
  >
    <template v-slot="{ result: { data } }">
      <v-app>
        <v-app-bar :color="!$vuetify.theme.dark ? 'primary' : null" dark app>
          <v-toolbar-title>
            Weighter
          </v-toolbar-title>

          <v-spacer />

          <v-menu
            v-if="data && data.session && !data.session.deactivated"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-account-circle</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>
                  {{ data.session.user.email }}
                </v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item :to="{ name: 'account-settings' }">
                <v-list-item-title>
                  Ustawienia konta
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="logOut()">
                <v-list-item-title>
                  Wyloguj się
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn v-else text :to="{ name: 'log-in' }">
            Zaloguj się
          </v-btn>
        </v-app-bar>

        <v-main>
          <router-view />
        </v-main>

        <template v-if="data">
          <v-bottom-navigation
            v-if="data && data.session && !data.session.deactivated"
            app
            :background-color="!$vuetify.theme.dark ? 'primary' : null"
            dark
          >
            <v-btn :to="{ name: 'home' }" exact>
              <span>Aktualności</span>
              <v-icon>mdi-view-list</v-icon>
            </v-btn>

            <v-btn
              :to="{ name: 'user', params: { userId: data.session.user.id } }"
              exact
            >
              <span>Mój profil</span>
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </v-bottom-navigation>
        </template>
      </v-app>
    </template>
  </apollo-query>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import { Vue, Component } from 'vue-property-decorator'
import { onLogout } from '@/vue-apollo'

@Component
export default class extends Vue {
  async logOut() {
    await this.$apollo.mutate({
      mutation: gql`
        mutation {
          deactivateSession {
            id
            deactivated
          }
        }
      `
    })
    onLogout(this.$apollo.getClient())
    this.$router.push({ name: 'home' })
  }
}
</script>
