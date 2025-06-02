import { InferSelectModel, and, eq } from "drizzle-orm";
import { db } from '../services/db';

// Base Model class
export class Model<T extends Object, Table extends InferSelectModel<any>> {
  static table: any;
  _data: T;
  constructor(data: T) {
    this._data = data;
    return new Proxy(this, {
      get(target, prop: string) {
        if (prop in target._data) {
          return target._data[prop];
        }
        return target[prop];
      },
      set(target, prop: string, value) {
        if (prop in target._data) {
          target._data[prop] = value;
          return true;
        }
        throw new Error(`Property ${prop} does not exist on the model.`);
      }
    }) as unknown as Model<T, Table> & T;
  }

  static async find(id: number, primaryKey = 'id'): Promise<Model<any, any> | null> {
    const result = db.select().from(this.table).where(eq(this.table[primaryKey], id)).get();
    return result ? new this(result) : null;
  }

  static async create(data: Partial<InferSelectModel<typeof this.table>>): Promise<Model<any, InferSelectModel<any>>> {
    const [inserted] = await (db.insert(this.table).values(data).returning() as Promise<any[]>);
    return new this(inserted);
  }

  static async where(conditions: Partial<InferSelectModel<typeof this.table>>): Promise<Model<any, InferSelectModel<any>>[]> {
    const whereClauses = Object.entries(conditions).map(([key, value]) => eq(this.table[key], value));
    if (whereClauses.length > 0) {
     return (
        await db
          .select()
          .from(this.table)
          .where(and(...whereClauses))
      ).map((data) => new this(data));
    } else {
      return (await db.select().from(this.table)).map(data => new this(data))
    }
  }
  static async whereFirst(conditions: Partial<InferSelectModel<typeof this.table>>): Promise<Model<any, InferSelectModel<any>>> {
    const whereClauses = Object.entries(conditions).map(([key, value]) => eq(this.table[key], value));
    if (whereClauses.length > 0) {
      return (
        await db
          .select()
          .from(this.table)
          .where(and(...whereClauses))
          .limit(1)
      ).map((data: any) => new this(data))[0];
    } else {
      return (await db.select().from(this.table).limit(1)).map(data => new this(data))[0]
    }
  }

  async save(primaryKey = 'id'): Promise<void> {
    const table = (this.constructor as typeof Model<T, Table>).table;
    if (this._data[primaryKey]) {
      await db.update(table).set(this._data).where(eq(table[primaryKey], this._data[primaryKey]));
    } else {
      const [inserted] = await (db.insert(table).values(this._data).returning() as Promise<any[]>);
      this._data = inserted;
    }
  }
  async delete(primaryKey = 'id'): Promise<void> {
    const table = (this.constructor as typeof Model<T, Table>).table;
    if (this._data[primaryKey]) {
      await db.delete(table).where(eq(table[primaryKey], this._data[primaryKey]));
    }
  }
}