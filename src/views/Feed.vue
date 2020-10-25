<template>
  <v-container>
    <apollo-query
      :query="
        gql => gql`
          query($cursor: ID) {
            feed(cursor: $cursor) {
              data {
                id
              }
            }
          }
        `
      "
    >
      <template v-slot="{ result: { data }, query }">
        <template v-if="data && data.feed">
          <post
            v-for="post in data.feed.data"
            :key="post.id"
            :post-id="post.id"
          />

          <v-btn
            v-if="data.feed.data.length > 0 && hasMore"
            text
            block
            @click="
              fetchMore(query, data.feed.data[data.feed.data.length - 1].id)
            "
          >
            Załaduj więcej...
          </v-btn>
        </template>

        <v-card v-else loading />

        <create-post
          @done="
            query.refetch()
            hasMore = true
          "
        />
      </template>
    </apollo-query>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Post from '@/components/Post.vue'
import { SmartQuery } from 'vue-apollo/types/vue-apollo'
import CreatePost from '@/components/CreatePost.vue'

@Component({
  components: {
    Post,
    CreatePost
  }
})
export default class extends Vue {
  hasMore = true

  async fetchMore(query: SmartQuery<Vue>, cursor: string) {
    await query.fetchMore({
      variables: {
        cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          Object.values(fetchMoreResult.feed.data).length === 0
        ) {
          this.hasMore = false
        }

        return {
          feed: {
            ...prev.feed,
            data: [
              ...Object.values(prev.feed.data),
              ...Object.values(fetchMoreResult.feed.data)
            ]
          }
        }
      }
    })
  }
}
</script>
