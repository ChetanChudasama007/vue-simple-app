<template>
  <v-container>
    <v-card-title class="headline">
      <h3>My Profile</h3>
    </v-card-title>
    <v-card v-if="registeredStudentRecord">
      <div>
        <v-expansion-panel v-model="panel" expand>
          <v-expansion-panel-content>
            <template v-slot:header>
              <h3>Personal Details</h3>
            </template>
            <v-card flat>
              <Student
              v-if="registeredStudentRecord"
                ref="studentComponent"
                v-on:onPersonalDetailSave="savePersonalDetails"
                v-on:onStudentDialogClose="closePanel"
                :personalDetail="registeredStudentRecord"
                :fromRegistrationMenu="fromProfile"
              ></Student>
            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <h3>Contact Details</h3>
            </template>
            <v-card flat>
              <ContactDetails
              v-if="registeredStudentRecord"
                ref="contactDetailsComponent"
                v-on:onContactDetailSave="saveContactDetails"
                v-on:onStudentDialogClose="closePanel"
                :contactDetail="registeredStudentRecord"
              ></ContactDetails>
            </v-card>
          </v-expansion-panel-content>
          <v-expansion-panel-content>
            <template v-slot:header>
              <h3>Profile Picture Upload</h3>
            </template>
            <v-card flat>
              <ProfilePictureUpload
              v-if="registeredStudentRecord"
                v-on:onProfilePictureSave="savePictureDetails"
                :pictureDetail="registeredStudentRecord"
              ></ProfilePictureUpload>
              <v-layout justify-center row class="text-xs-center">
                <v-btn
                  class="addBtn"
                  @click="saveProfile(registeredStudentRecord)"
                  >Save Profile</v-btn
                >
              </v-layout>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
    </v-card>
  </v-container>
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
import StudentController from "@/services/studentController";

@Component({
  components: { Student, ContactDetails, ProfilePictureUpload },
})
export default class Profile extends Vue {
  private registeredStudentRecord: RegistrationDetailModel | null = null;
  private fromProfile: boolean = true;
  private panel: boolean[] = [false, false, false];
  private registeredStudentList: RegistrationDetailModel[] = [];
  private studentItem: RegistrationDetailModel = new RegistrationDetailModel();

  private created() {
    const user = localStorage.getItem("user");
    StudentController.GetRegisteredStudents()
    .then((res: RegistrationDetailModel[]) => {
      if (res) {
        this.registeredStudentList = res;
        const record: any = res.find((c) => c.email === user);
        this.registeredStudentRecord = record;
        this.panel = [true, false, false];
      }
    })
    .catch((err: any) => {
      eventBus.$emit("showSnackBar", "Something went wrong.");
    });
  }

  private savePersonalDetails(registrationDetail: RegistrationDetailModel) {
    this.studentItem.id = registrationDetail.id;
    this.studentItem.firstName = registrationDetail.firstName;
    this.studentItem.lastName = registrationDetail.lastName;
    this.studentItem.email = registrationDetail.email;
    this.studentItem.password = registrationDetail.password;
    this.studentItem.dateOfBirth = registrationDetail.dateOfBirth;
    this.studentItem.role = registrationDetail.role;
    this.panel = [false, true, false];
  }

  private saveContactDetails(registrationDetail: RegistrationDetailModel) {
    this.studentItem.phoneNumber = registrationDetail.phoneNumber;
    this.studentItem.country = registrationDetail.country;
    this.studentItem.gender = registrationDetail.gender;
    this.panel = [false, false, true];
  }

  private savePictureDetails(registrationDetail: RegistrationDetailModel) {
    this.studentItem.file = registrationDetail.file;
    this.studentItem.fileUrl = registrationDetail.fileUrl;
    this.studentItem.fileType = registrationDetail.fileType;
  }

  private saveProfile() {
    const self = this;
    self.validate()
      .then((result: boolean) => {
        if (result && self.registeredStudentRecord) {
          self.registeredStudentRecord = self.studentItem;
          let studentDetail: RegistrationDetailModel = new RegistrationDetailModel();
          studentDetail = Object.assign({}, this.registeredStudentRecord);
          const index: number = self.registeredStudentList.findIndex(
            (data) => data.id === studentDetail.id,
          );
          if (index !== -1) {
            this.registeredStudentList.splice(index, 1, studentDetail);
            store.commit("setRegisteredStudents", this.registeredStudentList);
            this.closePanel();
            eventBus.$emit("showSnackBar", "Student Detail Saved Successfully.");
          }
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
      this.panel = [true, false, false];
      Shared.setFocusOnValidation(this.$el as HTMLElement);
    } else if (!contactFormValidation) {
      result = contactFormValidation;
      this.panel = [false, true, false];
      Shared.setFocusOnValidation(this.$el as HTMLElement);
    }
    return result;
  }

  private closePanel() {
    this.panel = [false, false, false];
  }
}
</script>