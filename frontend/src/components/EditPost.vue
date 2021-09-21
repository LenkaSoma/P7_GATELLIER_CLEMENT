<template>
  <div class="modal fade" id="modalEditPost" tabindex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content" v-if="editOption=='modify'">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Modifier le post</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form enctype="multipart/form-data" action="/update" method="put">
            <div class="input-group mb-3">
              <label for="input_text">Modifier votre message</label>
              <br />
              <textarea class="input-text" id="inputNewText" type="text" :value="post.content"></textarea>
            </div>
            <div class="input-group mb-3" v-if="post.attachement">
              <br />
              <img class="img-thumbnail" :src="post.attachement" />
              <button type="button" class="btn btn-danger mx-auto mt-1" @click='deleteImgAction'>Supprimer image</button>
            </div>

            <span id="msgReturnAPI" class="mx-3"></span>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-primary" @click="updatePost">Sauvegarder</button>
        </div>
      </div>

      <div class="modal-content" v-else>
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Supprimer ce post (id: {{post.id}})</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Êtes vous sûr de vouloir supprimer ce post</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-danger" @click="deletePost">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "EditPost",
  data() {
    return {
      deleteImg: false
    };
  },
  computed: {
    ...mapState(["user", "editOption"])
  },
  props: {
    post: {
      type: Object,
      default() {}
    }
  },
  methods: {
    deletePost() {
      // On envoie la requête pour supprimer le post
      axios.delete("http://localhost:3000/api/post/delete", {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
          data: { postId: this.post.id, userIdOrder: this.user.userId }
        }).then(() => {
          // On recharge la page pour mettre a jour le visuel
          window.location.reload();
        }).catch(error => console.log(error));
    },
    updatePost() {
      let newInput      = document.getElementById("inputNewText").value;
      let newContent    = false;

      // On vérifie si l'ancien message est identique au nouveau message
      if (newInput !== this.post.content || this.deleteImg != false) { newContent = true; }

      // On vérifie si y a un message différent et si l'image doit être supprimée
      if (newContent && this.deleteImg) {
        // On envoie la requête pour mettre a jour
        axios.put("http://localhost:3000/api/post/update", {
          postId: this.post.id,
          userIdOrder: this.user.userId,
          newText: newInput,
          newImg: null
        }, { headers: { authorization: "Bearer " + localStorage.getItem("token") } }).then(response => {
          this.retourAPI = response.data.confirmation;
          setTimeout(() => { this.retourAPI = ""; }, 2000);
          if (response) { window.location.reload(); } // On recharge la page
        }).catch(err => {
          console.log(err);
          this.retourAPI = "Une erreur est survenue, vérifier vos saisies";
        })
      } else if(newContent) {
        axios.put("http://localhost:3000/api/post/update", {
          postId: this.post.id,
          userIdOrder: this.user.userId,
          newText: newInput,
        }, { headers: { authorization: "Bearer " + localStorage.getItem("token") }}).then(response => {
          this.retourAPI = response.data.confirmation;
          setTimeout(() => { this.retourAPI = ""; }, 2000);
          if (response) { window.location.reload(); } // On recharge la page
        }).catch(err => {
          console.log(err);
          this.retourAPI = "Une erreur est survenue, vérifier vos saisies";
        })
      }
    },
    deleteImgAction() {
      this.deleteImg = true;
    }
  }
};
</script>