// src/services/aiFraudService.ts
export type Verdict = 'valid' | 'invalid';
export type FraudScanMode = 'mock' | 'live';

export interface FraudScanResult {
  requestId: number;
  verdict: Verdict;          // 'valid' | 'invalid'
  confidence: number;        // 0..100
  isTampered: boolean;       // true if suspected tampering/deepfake
  mode: FraudScanMode;       // 'mock' | 'live'
  signals?: Record<string, unknown>; // optional forensic details
  scannedAt: string;         // ISO timestamp
}

/**
 * Run fraud/tamper scan for a verification request.
 * - mock: deterministic pseudo‑random result for testing
 * - live: placeholder for real pipeline, returns "valid" by default
 */
export async function runFraudScan(
  requestId: number,
  opts?: { mode?: FraudScanMode }
): Promise<FraudScanResult> {
  const mode: FraudScanMode = opts?.mode ?? 'mock';

  if (mode === 'mock') {
    // deterministic but “random‑ish” based on id
    const h = requestId % 97;
    const verdict: Verdict = h % 3 === 0 ? 'invalid' : 'valid';
    const confidence = 80 + (h % 21); // 80..100

    return {
      requestId,
      verdict,
      confidence,
      isTampered: verdict === 'invalid',
      mode,
      signals: {
        // pretend forensic hints
        ecmNoise: (h % 7) / 10,
        faceSwapScore: (h % 5) / 10,
        exifMissing: h % 2 === 0,
      },
      scannedAt: new Date().toISOString(),
    };
  }

  // TODO: plug in your real model/forensics here
  return {
    requestId,
    verdict: 'valid',
    confidence: 95,
    isTampered: false,
    mode: 'live',
    signals: {},
    scannedAt: new Date().toISOString(),
  };
}
