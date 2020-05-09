export class ParameterSet<T> extends Set<T> {
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
  static create<T>(...members: T[]): ParameterSet<T> {
    return new ParameterSet<T>(members);
  }

  /**
   * 克隆
   * @param classSet
   */
  static from<T extends ParameterSet<any>>(classSet: T): ParameterSet<T> {
    return new ParameterSet<T>(classSet.toArray());
  }
}