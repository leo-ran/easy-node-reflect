export class PropertySet<T> extends Set<T> {
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
  static create<T>(...members: T[]): PropertySet<T> {
    return new PropertySet<T>(members);
  }

  /**
   * 克隆
   * @param classSet
   */
  static from<T extends PropertySet<any>>(classSet: T): PropertySet<T> {
    return new PropertySet<T>(classSet.toArray());
  }
}