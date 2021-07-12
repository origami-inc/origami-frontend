<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
// import User from "./models/User";
export default {
  name: "App",

  data: () => ({
    //
  }),

  computed: {
    // user: () => User.find("6408d2ca-875e-4558-97ab-e26517eabc74"),
  },

  //   User.insert({
  //   data: {
  //     firstName: "Nathan",
  //     lastName: "Alcantara",
  //     nickname: "MrNathan",
  //     email: "nathan@gmail.com",
  //     password: "nathanzito",
  //   },
  // });

  watch: {
    // call again the method if the route changes
    // $route: "fetchData",
  },

  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    // this.fetchData();
  },

  methods: {
    // Loads the data from the server and stores them in the Vuex Store.
  },
};
</script>
