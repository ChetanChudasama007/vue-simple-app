<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer v-if="isAuthenticated" disable-resize-watcher v-model="sidebar" app>
        <v-list>
          <v-list-tile
            v-for="item in menuItems"
            :key="item.title"
            :to="item.path"
          >
            <v-list-tile-content @click="sidebar = !sidebar">{{
              item.title
            }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar v-if="isAuthenticated" app>
        <span>
          <v-toolbar-side-icon @click="sidebar = !sidebar">
          </v-toolbar-side-icon>
        </span>
        <v-toolbar-title>
          <router-link to="/registeredStudentsDashboard" tag="span" style="cursor: pointer">
            Student Management
          </router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-xs-only">
          <v-btn flat :to="'/logout'"> Logout </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <router-view></router-view>
      </v-content>
      <v-snackbar :timeout="snackbarTimeout" v-model="snackbar" left bottom>
        {{ snackbarText }}
        <v-btn dark flat @click.native="snackbar = false" color="light"
          >close</v-btn
        >
      </v-snackbar>
    </v-app>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.gridView {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.gridView th {
  text-align: left;
  font-weight: 600 !important;
  font-size: 16px !important;
  line-height: 20px;
  padding: 0 10px 0 0 !important;
}
.gridView th:first-child {
  padding-left: 24px !important;
}
.gridView table.v-table tbody td:not(:first-child) {
  padding: 0 10px 0 0 !important;
}
.error--text {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}
.addBtn {
  background-color: #42b983!important;
  color: white!important;
  margin-right: 0px!important;
}
</style>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import store from "@/store";
import eventBus from "@/common/bus";
@Component
export default class App extends Vue {
  private snackbarText: string = "";
  private snackbar: boolean = false;
  private snackbarTimeout: number = 3000;
  private sidebar: boolean = false;
  private menuItems: any = [];
  private menuList: any = [];

  private get isAuthenticated(): boolean {
    return store.state.authenticated;
  }

  private get userRole(): string {
    return store.getters.getUserRole();
  }

  private created() {
    this.menuList = [
      { title: "Dashboard", path: "/dashboard" },
      { title: "My Profile", path: "/profile"},
      { title: "Student List", path: "/registeredStudentsDashboard" },
      { title: "Logout", path: "/logout" },
    ];
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    if (user && role) {
      store.commit("setAuthentication", true);
      store.commit("setUserRole", role);
    }
  }

  private mounted() {
    eventBus.$on("showSnackBar", (snackbarText: string) => {
      this.snackbarText = snackbarText;
      this.snackbar = true;
    });
  }

  @Watch('userRole')
  private onUserRoleChange() {
    const user = localStorage.getItem('user');
    if (this.userRole === "admin") {
      this.menuItems = this.menuList;
    } else {
      this.menuItems = this.menuList.filter((c: any) => c.title !== "Dashboard" && c.title !== "Student List");
    }
  }
}
</script>

