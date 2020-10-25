<template>
  <v-dialog
    :value="value"
    max-width="600px"
    scrollable
    @input="value => $emit('input', value)"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on">
        Zobacz więcej...
      </v-btn>
    </template>

    <v-card scrollable>
      <v-card-title>
        Obserwujący

        <v-spacer />

        <v-btn icon @click="$emit('input', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-tabs v-if="showPending" v-model="tab" centered grow>
          <v-tab>Oczekujący</v-tab>
          <v-tab>Zatwierdzeni</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item>
            <apollo-query
              :query="
                gql => gql`
                  query($id: ID!, $cursor: ID) {
                    user(id: $id) {
                      id
                      followedBy(take: 25, cursor: $cursor, accepted: false) {
                        data {
                          id
                          accepted
                          follower {
                            id
                            displayName
                          }
                        }
                      }
                    }
                  }
                `
              "
              :variables="{
                id: $route.params.userId
              }"
            >
              <template v-slot="{ result: { data }, isLoading, query }">
                <v-card flat :loading="!!isLoading">
                  <v-card-text v-if="data && data.user">
                    <v-list>
                      <template v-for="follow in data.user.followedBy.data">
                        <v-list-item
                          v-if="!follow.accepted"
                          :key="follow.id"
                          :to="{
                            name: 'user',
                            params: { userId: follow.follower.id }
                          }"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ follow.follower.displayName }}
                            </v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-action>
                            <apollo-mutation
                              :mutation="
                                gql => gql`
                                  mutation($id: ID!) {
                                    updateFollow(id: $id, accepted: true) {
                                      id
                                      accepted
                                    }
                                  }
                                `
                              "
                              :variables="{
                                id: follow.id
                              }"
                            >
                              <template v-slot="{ mutate, loading }">
                                <v-btn
                                  icon
                                  :loading="loading"
                                  @click="mutate()"
                                >
                                  <v-icon>mdi-account-check</v-icon>
                                </v-btn>
                              </template>
                            </apollo-mutation>
                          </v-list-item-action>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-card-text>

                  <v-card-actions v-if="data && data.user">
                    <v-btn
                      v-if="
                        data.user.followedBy.data.length > 0 &&
                          notAcceptedHasMore
                      "
                      text
                      block
                      @click="
                        fetchMore(
                          query,
                          data.user.followedBy.data[
                            data.user.followedBy.data.length - 1
                          ].id,
                          false
                        )
                      "
                    >
                      Załaduj więcej...
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </apollo-query>
          </v-tab-item>

          <v-tab-item>
            <apollo-query
              :query="
                gql => gql`
                  query($id: ID!, $cursor: ID) {
                    user(id: $id) {
                      id
                      followedBy(take: 25, cursor: $cursor, accepted: true) {
                        data {
                          id
                          accepted
                          follower {
                            id
                            displayName
                          }
                        }
                      }
                    }
                  }
                `
              "
              :variables="{
                id: $route.params.userId
              }"
            >
              <template v-slot="{ result: { data }, isLoading, query }">
                <v-card flat :loading="!!isLoading">
                  <v-card-text v-if="data && data.user">
                    <v-list>
                      <template v-for="follow in data.user.followedBy.data">
                        <v-list-item
                          v-if="follow.accepted"
                          :key="follow.id"
                          :to="{
                            name: 'user',
                            params: { userId: follow.follower.id }
                          }"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ follow.follower.displayName }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list>
                  </v-card-text>

                  <v-card-actions v-if="data && data.user">
                    <v-btn
                      v-if="
                        data.user.followedBy.data.length > 0 && acceptedHasMore
                      "
                      text
                      block
                      @click="
                        fetchMore(
                          query,
                          data.user.followedBy.data[
                            data.user.followedBy.data.length - 1
                          ].id,
                          true
                        )
                      "
                    >
                      Załaduj więcej...
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </apollo-query>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SmartQuery } from 'vue-apollo/types/vue-apollo'

@Component
export default class extends Vue {
  @Prop(Boolean) readonly showPending!: boolean
  @Prop(Boolean) readonly value!: boolean
  tab = this.showPending ? 0 : 1
  notAcceptedHasMore = true
  acceptedHasMore = true

  async fetchMore(query: SmartQuery<Vue>, cursor: string, accepted: boolean) {
    await query.fetchMore({
      variables: {
        id: this.$route.params.userId,
        cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.user.followedBy.data.length === 0
        ) {
          if (accepted) {
            this.acceptedHasMore = false
          } else {
            this.notAcceptedHasMore = false
          }
        }

        return {
          user: {
            ...prev.user,
            followedBy: {
              ...prev.user.followedBy,
              data: [
                ...prev.user.followedBy.data,
                ...fetchMoreResult.user.followedBy.data
              ]
            }
          }
        }
      }
    })
  }
}
</script>
