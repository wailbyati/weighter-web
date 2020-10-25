<template>
  <v-container>
    <apollo-query
      :query="
        gql => gql`
          query($id: ID!) {
            user(id: $id) {
              id
              displayName
              public
              dateOfBirth
              height
              followedBy(take: 5, accepted: true) {
                data {
                  id
                  follower {
                    id
                    displayName
                  }
                }
                count
              }
              following(take: 5, accepted: true) {
                data {
                  id
                  followed {
                    id
                    displayName
                  }
                }
                count
              }
            }

            session {
              id
              user {
                id
              }
            }
          }
        `
      "
      :variables="{
        id: $route.params.userId
      }"
    >
      <template v-slot="{ result: { data }, isLoading }">
        <template v-if="!data || (data && data.user)">
          <v-row>
            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 4">
              <v-card :loading="!!isLoading" class="mb-3">
                <template v-if="data && data.user">
                  <v-card-title>
                    {{ data.user.displayName }}
                  </v-card-title>

                  <v-card-actions
                    v-if="
                      data &&
                        data.session &&
                        data.user.id !== data.session.user.id
                    "
                  >
                    <apollo-query
                      :query="
                        gql => gql`
                          query($followedId: ID!, $followerId: ID!) {
                            followByUsers(
                              followedId: $followedId
                              followerId: $followerId
                            ) {
                              id
                              accepted
                            }
                          }
                        `
                      "
                      :variables="{
                        followedId: data.user.id,
                        followerId: data.session.user.id
                      }"
                      style="min-width: 100%"
                    >
                      <template
                        v-slot="{
                          result: { data: followByUsersData },
                          isLoading: followByUsersIsLoading,
                          query: followByUsersQuery
                        }"
                      >
                        <apollo-mutation
                          v-if="
                            followByUsersData && followByUsersData.followByUsers
                          "
                          :mutation="
                            gql => gql`
                              mutation($id: ID!) {
                                deleteFollow(id: $id)
                              }
                            `
                          "
                          :variables="{
                            id: followByUsersData.followByUsers.id
                          }"
                          style="min-width: 100%"
                          @done="followByUsersQuery.refetch()"
                        >
                          <template v-slot="{ mutate, loading }">
                            <v-btn
                              color="secondary"
                              :loading="!!followByUsersIsLoading || loading"
                              block
                              @click="mutate()"
                            >
                              {{
                                followByUsersData.followByUsers.accepted
                                  ? 'Obserwujesz'
                                  : 'Oczekiwanie na akceptację'
                              }}
                            </v-btn>
                          </template>
                        </apollo-mutation>

                        <apollo-mutation
                          v-else
                          :mutation="
                            gql => gql`
                              mutation($followedId: ID!, $followerId: ID!) {
                                createFollow(
                                  followedId: $followedId
                                  followerId: $followerId
                                ) {
                                  id
                                  accepted
                                }
                              }
                            `
                          "
                          :variables="{
                            followedId: data.user.id,
                            followerId: data.session.user.id
                          }"
                          style="min-width: 100%"
                          @done="followByUsersQuery.refetch()"
                        >
                          <template v-slot="{ mutate, loading }">
                            <v-btn
                              color="primary"
                              :loading="!!followByUsersIsLoading || loading"
                              block
                              @click="mutate()"
                            >
                              Obserwuj
                            </v-btn>
                          </template>
                        </apollo-mutation>
                      </template>
                    </apollo-query>
                  </v-card-actions>
                </template>
              </v-card>

              <v-card :loading="!!isLoading" class="mb-3">
                <template v-if="data && data.user">
                  <v-card-title>
                    Obserwujący

                    <v-chip
                      class="ml-3"
                      :color="data.user.followedBy.count > 0 ? 'primary' : ''"
                    >
                      {{ data.user.followedBy.count }}
                    </v-chip>
                  </v-card-title>

                  <v-card-text>
                    <v-list dense>
                      <v-list-item-group>
                        <v-list-item
                          v-for="follow in data.user.followedBy.data"
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
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>

                  <v-card-actions>
                    <user-followed-by
                      v-model="followedByDialog"
                      :show-pending="
                        data.session && data.session.user.id === data.user.id
                      "
                    />
                  </v-card-actions>
                </template>
              </v-card>

              <v-card :loading="!!isLoading">
                <template v-if="data && data.user">
                  <v-card-title>
                    Obserwowani

                    <v-chip
                      class="ml-3"
                      :color="data.user.following.count > 0 ? 'primary' : ''"
                    >
                      {{ data.user.following.count }}
                    </v-chip>
                  </v-card-title>

                  <v-card-text>
                    <v-list dense>
                      <v-list-item-group>
                        <v-list-item
                          v-for="follow in data.user.following.data"
                          :key="follow.id"
                          :to="{
                            name: 'user',
                            params: { userId: follow.followed.id }
                          }"
                        >
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ follow.followed.displayName }}
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-card-text>

                  <v-card-actions>
                    <user-following
                      v-model="following"
                      :show-pending="
                        data.session && data.session.user.id === data.user.id
                      "
                    />
                  </v-card-actions>
                </template>
              </v-card>
            </v-col>

            <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 8">
              <apollo-query
                v-if="data && data.user"
                :query="
                  gql => gql`
                    query($followedId: ID!, $followerId: ID!) {
                      followByUsers(
                        followedId: $followedId
                        followerId: $followerId
                      ) {
                        id
                        accepted
                      }
                    }
                  `
                "
                :variables="{
                  followedId: data.user.id,
                  followerId: data.session.user.id
                }"
                style="min-width: 100%"
              >
                <template
                  v-slot="{
                    result: { data: followByUsersData },
                    isLoading: followByUsersIsLoading
                  }"
                >
                  <template
                    v-if="
                      data.user.id === data.session.user.id ||
                        data.user.public ||
                        (followByUsersData &&
                          followByUsersData.followByUsers &&
                          followByUsersData.followByUsers.accepted)
                    "
                  >
                    <apollo-query
                      :query="
                        gql => gql`
                          query($id: ID!, $cursor: ID) {
                            user(id: $id) {
                              id
                              posts(cursor: $cursor) {
                                data {
                                  id
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
                      <template
                        v-slot="{
                          result: { data: postsData },
                          query: postsQuery
                        }"
                      >
                        <template
                          v-if="
                            postsData && postsData.user && postsData.user.posts
                          "
                        >
                          <template v-if="postsData.user.posts.data.length > 0">
                            <post
                              v-for="post in postsData.user.posts.data"
                              :key="post.id"
                              :post-id="post.id"
                            />

                            <v-btn
                              v-if="
                                postsData.user.posts.data.length > 0 && hasMore
                              "
                              text
                              block
                              @click="
                                fetchMore(
                                  postsQuery,
                                  postsData.user.posts.data[
                                    postsData.user.posts.data.length - 1
                                  ].id
                                )
                              "
                            >
                              Załaduj więcej...
                            </v-btn>
                          </template>

                          <v-card v-else>
                            <v-card-text>
                              Nie znaleziono żadnych postów!
                            </v-card-text>
                          </v-card>
                        </template>

                        <template v-else>
                          <v-card loading />
                        </template>
                      </template>
                    </apollo-query>
                  </template>

                  <v-card v-else :loading="!!followByUsersIsLoading">
                    <v-card-text>
                      Ten profil jest prywatny!
                    </v-card-text>
                  </v-card>
                </template>
              </apollo-query>
            </v-col>
          </v-row>
        </template>

        <v-alert v-else type="error">
          Nie znaleziono użytkownika
        </v-alert>
      </template>
    </apollo-query>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import UserFollowedBy from '@/components/UserFollowedBy.vue'
import UserFollowing from '@/components/UserFollowing.vue'
import { NavigationGuardNext, Route } from 'vue-router'
import Post from '@/components/Post.vue'
import { SmartQuery } from 'vue-apollo/types/vue-apollo'

@Component({
  components: {
    UserFollowedBy,
    UserFollowing,
    Post
  }
})
export default class extends Vue {
  followedByDialog = false
  following = false
  hasMore = true

  async fetchMore(query: SmartQuery<Vue>, cursor: string) {
    await query.fetchMore({
      variables: {
        id: this.$route.params.userId,
        cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.user.posts.data.length === 0) {
          this.hasMore = false
        }

        return {
          user: {
            ...prev.user,
            posts: {
              ...prev.user.posts,
              data: [
                ...prev.user.posts.data,
                ...fetchMoreResult.user.posts.data
              ]
            }
          }
        }
      }
    })
  }

  beforeRouteUpdate(to: Route, from: Route, next: NavigationGuardNext<Vue>) {
    this.followedByDialog = false
    next()
  }
}
</script>
