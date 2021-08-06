<template>
  <v-card v-if="studentData">
    <div>
      <v-tabs v-model="active" color="#42b983" dark slider-color="#011a0e">
        <v-tab> Personal Details</v-tab>
        <v-tab> Contact Details</v-tab>
        <v-tab> Profile Picture Upload</v-tab>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>close</v-icon>
        </v-btn>
        <v-tab-item>
          <v-card flat>
            <Student
              ref="studentComponent"
              v-on:onPersonalDetailSave="savePersonalDetails"
              v-on:onStudentDialogClose="closeDialog"
              :fromRegistrationMenu="fromRegistrationMenu"
              :personalDetail="studentData"
            ></Student>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <ContactDetails
              ref="contactDetailsComponent"
              v-on:onContactDetailSave="saveContactDetails"
              v-on:onStudentDialogClose="closeDialog"
              :contactDetail="studentData"
            ></ContactDetails>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <ProfilePictureUpload
              v-on:onProfilePictureSave="savePictureDetails"
              :pictureDetail="studentData"
            ></ProfilePictureUpload>
          </v-card>
        </v-tab-item>
      </v-tabs>
      <div v-if="active === 2" class="text-xs-center mt-3">
        <v-btn @click="onSubmit" color="#42b983">Submit</v-btn>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Student from "@/components/Student.vue";
import ContactDetails from "@/components/ContactDetails.vue";
import ProfilePictureUpload from "@/components/ProfilePictureUpload.vue";
import RegistrationDetailModel from "@/model/RegistrationDetailModel";
import eventBus from "@/common/bus";
import store from "@/store";
import Shared from "@/common/shared";

@Component({
  components: { Student, ContactDetails, ProfilePictureUpload },
})
export default class StudentRegistration extends Vue {
  private active: number = 0;
  @Prop() private registeredStudentRecord: RegistrationDetailModel | null;
  private registerStudentList: RegistrationDetailModel[] = [];
  private fromRegistrationMenu: boolean = true;
  private studentItem: RegistrationDetailModel = new RegistrationDetailModel();

  private get studentData(): RegistrationDetailModel | null {
    return Object.assign({}, this.registeredStudentRecord);
  }

  private created() {
    this.registerStudentList = store.getters.getRegisteredStudents();
  }

  private next() {
    const active = this.active;
    this.active = active < 2 ? active + 1 : 0;
  }

   private savePersonalDetails(registrationDetail: RegistrationDetailModel) {
    if (this.registeredStudentRecord) {
      this.registeredStudentRecord.firstName = registrationDetail.firstName;
      this.registeredStudentRecord.lastName = registrationDetail.lastName;
      this.registeredStudentRecord.email = registrationDetail.email;
      this.registeredStudentRecord.password = registrationDetail.password;
      this.registeredStudentRecord.dateOfBirth = registrationDetail.dateOfBirth;
      this.registeredStudentRecord.role = registrationDetail.role;
     }
    this.next();
  }

  private saveContactDetails(registrationDetail: RegistrationDetailModel) {
    if (this.registeredStudentRecord) {
      this.registeredStudentRecord.phoneNumber = registrationDetail.phoneNumber;
      this.registeredStudentRecord.country = registrationDetail.country;
      this.registeredStudentRecord.gender = registrationDetail.gender;
    }
    this.next();
  }

  private savePictureDetails(registrationDetail: RegistrationDetailModel) {
    if (this.registeredStudentRecord) {
      this.registeredStudentRecord.file = registrationDetail.file;
      this.registeredStudentRecord.fileUrl = registrationDetail.fileUrl;
      this.registeredStudentRecord.fileType = registrationDetail.fileType;
    }
  }

  private onSubmit() {
    const self = this;
    self.validate().then((result: boolean) => {
      if (result && self.registeredStudentRecord) {
        self.studentItem = self.registeredStudentRecord;
        let studentDetail: RegistrationDetailModel = new RegistrationDetailModel();
        studentDetail = Object.assign({}, this.studentItem);
        this.$emit("onStudentSave", studentDetail);
      }
    })
    .catch((err: any) => {
      eventBus.$emit("showSnackBar", "Something went wrong");
    });
  }

  private async validate(): Promise<boolean> {
    let result: boolean = true;
    const personalDetailForm = this.$refs.studentComponent as Student;
    const personalDetailFormValidation: boolean = await personalDetailForm.$validator.validateAll(
      "frmStudent",
    );

    const contactForm = this.$refs.contactDetailsComponent as ContactDetails;
    const contactFormValidation: boolean = await contactForm.$validator.validateAll(
      "frmContactDetails",
    );

    if (!personalDetailFormValidation) {
      result = personalDetailFormValidation;
      this.active = 0;
      Shared.setFocusOnValidation(this.$el as HTMLElement);
    } else if (!contactFormValidation) {
      result = contactFormValidation;
      this.active = 1;
      Shared.setFocusOnValidation(this.$el as HTMLElement);
    }
    return result;
  }

  private closeDialog() {
    this.$emit("onStudentDialogClose");
  }
}
</script>