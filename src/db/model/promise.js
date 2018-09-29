import AV from 'leancloud-storage'

class Witness extends AV.Object {
  get dataStatus () { return this.get('dataStatus') }
  set dataStatus (value) { this.set('dataStatus', value) }

  get content () { return this.get('content') }
  set content (value) { this.set('content', value) }

  get status () { return this.get('status') }
  set status (value) { this.set('status', value) }

  get toUserId () { return this.get('toUserId') }
  set toUserId (value) { this.set('toUserId', value) }

  get to () { return this.get('to') }
  set to (value) { this.set('to', value) }

  get from () { return this.get('from') }
  set from (value) { this.set('from', value) }
}

AV.Object.register(Witness, 'Witness')
export default Witness
