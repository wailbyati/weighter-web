<template>
  <v-container>
    <apollo-query
      :query="
        gql => gql`
          query {
            session {
              id
              user {
                id
                displayName
                email
                public
                dateOfBirth
                dateOfBirthVisible
                height
                heightVisible
                createdAt
              }
            }
          }
        `
      "
      @result="
        ({ data }) => {
          if (data && data.session) {
            form.displayName = data.session.user.displayName
            form.dateOfBirth = data.session.user.dateOfBirth || 946684800000
            form.height = data.session.user.height || 170
          }
        }
      "
    >
      <template v-slot="{ result: { data }, isLoading }">
        <v-card :loading="!!isLoading">
          <v-card-title>
            Ustawienia konta
          </v-card-title>

          <v-card-text v-if="data && data.session && data.session.user">
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  Nazwa wyświetlana
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ data.session.user.displayName }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-card-actions>
                <v-dialog v-model="dialogs.displayName" max-width="600px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>

                  <apollo-mutation
                    :mutation="
                      gql => gql`
                        mutation($id: ID!, $displayName: String!) {
                          updateUser(id: $id, displayName: $displayName) {
                            id
                            displayName
                          }
                        }
                      `
                    "
                    :variables="{
                      id: data.session.user.id,
                      displayName: form.displayName
                    }"
                    @done="dialogs.displayName = false"
                  >
                    <template v-slot="{ mutate, loading }">
                      <validation-observer>
                        <template v-slot="{ valid }">
                          <v-form @submit.prevent="mutate">
                            <v-card :loading="loading">
                              <v-card-title>
                                Zmiana nazwy wyświetlanej
                              </v-card-title>

                              <v-card-text>
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
                              </v-card-text>

                              <v-card-actions>
                                <v-btn
                                  color="primary"
                                  type="submit"
                                  :disabled="!valid"
                                >
                                  Zapisz
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-form>
                        </template>
                      </validation-observer>
                    </template>
                  </apollo-mutation>
                </v-dialog>
              </v-card-actions>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-at</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  Adres e-mail
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ data.session.user.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-eye</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  Widoczność profilu
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ data.session.user.public ? 'Publiczny' : 'Prywatny' }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-card-actions>
                <apollo-mutation
                  :mutation="
                    gql => gql`
                      mutation($id: ID!, $public: Boolean!) {
                        updateUser(id: $id, public: $public) {
                          id
                          public
                        }
                      }
                    `
                  "
                  :variables="{
                    id: data.session.user.id,
                    public: !data.session.user.public
                  }"
                >
                  <template v-slot="{ mutate, loading }">
                    <v-btn icon :loading="loading" @click="mutate()">
                      <v-icon v-if="data.session.user.public">
                        mdi-eye-off
                      </v-icon>

                      <v-icon v-else>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </apollo-mutation>
              </v-card-actions>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-calendar</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  Data urodzenia
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    data.session.user.dateOfBirth
                      ? new Date(
                          data.session.user.dateOfBirth
                        ).toLocaleDateString('pl')
                      : 'Nie podano'
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-card-actions>
                <v-dialog v-model="dialogs.dateOfBirth" max-width="600px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>

                  <apollo-mutation
                    :mutation="
                      gql => gql`
                        mutation($id: ID!, $dateOfBirth: Date!) {
                          updateUser(id: $id, dateOfBirth: $dateOfBirth) {
                            id
                            dateOfBirth
                          }
                        }
                      `
                    "
                    :variables="{
                      id: data.session.user.id,
                      dateOfBirth: form.dateOfBirth
                    }"
                    @done="dialogs.dateOfBirth = false"
                  >
                    <template v-slot="{ mutate, loading, error }">
                      {{ error }}
                      <v-form @submit.prevent="mutate">
                        <v-card :loading="loading">
                          <v-card-title>
                            Zmiana daty urodzenia
                          </v-card-title>

                          <v-card-text>
                            <v-date-picker
                              :value="
                                new Date(form.dateOfBirth)
                                  .toISOString()
                                  .split('T')[0]
                              "
                              :max="
                                new Date(
                                  [
                                    parseInt(
                                      new Date().toISOString().split('-')[0]
                                    ) - 18,
                                    new Date().toISOString().split('-')[1],
                                    new Date().toISOString().split('-')[2]
                                  ].join('-')
                                )
                                  .toISOString()
                                  .split('T')[0]
                              "
                              @input="
                                value => {
                                  form.dateOfBirth = new Date(value).getTime()
                                }
                              "
                            />
                          </v-card-text>

                          <v-card-actions>
                            <v-btn color="primary" type="submit">
                              Zapisz
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-form>
                    </template>
                  </apollo-mutation>
                </v-dialog>
              </v-card-actions>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-eye</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  Widoczność daty urodzenia
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    data.session.user.dateOfBirthVisible
                      ? 'Widoczna'
                      : 'Nie widoczna'
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-card-actions>
                <apollo-mutation
                  :mutation="
                    gql => gql`
                      mutation($id: ID!, $dateOfBirthVisible: Boolean!) {
                        updateUser(
                          id: $id
                          dateOfBirthVisible: $dateOfBirthVisible
                        ) {
                          id
                          dateOfBirthVisible
                        }
                      }
                    `
                  "
                  :variables="{
                    id: data.session.user.id,
                    dateOfBirthVisible: !data.session.user.dateOfBirthVisible
                  }"
                >
                  <template v-slot="{ mutate, loading }">
                    <v-btn icon :loading="loading" @click="mutate()">
                      <v-icon v-if="data.session.user.dateOfBirthVisible">
                        mdi-eye-off
                      </v-icon>

                      <v-icon v-else>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </apollo-mutation>
              </v-card-actions>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-human-male-height</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  Wzrost
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    data.session.user.height
                      ? `${data.session.user.height} cm`
                      : 'Nie podano'
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-card-actions>
                <v-dialog v-model="dialogs.height" max-width="600px">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>

                  <apollo-mutation
                    :mutation="
                      gql => gql`
                        mutation($id: ID!, $height: Float!) {
                          updateUser(id: $id, height: $height) {
                            id
                            height
                          }
                        }
                      `
                    "
                    :variables="{
                      id: data.session.user.id,
                      height: form.height
                    }"
                    @done="dialogs.height = false"
                  >
                    <template v-slot="{ mutate, loading }">
                      <validation-observer>
                        <template v-slot="{ valid }">
                          <v-form @submit.prevent="mutate">
                            <v-card :loading="loading">
                              <v-card-title>
                                Zmiana wzrostu
                              </v-card-title>

                              <v-card-text>
                                <validation-provider
                                  v-slot="{ errors }"
                                  name="Wzrost"
                                  rules="required|min_value:100|max_value:300"
                                >
                                  <v-text-field
                                    v-model.number="form.height"
                                    label="Wzrost"
                                    prepend-icon="mdi-human-male-height"
                                    required
                                    type="number"
                                    :error-messages="errors"
                                    suffix="cm"
                                  />
                                </validation-provider>
                              </v-card-text>

                              <v-card-actions>
                                <v-btn
                                  color="primary"
                                  type="submit"
                                  :disabled="!valid"
                                >
                                  Zapisz
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-form>
                        </template>
                      </validation-observer>
                    </template>
                  </apollo-mutation>
                </v-dialog>
              </v-card-actions>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-eye</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>
                  Widoczność wzrostu
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    data.session.user.heightVisible
                      ? 'Widoczna'
                      : 'Nie widoczna'
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-card-actions>
                <apollo-mutation
                  :mutation="
                    gql => gql`
                      mutation($id: ID!, $heightVisible: Boolean!) {
                        updateUser(id: $id, heightVisible: $heightVisible) {
                          id
                          heightVisible
                        }
                      }
                    `
                  "
                  :variables="{
                    id: data.session.user.id,
                    heightVisible: !data.session.user.heightVisible
                  }"
                >
                  <template v-slot="{ mutate, loading }">
                    <v-btn icon :loading="loading" @click="mutate()">
                      <v-icon v-if="data.session.user.heightVisible">
                        mdi-eye-off
                      </v-icon>

                      <v-icon v-else>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                </apollo-mutation>
              </v-card-actions>
            </v-list-item>
          </v-card-text>
        </v-card>
      </template>
    </apollo-query>
  </v-container>
</template>

<script lang="ts">
import gql from 'graphql-tag'
import { Vue, Component } from 'vue-property-decorator'

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
        if (!data.session || data.session.deactivated) {
          this.$router.push({ name: 'log-in' })
        }
      }
    }
  }
})
export default class extends Vue {
  dialogs = {
    displayName: false,
    dateOfBirth: false,
    height: false
  }
  form = {
    displayName: '',
    dateOfBirth: '',
    height: ''
  }
}
</script>
