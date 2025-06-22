export type DeliveryType =
  | 'door_to_door'
  | 'port_to_port'
  | 'door_to_port'
  | 'port_to_door'

export const getDeliveryTypeLabel = (type: DeliveryType): string => {
  switch (type) {
    case 'door_to_door':
      return 'Door to Door'
    case 'port_to_port':
      return 'Port to Port'
    case 'door_to_port':
      return 'Door to Port'
    case 'port_to_door':
      return 'Port to Door'
  }
}
