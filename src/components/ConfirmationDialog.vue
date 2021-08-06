<template>
    <v-card v-if="student">
      <v-card-title
        ><h3>{{ confirmationMessage }}</h3></v-card-title
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat @click="onCancel(student)"
          >Cancel</v-btn
        >
        <v-btn color="red darken-1" flat @click="onDelete(student)"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
</template>

<style scoped>
.v-card__title {
  display: block!important;
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RegistrationDetailModel from "@/model/RegistrationDetailModel";
@Component
export default class ConfirmationDialog extends Vue {
  @Prop() private personalDetail: RegistrationDetailModel | null;
  private confirmationMessage: string = "";

  private created() {
    this.confirmationMessage = "Do you really want to delete Student Record?";
  }

  private get student(): RegistrationDetailModel | null {
    return Object.assign({}, this.personalDetail);
  }

  private onDelete(studentRecord: RegistrationDetailModel) {
    this.$emit("onDelete", studentRecord);
  }

  private onCancel(studentRecord: RegistrationDetailModel) {
    this.$emit("onCancel", studentRecord);
  }
}
</script>
