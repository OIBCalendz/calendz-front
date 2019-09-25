export default {
  methods: {
    capitalizeFirstLetter (str) {
      return str.toString().charAt(0).toUpperCase() + str.substring(1)
    },
    capitalizeFirstLetterEachWords (str) {
      let splitStr = str.toLowerCase().split(' ')
      for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = this.capitalizeFirstLetter(splitStr[i])
      }
      return splitStr.join(' ')
    }
  }
}