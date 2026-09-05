import Dexie, { type EntityTable } from 'dexie';
import type {
  Category,
  Competition,
  Competitor,
  Result,
  StructurePreset,
} from '../types/models';

export class BiathlonDB extends Dexie {
  categories!: EntityTable<Category, 'id'>;
  competitors!: EntityTable<Competitor, 'id'>;
  competitions!: EntityTable<Competition, 'id'>;
  results!: EntityTable<Result, 'id'>;
  structurePresets!: EntityTable<StructurePreset, 'id'>;

  constructor() {
    super('BiathlonTrackerDB');
    this.version(1).stores({
      categories: 'id, kind',
      competitors: 'id, categoryId, archived',
      competitions: 'id, categoryId, date',
      results: 'id, competitionId, competitorId, [competitionId+competitorId], [competitionId+boutOrder]',
      structurePresets: 'id',
    });
  }
}

export const db = new BiathlonDB();
