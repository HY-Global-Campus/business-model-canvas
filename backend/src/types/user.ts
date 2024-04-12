export interface UserTokenForm {
  displayName: string,
  id: string
}

export const isUserTokenForm = (obj: any): obj is UserTokenForm => {
  return typeof obj === 'object' && obj !== null &&
    'displayName' in obj && typeof obj.displayName === 'string'
    && 'id' in obj && typeof obj.id === 'string'
}


