<template>
  <div>
    <div class="block-post">
      <span id='msgReturnAPI' class="mx-3 text-danger text-center" v-if="user.token==null">Vous devez être connecté pour voir cette page.</span>
      <form enctype="multipart/form-data" action="/create" method="post" v-if="user.token!=null">
        <div class="input-group mb-3">
          <label for="input_text">Que souhaitez-vous dire ?</label>
          <input v-model="contentPost.content" class="input-text" id="input_text" type="text" />
        </div>

        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputFileAddon">Fichier</span>
          </div>
          <div class="custom-file">
            <input name="inputFile" type="file" class="custom-file-input" id="inputFile" aria-describedby="inputFileAddon" @change="onFileChange" />
            <label class="custom-file-label" for="inputFile">Choisir un fichier</label>
          </div>
        </div>
        <input type="submit" class="btn btn-primary" @click.prevent="createPost" value="Envoyer" />
        <span id='msgReturnAPI' class="mx-3">{{msgError}}</span>
      </form>
    </div>
  </div> 
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "NewPost",
  data() {
    return {
      contentPost: {
        content: null,
        postImage: null
      },
      msgError: ""
    };
  },
  computed: {
    ...mapState(["user", "editOption"])
  },
  methods: {
    createPost() {
      console.log(this.contentPost);

      const dataForm = new FormData();
      dataForm.append("inputFile", this.contentPost.postImage);
      dataForm.append("content", this.contentPost.content);

      if (dataForm.get("inputFile") == "null" && dataForm.get("content") == "null") {
        let msgReturn = document.getElementById('msgReturnAPI')
        msgReturn.classList.add('text-danger')
        this.msgError = "Rien à publier";
      } else {
        axios.post("http://localhost:3000/api/post/create", dataForm, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        }).then(response => {
          if (response) { window.location.reload(); }
        }).catch(error => (this.msgError = error));
      }
    },
    onFileChange(e) {
      console.log(e);
      this.contentPost.postImage = e.target.files[0] || e.dataTransfer.files;
      console.log(this.contentPost.postImage);
    }
  }
};
</script>

<style>
.input-text {
    width: 100%;
    border: 1px solid rgb(36, 36, 36);
    padding: 0.5rem;
    border-radius: 5px;
}
</style>