import type { ID, InventoryStack, PlayerSave } from "../types/gameTypes";

export class InventorySystem {
  addItem(save: PlayerSave, itemId: ID, quantity = 1): PlayerSave {
    const inventory = [...save.inventory];
    const existing = inventory.find((stack) => stack.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      inventory.push({ itemId, quantity });
    }
    return { ...save, inventory };
  }

  removeItem(save: PlayerSave, itemId: ID, quantity = 1): PlayerSave {
    if (!this.hasItem(save, itemId, quantity)) {
      throw new Error(`Not enough ${itemId} in inventory.`);
    }
    const inventory = save.inventory
      .map((stack) => (stack.itemId === itemId ? { ...stack, quantity: stack.quantity - quantity } : stack))
      .filter((stack) => stack.quantity > 0);
    return { ...save, inventory };
  }

  hasItem(save: PlayerSave, itemId: ID, quantity = 1): boolean {
    return (save.inventory.find((stack) => stack.itemId === itemId)?.quantity ?? 0) >= quantity;
  }

  listInventory(save: PlayerSave): InventoryStack[] {
    return save.inventory;
  }
}
