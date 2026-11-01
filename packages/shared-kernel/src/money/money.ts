import Decimal from "decimal.js";
import { Currency } from "./currency";

export class Money {
  private constructor(
    private readonly decimalAmount: Decimal,
    readonly currency: Currency,
  ) {}

  static from(amount: string, currencyCode: string): Money {
    const decimal = new Decimal(amount);
    if (!decimal.isFinite()) {
      throw new Error("Money amount must be finite");
    }

    return new Money(decimal, Currency.from(currencyCode));
  }

  static zero(currencyCode: string): Money {
    return Money.from("0", currencyCode);
  }

  get amount(): string {
    return this.decimalAmount.toFixed();
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.decimalAmount.plus(other.decimalAmount), this.currency);
  }

  negate(): Money {
    return new Money(this.decimalAmount.negated(), this.currency);
  }

  isZero(): boolean {
    return this.decimalAmount.isZero();
  }

  equals(other: Money): boolean {
    return this.currency.equals(other.currency) && this.decimalAmount.equals(other.decimalAmount);
  }

  private assertSameCurrency(other: Money): void {
    if (!this.currency.equals(other.currency)) {
      throw new Error(`Currency mismatch: ${this.currency.code} and ${other.currency.code}`);
    }
  }
}
