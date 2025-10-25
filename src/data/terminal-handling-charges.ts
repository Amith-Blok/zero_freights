import TerminalHandlingCharge from '@/models/terminal-handling-charges'

export async function getTerminalHandlingChargeByCode(code: string) {
  const terminalHandlingCharge = await TerminalHandlingCharge.findOne({
    port_code: code,
  })
  if (!terminalHandlingCharge) {
    throw Error('Terminal handling charge not found')
  }
  return terminalHandlingCharge
}
