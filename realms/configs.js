export const getConfiguration = () => {
  if (process.env.NODE_ENV === 'development') {
    return {
      deleteRealmIfMigrationNeeded: true,
    }
  } else {
    return {}
  }
}
