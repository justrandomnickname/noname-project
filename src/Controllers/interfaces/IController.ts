export interface IController {
  Unmount(): void
  Mount(): void
  Save?: (sessionId: string) => void
}
