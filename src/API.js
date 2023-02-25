// TODO: bu list `reasonsUrl`den cekilmeli
const reasons = ["enkaz","erzak","guvenli-noktalar","hayvanlar-icin-tedavi","giysi","konaklama","kurtarma","lojistik","su","yemek","elektronik","barinma"]

// TODO: API endpoint'ler environment variable ile aktarilmali
// TODO: query string'de bulunan lokasyon, locations drop down component'dan gelmeli
const areasUrl = "https://apigo.afetharita.com/feeds/areas?ne_lat=39.91618777305531&ne_lng=47.85149904303703&sw_lat=36.07272886939253&sw_lng=23.872389299415502&is_location_verified=0&is_need_verified=0"
const feedsUrl = "https://apigo.afetharita.com/feeds"
const reasonsUrl = "https://apigo.afetharita.com/reasons"

const IS_LOCATION_VERIFIED = 'is_location_verified'
const IS_NEED_VERIFIED = 'is_need_verified'
const EXTRA_PARAMS = 'extraParams'

const Areas = {
  url: new URL(areasUrl),
  reasons: [], // selected reasons

  locationVerified() {
    this.url.searchParams.set(IS_LOCATION_VERIFIED, "1")
    return this
  },

  locationNotVerified() {
    this.url.searchParams.set(IS_LOCATION_VERIFIED, "0")
    return this
  },


  needVerified() {
    this.url.searchParams.set(IS_NEED_VERIFIED, "1")
    return this
  },

  needNotVerified() {
    this.url.searchParams.set(IS_NEED_VERIFIED, "0")
    return this
  },

  withExtraParams() {
    this.url.searchParams.set(EXTRA_PARAMS, "1")
    return this
  },

  withoutExtraParams() {
    this.url.searchParams.set(EXTRA_PARAMS, "0")
    return this
  },

  getURL() {
    return this.url.toString()
  },

  getUpdateURL() {
    // return `${this.url.origin}${this.url.pathname}`
    return `/blabla`
  }
}

const Feeds = {
  url: new URL(feedsUrl),

  getURL(id) {
    return `${this.url.toString()}/${id}`
  }
}

const API = {
  Areas, Feeds,
  reasons: reasons,
}
export default API
