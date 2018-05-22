import Utils from '@utils'

export default {
  getRandomNumber: ({success, fail}) => {
    Utils.request.get('random-number')
      .then(success).catch(fail)
  }
}