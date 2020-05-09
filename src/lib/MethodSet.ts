export class MethodSet<T> extends Set<T>{
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
  static create<T>(...members: T[]): MethodSet<T> {
    return new MethodSet<T>(members);
  }

  /**
   * 克隆
   * @param classSet
   */
  static from<T extends MethodSet<any>>(classSet: T): MethodSet<T> {
    return new MethodSet<T>(classSet.toArray());
  }
}