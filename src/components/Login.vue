<template>
  <div id="login">
    <v-container>
      <v-layout justify-center row class="text-xs-center">
        <v-flex xs6 class="grey lighten-2">
          <v-container class="text-xs-center">
            <v-card flat>
              <v-card-title primary-title class="headline">
                <h3>Login</h3>
              </v-card-title>
              <v-card-text>
                <v-layout @keydown="onEnterClick" row wrap>
                  <v-flex sm12 mb-3>
                    <v-text-field
                      label="Username*"
                      v-validate="'required'"
                      data-vv-name="User Name"
                      data-vv-scope="frmLogin"
                      :error-messages="errors.collect('User Name')"
                      v-model.trim="user.userName"
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12 mb-3>
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
                      data-vv-scope="frmLogin"
                      data-vv-name="Password"
                      :error-messages="errors.collect('Password')"
                      v-model.trim="user.password"
                      @keypress="passwordValidation"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="mr-0" @click="login">Login</v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style scoped>
#login {
  margin-top: 50px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";
import axios from "axios";
import StudentController from "@/services/studentController";
import StudentModel from "@/model/StudentModel";
import eventBus from "@/common/bus";
import RegistrationDetailModel from "@/model/RegistrationDetailModel";
@Component
export default class Login extends Vue {
  private user: any = new RegistrationDetailModel();
  private value: string = "";

  private mounted() {
    localStorage.clear();
    store.state.authenticated = false;
  }

  private login() {
    this.validate()
      .then((result: boolean) => {
        if (result) {
          StudentController.GetRegisteredStudents()
            .then((res) => {
              const record: any = res.find((data) => data.email === this.user.userName &&
                  data.password === this.user.password);
              if (record) {
                store.commit("setAuthentication", true);
                localStorage.setItem("user", record.email);
                localStorage.setItem("role", record.role);
                store.commit("setUserRole", record.role);
                StudentController.GetStudents().then(
                  (response: StudentModel[]) => {
                    store.commit("setStudents", response);
                  },
                );
                setTimeout(() => {
                  this.$router.replace({ name: "profile" });
                }, 50);
              } else {
                eventBus.$emit("showSnackBar", "UserName or Password is invalid.");
              }
            })
            .catch((err: any) => {
              eventBus.$emit("showSnackBar", "Something went wrong.");
            });
        }
      })
      .catch((err: any) => {
        eventBus.$emit("showSnackBar", "Something went wrong.");
      });
  }

  private onEnterClick(event: any) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  private async validate(): Promise<boolean> {
    let result: boolean = true;
    const loginFormValidation: boolean = await this.$validator.validateAll(
      "frmLogin",
    );
    if (!loginFormValidation) {
      result = loginFormValidation;
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
}
</script>
