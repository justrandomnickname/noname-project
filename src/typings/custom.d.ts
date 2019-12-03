declare module '*.html!' {
  const value: string
  export default value
}

declare module 'file-loader?name=[name].js!*' {
  const value: string
  export = value
}
