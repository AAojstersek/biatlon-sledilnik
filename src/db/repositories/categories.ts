import { db } from '../db';

export async function renameCategory(id: string, label: string): Promise<void> {
  await db.categories.update(id, { label });
}

export async function setPointsTable(
  id: string,
  pointsByPlace: number[],
  pointsForOtherPlaces: number,
): Promise<void> {
  await db.categories.update(id, { pointsByPlace, pointsForOtherPlaces });
}
