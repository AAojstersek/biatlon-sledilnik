import { db } from '../db';

export async function renameCategory(id: string, label: string): Promise<void> {
  await db.categories.update(id, { label });
}
