<template>
    <h3 class="errorPage">Page Not Found!</h3>
</template>
<style scoped>
.errorPage {
    margin-top: 50px;
    color: #ff5252;
}
</style>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class NotFound extends Vue {}
</script>