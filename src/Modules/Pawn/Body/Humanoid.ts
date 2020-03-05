import { BaseBody } from './BaseBody'
import { HumanoidBody } from './BodyCollection'

export class Humanoid extends BaseBody {
  protected parts: BaseBody.IBody = HumanoidBody
  constructor() {
    super()
  }
}
