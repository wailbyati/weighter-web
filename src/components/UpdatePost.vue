<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-list-item v-bind="attrs" v-on="on">
        <v-list-item-icon>
          <v-icon>mdi-pencil</v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          Edytuj post
        </v-list-item-title>
      </v-list-item>
    </template>

    <apollo-mutation
      :mutation="
        gql => gql`
          mutation($id: ID!, $content: String!) {
            updatePost(id: $id, content: $content) {
              id
              content
            }
          }
        `
      "
      :variables="{
        id: post.id,
        content: form.content.toString()
      }"
      @done="
        dialog = false
        $emit('done')
      "
    >
      <template v-slot="{ mutate, loading, error }">
        <form @submit.prevent="mutate()">
          <validation-observer>
            <template v-slot="{ valid }">
              <v-card :loading="loading">
                <v-card-title>
                  Edycja wpisu
                </v-card-title>

                <v-alert v-if="error" type="error">
                  Wystąpił nieoczekiwany błąd!
                </v-alert>

                <v-card-text>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Zawartość"
                    rules="max:2048"
                  >
                    <v-textarea
                      v-model.number="form.content"
                      label="Zawartość"
                      prepend-icon="mdi-text"
                      counter="2048"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-card-text>

                <v-card-actions>
                  <v-btn type="submit" color="primary" :disabled="!valid">
                    Edytuj wpis
                  </v-btn>

                  <v-spacer />

                  <v-btn
                    color="error"
                    @click="
                      dialog = false
                      form = {
                        content: post.content
                      }
                    "
                  >
                    Anuluj
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </validation-observer>
        </form>
      </template>
    </apollo-mutation>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class extends Vue {
  @Prop(Object) readonly post: any

  dialog = false
  form = {
    content: ''
  }

  @Watch('dialog')
  onDialogChange() {
    this.form.content = this.post.content
  }
}
</script>
