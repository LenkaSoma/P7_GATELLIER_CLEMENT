<template>
  <div id="wall" class="wall">
    <NewPost />
    <Post v-for="post in allPosts" v-bind:key="post.id" :post="post" @infosPost="setInfos" />
    <EditPost :post="post" />
  </div>
</template>

<script>
import axios from "axios";
import EditPost from "../components/EditPost";
import NewPost from "../components/NewPost";
import Post from "../components/Post";

export default {
    name: 'Posts',
    components: {
        EditPost,
        NewPost,
        Post
    },
    data() {
        return {
            post: { id: "", content: "", image: "" },
            allPosts : []
        };
    },
    methods: {
        setInfos(payload) {
            this.post = payload.post;
        }
    },
    mounted() {
        axios.get("http://localhost:3000/api/post", { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }).then(response => {
          this.allPosts = response.data;
        }).catch(error => { console.log(error); }),
        this.$store.dispatch("getUserInfos");
    }
};
</script>

<style lang="scss">
.wall {
  background-color: white;
  min-height: 100%;
  padding: 5rem 0 2rem 0;
}
.block-post {
  background-color: white;
  width: 75%;
  margin: auto;
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.25);
  border-radius: 0.25rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
  & h3 {
    color: grey;
    margin: 0.25rem 0;
    font-size: 0.75rem;
  }
  & .like-section {
    & div {
      display: inline-block;
      margin: 0 0.5rem;
      & i {
        margin: 0 0.2rem;
      }
      & a {
        text-decoration: none;
        color: grey;
      }
    }
    font-weight: 700;
    color: grey;
  }
}
</style>