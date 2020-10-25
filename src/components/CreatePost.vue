<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn fab fixed bottom right class="mb-15" v-bind="attrs" v-on="on">
        <v-icon>mdi-pen-plus</v-icon>
      </v-btn>
    </template>

    <apollo-mutation
      :mutation="
        gql => gql`
          mutation($content: String!, $weight: Float!) {
            createPost(content: $content, weight: $weight) {
              id
            }
          }
        `
      "
      :variables="{
        content: form.content.toString(),
        weight: form.weight
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
                  Dodawanie wpisu
                </v-card-title>

                <v-alert v-if="error" type="error">
                  Wystąpił nieoczekiwany błąd!
                </v-alert>

                <v-card-text>
                  <validation-provider
                    v-slot="{ errors }"
                    name="Waga"
                    rules="required|min_value:10|max_value:700"
                  >
                    <v-text-field
                      v-model.number="form.weight"
                      label="Waga"
                      prepend-icon="mdi-weight"
                      required
                      type="number"
                      :error-messages="errors"
                      suffix="kg"
                    />
                  </validation-provider>

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
                      type="text"
                    />
                  </validation-provider>
                </v-card-text>

                <v-card-actions>
                  <v-btn type="submit" color="primary" :disabled="!valid">
                    Dodaj wpis
                  </v-btn>

                  <v-spacer />

                  <v-btn color="error" @click="dialog = false">
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
import { Vue, Component, Watch } from 'vue-property-decorator'

@Component
export default class extends Vue {
  dialog = false
  form = {
    content: '',
    weight: 60
  }

  @Watch('dialog')
  onDialogChange() {
    this.form.content = ''
    this.form.weight = 60
  }
}
</script>
