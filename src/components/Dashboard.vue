<template>
  <v-container>
    <v-dialog
      v-if="studentRecord && showStudentDialog"
      v-model="showStudentDialog"
      max-width="600"
      persistent
    >
      <Student
        :personalDetail="studentRecord"
        v-on:onStudentSave="saveStudent"
        v-on:onStudentDialogClose="closeDialog"
      ></Student>
    </v-dialog>
    <div>
      <v-card-title class="headline">
        <h3 class="mb-0">Dashboard</h3>
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
              <v-btn class="addBtn" v-on="on" @click="showStudentDialog = true">
                Add Student
              </v-btn>
            </template>
            <span>Add Student</span>
          </v-tooltip>
        </span>
      </v-card-title>
      <div>
        <v-data-table
          :headers="headers"
          :items="studentList"
          :pagination.sync="pagination"
          :search="search"
          class="gridView"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-left px-10">{{ props.item.id }}</td>
            <td class="text-xs-left px-10">{{ props.item.firstName }}</td>
            <td class="text-xs-left px-10">{{ props.item.lastName }}</td>
            <td class="text-xs-left px-10">{{ props.item.email }}</td>
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
      v-if="studentRecord && showConfirmationDialog"
      v-model="showConfirmationDialog"
      max-width="500"
      persistent
    >
      <ConfirmationDialog
        v-on:onCancel="onCancel"
        v-on:onDelete="deleteStudent"
        :personalDetail="studentRecord"
      ></ConfirmationDialog>
    </v-dialog>
  </v-container>
</template>

<style scoped>
</style>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import StudentModel from "@/model/StudentModel";
import Student from "@/components/Student.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import store from "@/store";
import eventBus from "@/common/bus";
import StudentController from "@/services/studentController";
import Shared from "@/common/shared";
@Component({
  components: {
    Student,
    ConfirmationDialog,
  },
})
export default class Dashboard extends Vue {
  private studentRecord: StudentModel | null = new StudentModel();
  private studentList: StudentModel[] = [];
  private headers: any = [];
  private pagination: any = {};
  private search: string = "";
  private showStudentDialog: boolean = false;
  private showConfirmationDialog: boolean = false;

  private created() {
    this.headers = [
      { text: "ID", value: "id" },
      { text: "First Name", value: "firstName" },
      { text: "Last Name", value: "lastName" },
      { text: "Email", value: "email" },
      { text: "", sortable: false },
    ];
    this.pagination.rowsPerPage = 5;
  }

  private getStudentList() {
    const studentData = store.getters.getStudents();
    if (studentData.length === 0) {
      StudentController.GetStudents().then(
        (response: StudentModel[]) => {
          this.studentList = response;
          store.commit("setStudents", this.studentList);
        },
      );
    } else {
      this.studentList = studentData;
    }
  }

  private mounted() {
    this.getStudentList();
  }

  private onDeleteStudentRecord(studentRecord: StudentModel) {
    this.studentRecord = studentRecord;
    this.showConfirmationDialog = true;
  }

  private deleteStudent(studentRecord: StudentModel) {
    const index: number = this.studentList.findIndex((c) => c.id === studentRecord.id);
    if (index !== -1) {
      this.studentList.splice(index, 1);
    } else {
      eventBus.$emit("showSnackBar", "Something went wrong");
    }
    store.commit("setStudents", this.studentList);
    this.studentRecord = new StudentModel();
    this.showConfirmationDialog = false;
    eventBus.$emit("showSnackBar", "Student Record is Deleted");
  }

  private onEditStudentRecord(studentRecord: StudentModel) {
    this.studentRecord = studentRecord;
    this.showStudentDialog = true;
  }

  private closeDialog(studentRecord: StudentModel) {
    this.studentRecord = new StudentModel();
    this.showStudentDialog = false;
  }

  private onCancel(studentRecord: StudentModel) {
    this.studentRecord = new StudentModel();
    this.showConfirmationDialog = false;
  }

  private saveStudent(studentRecord: StudentModel) {
    const index: number = this.studentList.findIndex(
      (c) => c.id === studentRecord.id,
    );
    if (index !== -1) {
      this.studentList.splice(index, 1, studentRecord);
    } else {
      studentRecord.id = this.studentList.length;
      this.studentList.forEach((student) => {
        if (student.id === studentRecord.id) {
          studentRecord.id++;
        }
      });
      this.studentList.push(studentRecord);
    }
    store.commit("setStudents", this.studentList);
    this.studentRecord = new StudentModel();
    this.showStudentDialog = false;
    eventBus.$emit("showSnackBar", "Student Detail Saved Successfully.");
  }
}
</script>
