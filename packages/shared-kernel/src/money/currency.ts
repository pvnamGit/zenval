const ISO_4217_CODE = /^[A-Z]{3}$/;

export class Currency {
  private constructor(readonly code: string) {}

  static from(code: string): Currency {
    if (!ISO_4217_CODE.test(code)) {
      throw new Error(`Invalid ISO 4217 currency code: ${code}`);
    }

    return new Currency(code);
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }
}
