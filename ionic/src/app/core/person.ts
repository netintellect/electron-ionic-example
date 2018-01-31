export class Person {
  constructor(
    /**
     * The complete 10-digit (USA) phone number of the person assigned to this computer.
     */
    public phone: string = '',
    /**
     * The name of the person assigned to this computer.
     */
    public name: string = ''
  ) {
  }

  toString(): string {
    let result = `${this.name} @ ${this.phone}`;
    return result;
  }
}
