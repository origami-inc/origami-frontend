<template>
  <ApolloQuery :query="require('../graphql/Users.gql')">
    <template v-slot="{ result: { loading, error, data } }">
      <div v-if="data && !loading && !error">
        <v-data-table
          :headers="headers"
          :items="data.users"
          sort-by="calories"
          class="elevation-1"
          :loading="loading"
          loading-text="Loading... Please wait"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>My CRUD</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New Item
                  </v-btn>
                </template>
                <ApolloMutation
                  :mutation="
                    isNew
                      ? require('../graphql/CreateUser.gql')
                      : require('../graphql/UpdateUser.gql')
                  "
                  :variables="{
                    id: editedItemId,
                    user: editedItem,
                  }"
                  :update="addCache"
                  @done="close"
                >
                  <template v-slot="{ mutate }">
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>

                      <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.firstName"
                                label="First Name"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.lastName"
                                label="Last Name"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.nickname"
                                label="Nickname"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.email"
                                label="Email"
                              ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                              <v-text-field
                                v-model="editedItem.password"
                                label="Password"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">
                          Cancel
                        </v-btn>
                        <v-btn color="blue darken-1" text @click="mutate">
                          Save
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </ApolloMutation>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <ApolloMutation
                  :mutation="require('../graphql/DeleteUser.gql')"
                  :variables="{
                    id: editedItem.id,
                  }"
                  :update="deleteCache"
                  @done="closeDelete"
                >
                  <template v-slot="{ mutate }">
                    <v-card>
                      <v-card-title class="text-h5"
                        >Are you sure you want to delete this
                        item?</v-card-title
                      >
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="closeDelete"
                          >Cancel</v-btn
                        >
                        <v-btn color="blue darken-1" text @click="mutate"
                          >OK</v-btn
                        >
                        <v-spacer></v-spacer>
                      </v-card-actions>
                    </v-card>
                  </template>
                </ApolloMutation>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
import USERS from "../graphql/Users.gql";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "First Name",
        align: "start",
        sortable: false,
        value: "firstName",
      },
      { text: "Last Name", value: "lastName" },
      { text: "Nickname", value: "nickname" },
      { text: "Email", value: "email" },
      { text: "Password", value: "password" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    isNew: true,
    editedItem: {},
    editedItemId: "",
  }),

  computed: {
    formTitle() {
      return this.isNew ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    editItem(item) {
      this.isNew = false;
      this.editedItem = item;
      this.editedItemId = item.id;
      delete this.editedItem.id;
      delete this.editedItem.__typename;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = item;
      this.dialogDelete = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = {};
        this.isNew = true;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = {};
      });
    },

    addCache(store) {
      // Read the query from cache
      const data = store.readQuery({ query: USERS });
      // Look for the deleted item
      // Mutate cache result
      const index = data.users.findIndex((m) => m.id === this.editedItem.id);
      if (index !== -1) {
        data.users.push(this.editedItem);
      } else {
        data.users[index] = this.editedItem;
      }
      // Write back to the cache
      store.writeQuery({
        query: USERS,
        data,
      });
    },

    deleteCache(store) {
      // Read the query from cache
      const data = store.readQuery({ query: USERS });
      // Look for the deleted item
      const index = data.users.findIndex((m) => m.id === this.editedItem.id);
      if (index !== -1) {
        // Mutate cache result
        data.users.splice(index, 1);
        // Write back to the cache
        store.writeQuery({
          query: USERS,
          data,
        });
      }
    },
  },
};
</script>
