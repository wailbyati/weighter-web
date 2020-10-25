<template>
  <apollo-query
    :query="
      gql => gql`
        query {
          session {
            id
            deactivated
          }
        }
      `
    "
  >
    <template v-slot="{ result: { data } }">
      <template v-if="data">
        <feed v-if="data.session && !data.session.deactivated" />
        <landing v-else />
      </template>
    </template>
  </apollo-query>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Feed from '@/views/Feed.vue'
import Landing from '@/views/Landing.vue'

@Component({
  components: {
    Feed,
    Landing
  }
})
export default class extends Vue {}
</script>
