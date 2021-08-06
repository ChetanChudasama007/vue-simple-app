<template>
  <v-card v-if="student">
    <v-card-text>
      <form>
        <v-layout row wrap>
          <v-flex sm12>
            <v-text-field
              label="Phone Number*"
              data-vv-scope="frmContactDetails"
              v-model.trim="student.phoneNumber"
              v-validate="'required|min:10|max:10'"
              data-vv-name="Phone Number"
              :error-messages="errors.collect('Phone Number')"
              @keypress="phoneNumberValidation"
            />
          </v-flex>
          <v-flex sm12>
            <v-text-field label="Country" v-model.trim="student.country" />
          </v-flex>
          <v-flex sm12>
            <v-select
              :items="genderList"
              label="Gender"
              v-model.trim="student.gender"
            ></v-select>
          </v-flex>
        </v-layout>
      </form>
    </v-card-text>
    <v-divider />
    <v-card-actions class="px-3">
      <v-spacer></v-spacer>
      <v-btn @click="closeTab">Close</v-btn>
      <v-btn @click="saveAndNext" class="addBtn mr-0">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import RegistrationDetailModel from "@/model/RegistrationDetailModel";
import eventBus from "@/common/bus";
import Shared from "@/common/shared";
@Component
export default class ContactDetails extends Vue {
  @Prop() private contactDetail: RegistrationDetailModel | null;
  private genderList: string[] = ["Male", "Female", "Other"];

  private get student(): RegistrationDetailModel | null {
    return Object.assign({}, this.contactDetail);
  }

  private phoneNumberValidation(event: any) {
    const charCode = String.fromCharCode(event.keyCode);
    if (/\d/.test(charCode)) {
      return true;
    } else {
      event.preventDefault();
      return;
    }
  }

  private async validate(): Promise<boolean> {
    let result: boolean = true;
    const contactDetailsFormValidation: boolean = await this.$validator.validateAll(
      "frmContactDetails",
    );
    if (!contactDetailsFormValidation) {
      result = contactDetailsFormValidation;
      Shared.setFocusOnValidation(this.$el as HTMLElement);
    }
    return result;
  }

  private saveAndNext() {
    this.validate()
      .then((result: boolean) => {
        if (result) {
          if (this.student) {
            let studentsContactDetail: RegistrationDetailModel = new RegistrationDetailModel();
            studentsContactDetail = Object.assign({}, this.student);
            this.$emit("onContactDetailSave", studentsContactDetail);
          }
        }
      })
      .catch((err: any) => {
        eventBus.$emit("showSnackBar", "Something went wrong.");
      });
  }

  private closeTab() {
    this.$emit("onStudentDialogClose");
  }
}
</script>
