<template>
  <v-card>
    <v-card-text>
      <form>
        <v-layout row wrap>
          <v-flex sm6>
            <input
              type="file"
              accept="image/*"
              ref="image"
              @change="handleImage"
              name="image"
            />
          </v-flex>
          <v-flex sm6>
            <span class="error--text text-xs-left">{{ imgErrorMsg }}</span>
          </v-flex>
          <v-flex v-if="imageUrl" sm6 mt-3>
            <img :src="imageUrl" class="preview" />
          </v-flex>
        </v-layout>
      </form>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.preview {
  width: 100px;
  height: 100px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 2px;
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import RegistrationDetailModel from "@/model/RegistrationDetailModel";
@Component
export default class ProfilePictureUpload extends Vue {
  @Prop() private pictureDetail: RegistrationDetailModel | null;
  private imageName: string = "";
  private imageUrl: string = "";
  private imageType: string = "";
  private imgErrorMsg: string = "";
  private imgTypeList: string[] = ["image/jpg", "image/jpeg", "image/png"];

  private get student(): RegistrationDetailModel | null {
    return Object.assign({}, this.pictureDetail);
  }

  private mounted() {
    if (this.student) {
      this.imageUrl = this.student.file;
    }
  }

  private handleImage(e: any) {
    const myFiles = e.target.files;
    const self = this;
    if (myFiles[0] !== undefined) {
      self.imageName = myFiles[0].name;
      self.imageType = myFiles[0].type;
      if (self.imgTypeList.includes(self.imageType)) {
        const fr = new FileReader();
        fr.readAsDataURL(myFiles[0]);
        fr.addEventListener("load", () => {
          self.imageUrl = fr.result as string;
          if (self.student) {
            this.imgErrorMsg = "";
            self.student.file = self.imageUrl;
            self.student.fileType = self.imageType;
            self.student.fileUrl = self.imageName;
            let studentsPictureDetail: RegistrationDetailModel = new RegistrationDetailModel();
            studentsPictureDetail = Object.assign({}, this.student);
            this.$emit("onProfilePictureSave", studentsPictureDetail);
          }
        });
      } else {
        const image = this.$refs.image as any;
        image.value = null;
        self.imageName = "";
        self.imageUrl = "";
        this.imgErrorMsg = "Only JPEG, JPG, PNG, files are allowed.";
      }
    }
  }
}
</script>