export class ClassSet<T> extends Set<T>{
  public toArray(): T[] {
    return Array.from(this);
  }

  /**
   * 添加多个成员
   * @param members
   */
  public addAll(...members: T[]): this {
    members.forEach(member => this.add(member));
    return this;
  }

  /**
   * 创建
   * @param members
   */
  static create<T>(...members: T[]): ClassSet<T> {
    return new ClassSet<T>(members);
  }

  /**
   * 克隆
   * @param classSet
   */
  static from<T extends ClassSet<any>>(classSet: T): ClassSet<T> {
    return new ClassSet<T>(classSet.toArray());
  }
}