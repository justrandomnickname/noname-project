export interface IController {
  Unmount(): void
  Mount(): void
  Save?: (sessionId: string, path: string) => void
  Load?: (sessionId: string, path: string) => void
}
