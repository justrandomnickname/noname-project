export class Livestock implements Livestock.ILivestock {
  constructor(
    public gold: Livestock.IResource = { name: 'Gold', amount: 0 },
    public silver: Livestock.IResource = { name: 'Silver', amount: 0 },
    public gems: Livestock.IResource = { name: 'Gems', amount: 0 },
    public food: Livestock.IResource = { name: 'Food', amount: 0 },
    public goods: Livestock.IResource = { name: 'Trading goods', amount: 0 },
    public materials: Livestock.IResource = { name: 'materials', amount: 0 },
    public weaponsAndArmour: Livestock.IResource = { name: 'Weapons and armour', amount: 0 },
    public lore: Livestock.IResource = { name: 'Lore', amount: 0 },
    public crystals: Livestock.IResource = { name: 'Crystals', amount: 0 },
  ) {}

  get resources(): Livestock.IResource[] {
    return [
      this.gold,
      this.silver,
      this.gems,
      this.food,
      this.goods,
      this.materials,
      this.weaponsAndArmour,
      this.lore,
      this.crystals,
    ]
  }
}

export namespace Livestock {
  export interface IResource {
    name: string
    amount: number
  }
  export interface ILivestock {
    gold: IResource
    silver: IResource
    gems: IResource
    food: IResource
    goods: IResource
    materials: IResource
    weaponsAndArmour: IResource
    lore: IResource
    crystals: IResource
    resources: IResource[]
  }

  export const Schema: Realm.ObjectSchema = {
    name: 'Livestock',
    properties: {
      session_id: 'string',
      gold: 'int',
      silver: 'int',
      gems: 'int',
      food: 'int',
      goods: 'int',
      materials: 'int',
      weaponsAndArmour: 'int',
      lore: 'int',
      crystals: 'int',
    },
  }
}
