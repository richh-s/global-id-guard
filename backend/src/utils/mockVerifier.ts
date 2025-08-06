/**
 * Stub interface matching your real AI’s response.
 */
export interface VerificationAIResult {
    status: 'valid' | 'invalid'
    confidence: number
    isTampered: boolean
  }
  
  /**
   * Mock “AI” verification: randomly marks documents valid/invalid.
   * Replace with real API integration when ready.
   */
  export async function verifyWithMock(
    fileBuffer: Buffer
  ): Promise<VerificationAIResult> {
    // simulate processing delay
    await new Promise((r) => setTimeout(r, 200))
  
    const isTampered = Math.random() < 0.1
    const confidence = Math.floor(Math.random() * 30) + 70
  
    return {
      status: isTampered ? 'invalid' : 'valid',
      confidence,
      isTampered,
    }
  }
  