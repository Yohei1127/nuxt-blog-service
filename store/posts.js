import moment from '~/plugins/moment'

export const state = () => ({
  posts:[]
})

export const getters = {
  // posts: (state) => state.posts
  posts: (state) => state.posts.map((post) => Object.assign({likes:[]}, post))
}

export const mutations = {
  addPost(state, { post }) {
    state.posts.push(post)
  },
  updatePost(state, {post}) {
    state.posts = state.posts.map((p) => (p.id === post.id ? post : p))
  },
  clearPosts(state) {
    state.posts = []
  }
}

export const actions = {
  async fetchPost({commit}, {id}){
    const post = await this.$axios.$get(`/posts/${id}.json`)
    commit("addPost", {post: {...post, id}})
  },
  async fetchPosts({commit}) {
    const posts = await this.$axios.$get('/posts.json')
    commit('clearPosts')
    if(posts) {
      Object.entries(posts)
      .reverse()
      .forEach(([id, content]) => {
        commit('addPost', {
          post: {
            id,
            ...content
          }
        })
      })
    }
  },
  async publishPost({commit}, {payload}){
    const user = await this.$axios.$get(`/users/${payload.user.id}.json`)
    const created_at = moment().format()
    // 時間を追加しないと全て同じ時間表示になる
    const post_id = (await this.$axios.$post(`/posts.json`, {...payload, created_at})).name
    // const post_id = (await this.$axios.$post(`/posts.json`, payload)).name
    const post = {id: post_id, ...payload, created_at} //state情報更新用
    const putData = {id: post_id, ...payload, created_at} //DBデータ更新用
    delete putData.user //これを怠るとユーザーデータ全てがその配下に追加されることになる
    await this.$axios.$put(`/users/${user.id}/posts.json`, [
      ...(user.posts || []),
      putData
    ])
    commit('addPost', {post})
  },
  async addLikeToPost({commit}, {user, post}) {
    post.likes.push({
      created_at: moment().format(),
      user_id: user.id,
      post_id: post.id
    })
    const newPost = await this.$axios.$put(`/posts/${post.id}.json`, post)
    commit('updatePost', {post: newPost})
  }
}