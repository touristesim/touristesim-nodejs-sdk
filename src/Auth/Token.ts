/**
 * OAuth Token class
 */
export class Token {
  private accessToken: string;
  private tokenType: string = 'Bearer';
  private expiresIn: number;
  private expiresAt: number;
  private expirationBuffer: number = 60; // seconds

  constructor(data: any) {
    this.accessToken = data.access_token;
    this.tokenType = data.token_type || 'Bearer';
    this.expiresIn = data.expires_in || 3600;
    // Calculate expiration time with buffer
    this.expiresAt = Math.floor(Date.now() / 1000) + this.expiresIn - this.expirationBuffer;
  }

  getAccessToken(): string {
    return this.accessToken;
  }

  getTokenType(): string {
    return this.tokenType;
  }

  getExpiresIn(): number {
    return this.expiresIn;
  }

  getExpiresAt(): number {
    return this.expiresAt;
  }

  isExpired(): boolean {
    return Math.floor(Date.now() / 1000) >= this.expiresAt;
  }

  getTimeRemaining(): number {
    return Math.max(0, this.expiresAt - Math.floor(Date.now() / 1000));
  }

  getAuthorizationHeader(): string {
    return `${this.tokenType} ${this.accessToken}`;
  }

  toJSON(): Record<string, any> {
    return {
      access_token: this.accessToken,
      token_type: this.tokenType,
      expires_in: this.expiresIn,
      expires_at: this.expiresAt,
    };
  }

  static fromJSON(data: Record<string, any>): Token {
    return new Token(data);
  }
}
