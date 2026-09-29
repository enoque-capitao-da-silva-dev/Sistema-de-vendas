import { Injectable } from "@nestjs/common";
import { CashSessionView } from "./cash-session-view";
import { CashSessionReader } from "./cash-session-reader";

@Injectable()
export class CashSessionReaderImpl implements CashSessionReader {
  findById(
    sessionId: string,
  ): Promise<CashSessionView | null> {
    throw new Error('CashSessionReaderImpl...');
  }
}