/**
 * Project error handler. Use this instance alongside with native error handlers.
 * Will be connected to project logger in near future. DO NOT throw errors separately neither log important user information to console, this is pointless.
 * Accepted methods is: console.warn, console.error, throw Error.
 * @param at - main message. Required to describe essence of error.
 * @param args - optional parameter to provide additional information.
 */
export default class ErrorHandler {
  private at: string
  private args: string[] = []
  constructor(at: string, ...args: string[]) {
    this.at = at
    this.args = args
  }

  /**
   * Throws EVENT error. For futher information look documentation for project EVENTS.
   * Use it wherever event conditions do not meet the proper requirements.
   * @public
   */
  public EVENT(): string {
    return this.ArgsConcatenator(`Invalid event at - ${this.at}`)
  }
  /**
   * Throws OBJECT error. Usually it means what provided object is invalid for various reasons, which typescript compiler cannot process.
   * @public
   */
  public OBJECT(): string {
    return this.ArgsConcatenator('Invalid object name - ${this.at}')
  }

  /**
   * Concatenator for rest parameters. Purely DRY function.
   * @param message
   * @private
   */
  private ArgsConcatenator(message: string): string {
    return [message].concat(this.args).join('. ')
  }
}
