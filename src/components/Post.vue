<template>
  <apollo-query
    v-if="!deleted"
    :query="
      gql => gql`
        query($id: ID!) {
          post(id: $id) {
            id
            content
            weight
            createdAt
            author {
              id
              displayName
              height
            }
            previous {
              id
              content
              weight
              createdAt
              author {
                id
                displayName
                height
              }
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
    :variables="{ id: postId }"
  >
    <template v-slot="{ result: { data }, isLoading }">
      <v-card class="mb-3" :loading="!!isLoading">
        <template v-if="data && data.post">
          <v-card-title>
            {{ data.post.author.displayName }}

            <v-spacer />

            <v-menu
              v-if="
                data.session && data.session.user.id === data.post.author.id
              "
              bottom
              left
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>

              <v-list>
                <update-post :post="data.post" />

                <apollo-mutation
                  :mutation="
                    gql => gql`
                      mutation($id: ID!) {
                        deletePost(id: $id)
                      }
                    `
                  "
                  :variables="{ id: data.post.id }"
                  @done="deleted = true"
                >
                  <template v-slot="{ mutate }">
                    <v-list-item @click="mutate">
                      <v-list-item-icon>
                        <v-icon>mdi-delete</v-icon>
                      </v-list-item-icon>

                      <v-list-item-title>
                        Usuń post
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                </apollo-mutation>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-card-subtitle>
            {{ new Date(data.post.createdAt).toLocaleString('pl') }}
          </v-card-subtitle>

          <v-card-text v-if="data.post.content !== ''">
            {{ data.post.content }}
          </v-card-text>

          <v-card
            v-if="data.post.weight"
            flat
            :color="color(data.post)"
            class="text-center px-5 py-16"
            dark
          >
            <p class="text-h3 mb-0">{{ data.post.weight }} kg</p>

            <p
              v-if="
                data.post.previous &&
                  Math.round(
                    (data.post.weight / data.post.previous.weight - 1) * 100
                  ) !== 0
              "
              class="mb-0 mt-2 text-subtitle1"
            >
              <template
                v-if="
                  Math.round(
                    (data.post.weight / data.post.previous.weight - 1) * 100
                  ) > 0
                "
              >
                Wzrost o
              </template>

              <template v-else>
                Spadek o
              </template>

              {{
                Math.abs(
                  Math.round(
                    (data.post.weight / data.post.previous.weight - 1) * 100
                  )
                )
              }}%
            </p>

            <p v-if="data.post.author.height" class="mb-0 mt-2 text-subtitle1">
              BMI:
              {{
                Math.floor(
                  calculateBMI(data.post.weight, data.post.author.height) * 10
                ) / 10
              }}

              <br />

              {{
                categoryNames.get(
                  interpretBMI(
                    calculateBMI(data.post.weight, data.post.author.height)
                  )
                )
              }}

              <template
                v-if="
                  data.post.previous &&
                    interpretBMI(
                      calculateBMI(data.post.weight, data.post.author.height)
                    ) !==
                      interpretBMI(
                        calculateBMI(
                          data.post.previous.weight,
                          data.post.previous.author.height
                        )
                      )
                "
              >
                (wcześniej:
                {{
                  categoryNames
                    .get(
                      interpretBMI(
                        calculateBMI(
                          data.post.previous.weight,
                          data.post.previous.author.height
                        )
                      )
                    )
                    .toLowerCase()
                }})
              </template>
            </p>

            <p
              v-else-if="
                data.session && data.post.author.id === data.session.user.id
              "
              class="mb-0 mt-2 text-subtitle1"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <span v-bind="attrs" v-on="on">
                    BMI niedostępne
                  </span>
                </template>

                Nie podałeś swojej daty urodzeniu lub wzrostu.
              </v-tooltip>
            </p>
          </v-card>
        </template>
      </v-card>
    </template>
  </apollo-query>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { calculateBMI, interpretBMI, BMICategory, categoryNames } from '@/utils'
import UpdatePost from '@/components/UpdatePost.vue'

@Component({
  components: {
    UpdatePost
  }
})
export default class extends Vue {
  @Prop(String) readonly postId: any
  deleted = false

  calculateBMI = calculateBMI
  interpretBMI = interpretBMI
  BMICategory = BMICategory
  categoryNames = categoryNames

  color(post: any) {
    if (!post.author.height) {
      return 'grey'
    }

    const bmiIntepretation = interpretBMI(
      calculateBMI(post.weight, post.author.height)
    )

    if (bmiIntepretation === BMICategory.NORMAL_WEIGHT) {
      return 'green'
    } else if (bmiIntepretation === BMICategory.OVERWEIGHT) {
      return 'orange'
    }

    return 'red'
  }
}
</script>
