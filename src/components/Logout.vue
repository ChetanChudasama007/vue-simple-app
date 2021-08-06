<template></template>
<script lang="ts">
import eventBus from "@/common/bus";
import store from "@/store";
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Logout extends Vue {

  private mounted() {
    store.commit("setAuthentication", false);
    store.commit("setUserRole", "");
    localStorage.clear();
    this.$router.replace({ name: "login" });
    eventBus.$emit("showSnackBar", "You are successfully logged out!");
  }
}
</script>