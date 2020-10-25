<template>
  <v-container>
    <p>Aby kontynuować, musisz wpierw utworzyć konto lub się zalogować.</p>

    <v-btn color="primary" class="mr-2" :to="{ name: 'sign-up' }">
      Utwórz konto
    </v-btn>

    <v-btn text :to="{ name: 'log-in' }">
      Zaloguj się
    </v-btn>
  </v-container>
</template>
