new Vue({
  el: '#app',
  data: {
    url: 'https://www.youtube.com/watch?v=klnvttPfOUM',
    keyword: '',
    result: [],
    halaman: {
      first: null,
      last: null,
      prev: null,
      next: null,
      total: 0,
      page: null
    }
  },
  computed: {
    convertToString() {
      return value => JSON.stringify(value, null, 2)
    }
  },
  watch: {
    keyword: pDebounce(async function keywordhandler(keyword) {
      if (keyword && keyword.length >= 3) {
        await this.search(keyword, this.url)
      } else {
        this.cleanResult()
      }
    }, 250)
  },
  methods: {
    async search(keyword, url, halaman) {
      try {
        const response = await fetch(halaman ? halaman : `https://cari-teks-video-api.vercel.app/api/search?q=${keyword}&url=${encodeURIComponent(url)}`).then(_ => (_.ok ? _.json() : []))

        this.result = response.data
        Object.keys(response).forEach(key => {
          if (key !== 'data') {
            this.halaman[key] = response[key]
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async navigation(type) {
      if (!this.halaman[type]) {
        return
      }
      await this.search(this.keyword, this.url, this.halaman[type])
    },
    clean() {
      this.keyword = ''
      this.cleanResult()
    },
    cleanResult() {
      this.result = []
      this.halaman = {
        first: null,
        last: null,
        prev: null,
        next: null,
        total: 0,
        page: null
      }
    }
  }
})