<template>
  <section class="container">
    <el-card style="flex:1">
      <div slot="header" class="clearfix">
        <span>ログイン</span>
      </div>
    </el-card>
    <form>
      <div class="form-content">
        <span>ユーザーID</span>
        <el-input placeholder="" v-model="formData.id" />
      </div>
      <div class="form-content">
        <el-checkbox v-model="isCreateMode">アカウントを作成する</el-checkbox>
      </div>
      <div class="text-right">
        <el-button type="primary" @click="handleClickSubmit">
          {{ buttonText }}
        </el-button>
      </div>
    </form>
  </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'universal-cookie'

export default {
  asyncData({redirect, store}) {
    if (store.getters['user']) redirect('/posts/')
    return {
      isCreateMode: false,
      formData: {
        id: ''
      }
    }
  },
  computed: {
    buttonText() {
      return this.isCreateMode ? '新規登録' : 'ログイン'
    },
    ...mapGetters(['user'])
  },
  methods: {
    ...mapActions(['login', 'register']),
    async handleClickSubmit() {
      const cookies = new Cookies;
      if (this.isCreateMode) { //アカウント登録
        try {
          await this.register({...this.formData})
          this.$notify({
            type: 'success',
            title: 'アカウント作成完了',
            message: `${this.formData.id}として登録しました`,
            position: 'bottom-right',
            duration: 3000
          })
          cookies.set('user', JSON.stringify(this.user))
          this.$router.push('/posts/')
        }
        catch (e) {
          // console.log(e)
          this.$notify.error({
            title: 'アカウント作成失敗',
            message: '既に登録されているか、不正なユーザーIDです。',
            position: 'bottom-right',
            duration: 3000
          })
        }
      } else { //ログイン
        // console.log({...this.formData})
        try {
          await this.login({...this.formData})
          this.$notify({
            type: 'success',
            title: 'ログイン成功',
            message: `${this.formData.id}としてログインしました`,
            position: 'bottom-right',
            duration: 3000
          })
          cookies.set('user', JSON.stringify(this.user))
          this.$router.push('/posts/')
        } catch(e) {
          this.$notify.error({
            title: 'ログイン失敗',
            message: '不正なユーザーIDです。',
            position: 'bottom-right',
            duration: 3000
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.form-content {
  margin: 16px 0;
}

</style>
