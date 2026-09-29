import { CashSessionView } from "./cash-session-view";

export interface CashSessionReader {
  findById(
    sessionId: string,
  ): Promise<CashSessionView | null>;
}

export const CASH_SESSION_READER = Symbol('CASH_SESSION_READER');