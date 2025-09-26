import { NextResponse } from "next/server";
import { z } from "zod";
import type { ExplainResponse } from "@/types/explain";
import { GoogleGenAI } from "@google/genai";

const ExplainSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z
    .enum(["auto", "javascript", "typescript", "python", "go", "java"])
    .optional()
    .default("auto"),
  autodetect: z.boolean().optional().default(true),
  depth: z.enum(["brief", "detailed"]).optional().default("detailed"),
});

function mockExplain(): ExplainResponse {
  const sample = `function sumUnique(arr){ const set=new Set(arr); let sum=0; for(const v of set) sum+=v; return sum; }`;
  return {
    language: "JavaScript",
    summary:
      "Computes the sum of unique values in an input array by converting to a Set and accumulating.",
    bigO: {
      time: "O(n)",
      space: "O(n)",
      rationale:
        "Building a Set requires O(n) additional space; single pass accumulation.",
    },
    byLine: [
      {
        line: 1,
        code: "function sumUnique(arr){",
        explanation: "Defines a function taking an array of numbers.",
      },
      {
        line: 1,
        code: " const set=new Set(arr);",
        explanation:
          "Creates a Set to remove duplicates, preserving only unique values.",
      },
      {
        line: 1,
        code: " let sum=0;",
        explanation: "Initializes an accumulator variable.",
      },
      {
        line: 1,
        code: " for(const v of set) sum+=v;",
        explanation: "Iterates through unique values and adds each to the sum.",
      },
      {
        line: 1,
        code: " return sum; }",
        explanation: "Returns the final accumulated sum.",
      },
    ],
    potentialIssues: [
      "Assumes numeric inputs; non-numeric values would produce NaN.",
      "No validation for large arrays or extremely large integers (overflow in JS is possible).",
    ],
    refactors: [
      "Validate inputs (ensure numbers) before summation.",
      "Consider reduce over Set for clearer functional style.",
    ],
    tests: [
      "Empty array → 0",
      "[1,1,2,3] → 6",
      "Negative numbers: [-1,-1,2] → 1",
      "Non-numbers should be rejected or coerced",
    ],
  };
}

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = ExplainSchema.safeParse(json);
    if (!parsed.success) {
      // Always return mock on validation failure too
      return NextResponse.json(mockExplain());
    }
    const body = parsed.data;

    // Ganti ke kunci Gemini
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(mockExplain());
    }

    // LLM call: Gemini
    try {
      const ai = new GoogleGenAI({ apiKey });

      const system =
        'You are a precise code explainer. Return STRICT JSON matching this shape: { "language": string, "summary": string, "bigO": { "time": string, "space": string, "rationale"?: string }, "byLine": [ { "line": number, "code": string, "explanation": string } ], "potentialIssues": string[], "refactors": string[], "tests": string[] }. No extra commentary. No markdown. Only JSON.';

      const user =
        `Language: ${body.language}. Autodetect: ${body.autodetect}. Depth: ${body.depth}.\n` +
        "Explain the following code line-by-line and provide the required fields as JSON only.\n\n" +
        body.code;

      // Sesuai dokumentasi terbaru: models.generateContent
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${system}\n\n${user}`,
        // Jika ingin paksa JSON dan properti ini tersedia di versi SDK-mu:
        // generationConfig: { responseMimeType: "application/json" } as any,
      });

      // Ambil teks dari respons (dukungan untuk variasi SDK)
      let content = "";
      try {
        const t: any = (response as any).text;
        content =
          typeof t === "function" ? await t.call(response) : String(t ?? "");
      } catch {
        content = "";
      }

      let data: ExplainResponse | null = null;
      try {
        data = JSON.parse(content) as ExplainResponse;
      } catch {
        data = null;
      }
      if (!data) return NextResponse.json(mockExplain());
      return NextResponse.json(data);
    } catch (e) {
      console.error(e);
      return NextResponse.json(mockExplain());
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(mockExplain());
  }
}
