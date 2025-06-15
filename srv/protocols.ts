import { Request } from "@sap/cds";

export type FullRequestParameters<ExpectedResult> = Request & {
    results: ExpectedResult;
}