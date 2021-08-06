<template>
  <v-card v-if="student">
    <v-toolbar v-if="!isFromRegistration" card dark color="#42b983">
      <v-toolbar-title>Student</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="closeDialog">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <form>
        <v-layout row wrap>
          <v-flex sm12>
            <v-text-field
              label="First Name*"
              data-vv-scope="frmStudent"
              v-validate="'required'"
              v-model.trim="student.firstName"
              data-vv-name="First Name"
              :error-messages="errors.collect('First Name')"
            />
          </v-flex>
          <v-flex sm12>
            <v-text-field
              label="Last Name*"
              data-vv-scope="frmStudent"
              v-validate="'required'"
              v-model.trim="student.lastName"
              data-vv-name="Last Name"
              :error-messages="errors.collect('Last Name')"
            />
          </v-flex>
          <v-flex sm12>
            <v-text-field
              type="email"
              label="Email*"
              v-validate="'required|email'"
              v-model.trim="student.email"
              data-vv-scope="frmStudent"
              data-vv-name="Email"
              :error-messages="errors.collect('Email')"
            />
          </v-flex>
          <v-flex sm12>
            <v-text-field
              label="Password*"
              :append-icon="value ? 'visibility' : 'visibility_off'"
              @click:append="() => (value = !value)"
              :type="value ? 'text' : 'password'"
              v-validate="{
                required: true,
                min: 8,
                max: 10,
                regex: /^(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
              }"
              v-model.trim="student.password"
              data-vv-scope="frmStudent"
              data-vv-name="Password"
              :error-messages="errors.collect('Password')"
              @keypress="passwordValidation"
            />
          </v-flex>
          <v-flex sm12 v-if="isFromRegistration">
            <v-dialog
              ref="dialog"
              v-model="datepicker"
              persistent
              lazy
              full-width
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="selectedDate"
                  label="Date of Birth"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="student.dateOfBirth"
                no-title
                scrollable
                :max="maxDate"
                color="green lighten-1"
              >
                <v-spacer></v-spacer>
                <v-btn flat @click="datepicker = false"
                  >Cancel</v-btn
                >
                <v-btn flat @click="onSelectDate(student.dateOfBirth)"
                  >OK</v-btn
                >
              </v-date-picker>
            </v-dialog>
          </v-flex>
          <v-flex sm12 v-if="isAdmin">
            <v-text-field
              v-model.trim="student.role"
              label="Role*"
              v-validate="'required'"
              data-vv-scope="frmStudent"
              data-vv-name="Role"
              :error-messages="errors.collect('Role')"
              >
            </v-text-field>
          </v-flex>
          <v-flex sm12 v-if="isError">
            <span class="error--text">{{errorMessage}}</span>
          </v-flex>
        </v-layout>
      </form>
    </v-card-text>
    <v-divider />
    <v-card-actions class="px-3">
      <v-spacer></v-spacer>
      <v-btn @click="closeDialog">Close</v-btn>
      <v-btn @click="onSave" color="#42b983" class="addBtn mr-0">{{buttonText}}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import StudentController from "@/services/studentController";
import RegistrationDetailModel from "@/model/RegistrationDetailModel";
import eventBus from "@/common/bus";
import Shared from "@/common/shared";
import moment from "moment";
import store from "@/store";

@Component
export default class Student extends Vue {
  @Prop() private personalDetail: RegistrationDetailModel | null;
  @Prop() private fromRegistrationMenu: boolean;
  private studentList: RegistrationDetailModel[] = [];
  private value: string = "";
  private datepicker: boolean = false;
  private selectedDate: string = "";
  private maxDate: string = "";
  private isError: boolean = false;
  private errorMessage: string = "";
  private buttonText: string = "";

  private get student(): RegistrationDetailModel | null {
    return Object.assign({}, this.personalDetail);
  }

  private get isFromRegistration(): boolean {
    if (this.fromRegistrationMenu) {
      this.buttonText = "Save";
    } else {
      this.buttonText = "Submit";
    }
    return this.fromRegistrationMenu;
  }

  private get isAdmin(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      return true;
    }
    return false;
  }

  private mounted() {
    const today = new Date();
    const yesterday = new Date(today.setDate(today.getDate() - 1));
    this.maxDate = moment(yesterday).format("YYYY-MM-DD");
    if (this.student && this.student.dateOfBirth) {
      this.selectedDate = moment(this.student.dateOfBirth).format("DD/MM/YYYY");
    }
    const studentData = store.getters.getRegisteredStudents();
    StudentController.GetRegisteredStudents().then((res: RegistrationDetailModel[]) => {
      if (res) {
        if (res.length > studentData.length) {
          this.studentList = res;
        } else {
          this.studentList = studentData;
        }
      }
    });
  }

  private closeDialog() {
    this.$emit("onStudentDialogClose");
  }

  private onSave() {
    this.validate()
      .then((result: boolean) => {
        if (result) {
          if (this.student) {
            let studentDetail: RegistrationDetailModel = new RegistrationDetailModel();
            studentDetail = Object.assign({}, this.student);
            if (this.isFromRegistration) {
              this.$emit("onPersonalDetailSave", studentDetail);
            } else {
              this.$emit("onStudentSave", studentDetail);
            }
          }
        }
      })
      .catch((err: any) => {
        eventBus.$emit("showSnackBar", "Something went wrong.");
      });
  }

  private async validate(): Promise<boolean> {
    let result: boolean = true;
    const studentFormValidation: boolean = await this.$validator.validateAll(
      "frmStudent",
    );
    if (!studentFormValidation) {
      result = studentFormValidation;
      Shared.setFocusOnValidation(this.$el as HTMLElement);
    }
    if (this.student) {
      const data = this.studentList.filter((s) =>
        s.email === this.student!.email && s.id !== this.student!.id);
      if (data.length !== 0) {
        this.isError = true;
        this.errorMessage = "Student with this email address is already configured.";
        result = false;
      } else {
        this.isError = false;
        this.errorMessage = "";
      }
    }
    return result;
  }

  private passwordValidation(event: any) {
    const charCode = String.fromCharCode(event.keyCode);
    if (/\s/.test(charCode)) {
      event.preventDefault();
      return;
    } else {
      return true;
    }
  }

  private onSelectDate(date: string) {
    this.selectedDate = moment(date).format("DD/MM/YYYY");
    this.datepicker = false;
  }
}
</script>