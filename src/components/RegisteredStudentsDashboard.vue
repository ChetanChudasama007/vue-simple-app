<template>
  <v-container>
    <v-dialog
      v-if="showRegistrationDialog && registeredStudentRecord"
      v-model="showRegistrationDialog"
      persistent
      max-width="800"
    >
      <StudentRegistration
        v-on:onStudentSave="saveStudent"
        :registeredStudentRecord="registeredStudentRecord"
        v-on:onStudentDialogClose="closeDialog"
      ></StudentRegistration>
    </v-dialog>
    <div>
      <v-card-title v-if="isAdmin" class="headline">
        <h3 class="mb-0">Student List</h3>
        <v-spacer></v-spacer>
        <v-text-field
          v-model.trim="search"
          append-icon="search"
          label="Search"
          single-line
          class="mt-0 pt-0"
          hide-details
        ></v-text-field>
        <span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="addBtn"
                v-on="on"
                @click="showRegistrationDialog = true"
              >
                Register Student
              </v-btn>
            </template>
            <span>Register Student</span>
          </v-tooltip>
        </span>
      </v-card-title>
      <v-card-title v-if="!isAdmin" class="headline">
        <h3 class="mb-0">My Profile</h3>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="registeredStudentList"
          :pagination.sync="pagination"
          :search="search"
          class="gridView"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left px-10">{{ props.item.id }}</td>
            <td class="text-xs-left px-10">{{ props.item.firstName }}</td>
            <td class="text-xs-left px-10">{{ props.item.lastName }}</td>
            <td class="text-xs-left px-10">{{ props.item.gender }}</td>
            <td class="text-xs-left px-10">{{ props.item.country }}</td>
            <td class="text-xs-left px-10">{{ props.item.email }}</td>
            <td class="text-xs-left px-10">{{ props.item.phoneNumber }}</td>
            <td class="text-xs-right px-0">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="mx-0"
                    v-on="on"
                    @click="onEditStudentRecord(props.item)"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="mx-0 ml-2"
                    v-on="on"
                    @click="onDeleteStudentRecord(props.item)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </td>
          </template>
        </v-data-table>
      </div>
    </div>
    <v-dialog
      v-if="registeredStudentRecord && showConfirmationDialog"
      v-model="showConfirmationDialog"
      max-width="500"
      persistent
    >
      <ConfirmationDialog
        v-on:onCancel="closeDialog"
        v-on:onDelete="onConfirmDelete"
        :personalDetail="registeredStudentRecord"
      ></ConfirmationDialog>
    </v-dialog>
  </v-container>
</template>

<style scoped>
</style>

<script lang="ts">
import RegistrationDetailModel from "@/model/RegistrationDetailModel";
import StudentRegistration from "@/components/StudentRegistration.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";
import StudentController from "@/services/studentController";
import eventBus from "@/common/bus";
import Shared from "@/common/shared";
@Component({
  components: {
    StudentRegistration,
    ConfirmationDialog,
  },
})
export default class RegisteredStudentsDashboard extends Vue {
  private registeredStudentRecord: RegistrationDetailModel | null = new RegistrationDetailModel();
  private registeredStudentList: RegistrationDetailModel[] = [];
  private headers: any = [];
  private pagination: any = {};
  private search: string = "";
  private showRegistrationDialog: boolean = false;
  private showConfirmationDialog: boolean = false;

  private created() {
    this.headers = [
      { text: "ID", value: "id" },
      { text: "First Name", value: "firstName" },
      { text: "Last Name", value: "lastName" },
      { text: "Gender", value: "gender" },
      { text: "Country", value: "country" },
      { text: "Email", value: "email" },
      { text: "Phone Number", value: "phoneNumber" },
      { text: "", sortable: false },
    ];
    this.pagination.rowsPerPage = 5;
  }

  private get isAdmin(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      return true;
    }
    return false;
  }

  private getStudentList() {
    const studentData = store.getters.getRegisteredStudents();
    if (studentData.length > 0) {
      this.registeredStudentList = studentData;
    } else {
      StudentController.GetRegisteredStudents()
      .then((res: RegistrationDetailModel[]) => {
        if (res) {
          this.registeredStudentList = res;
          store.commit("setRegisteredStudents", this.registeredStudentList);
        }
      })
      .catch((err: any) => {
        eventBus.$emit("showSnackBar", "Something went wrong.");
      });
    }
  }

  private mounted() {
    this.getStudentList();
  }

  private onDeleteStudentRecord(studentRecord: RegistrationDetailModel) {
    this.registeredStudentRecord = studentRecord;
    this.showConfirmationDialog = true;
  }

  private onConfirmDelete(studentRecord: RegistrationDetailModel) {
    const index: number = this.registeredStudentList.findIndex((c) => c.id === studentRecord.id);
    if (index !== -1) {
      this.registeredStudentList.splice(index, 1);
    } else {
      eventBus.$emit("showSnackBar", "Something went wrong");
    }
    store.commit("setRegisteredStudents", this.registeredStudentList);
    this.showConfirmationDialog = false;
    this.registeredStudentRecord = new RegistrationDetailModel();
    eventBus.$emit("showSnackBar", "Student Record is Deleted");
  }

  private onEditStudentRecord(studentRecord: RegistrationDetailModel) {
    this.registeredStudentRecord = studentRecord;
    this.showRegistrationDialog = true;
  }

  private closeDialog(studentRecord: RegistrationDetailModel) {
    this.registeredStudentRecord = new RegistrationDetailModel();
    this.showRegistrationDialog = false;
    this.showConfirmationDialog = false;
  }

  private saveStudent(studentModel: RegistrationDetailModel) {
    const index: number = this.registeredStudentList.findIndex((c) => c.id === studentModel.id);
    if (index !== -1) {
      this.registeredStudentList.splice(index, 1, studentModel);
    } else {
      studentModel.id = this.registeredStudentList.length;
      this.registeredStudentList.forEach((student) => {
        if (student.id === studentModel.id) {
          studentModel.id++;
        }
      });
      this.registeredStudentList.push(studentModel);
    }
    store.commit("setRegisteredStudents", this.registeredStudentList);
    this.registeredStudentRecord = new RegistrationDetailModel();
    this.showRegistrationDialog = false;
    eventBus.$emit("showSnackBar", "Student Detail Saved Successfully.");
  }
}
</script>