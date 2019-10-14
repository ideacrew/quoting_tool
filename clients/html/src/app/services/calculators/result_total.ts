export class ResultTotal {
  constructor(public total_cost: number, public sponsor_cost: number) {}

  public add(other_amount: ResultTotal) {
    return new ResultTotal(this.total_cost + other_amount.total_cost, this.sponsor_cost + other_amount.sponsor_cost);
  }
}
