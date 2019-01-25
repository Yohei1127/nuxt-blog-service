import Cookies from 'universal-cookie'

export default ({req, store}) => {
  // console.log(req, store)
  if(process.browser) {
    // console.log(process.browser, "process.browser ブラウザ場でおきてるよ")
    return
  }
  const cookies = new Cookies(req.headers.cookie)
  const user = cookies.get('user')
  // console.log(cookies, "クッキー", user, "ユーザー情報")
  if(user && user.id) {
    const {id, likes } = user
    store.commit('setUser', {user: {id, likes}})
  }
}