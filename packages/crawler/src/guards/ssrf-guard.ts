import ipaddr from "ipaddr.js";

export class SSRFGuard {
  private static BLOCKED_HOSTNAMES = new Set([
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
    "::1",
    "instance-data",
    "metadata.google.internal",
  ]);

  /**
   * Validates target URL against SSRF attacks.
   * Rejects private IP ranges, cloud metadata addresses, loopback, and non-HTTP protocols.
   */
  public static validateUrl(targetUrl: string): { allowed: boolean; reason?: string } {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return { allowed: false, reason: "Malformed URL syntax" };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { allowed: false, reason: `Disallowed protocol '${parsed.protocol}'. Only HTTP(S) permitted.` };
    }

    const hostname = parsed.hostname.toLowerCase();
    const cleanHost = hostname.replace(/^\[|\]$/g, "");

    if (this.BLOCKED_HOSTNAMES.has(cleanHost) || cleanHost.endsWith(".local") || cleanHost.endsWith(".internal")) {
      return { allowed: false, reason: `Blocked hostname '${cleanHost}'` };
    }

    // Check if hostname is an explicit IPv4 or IPv6 address
    if (ipaddr.isValid(cleanHost)) {
      const addr = ipaddr.parse(cleanHost);
      const range = addr.range();

      const forbiddenRanges = [
        "loopback",
        "private",
        "linkLocal",
        "carrierGradeNat",
        "multicast",
        "broadcast",
        "uniqueLocal",
        "unspecified",
      ];

      if (forbiddenRanges.includes(range)) {
        return { allowed: false, reason: `Target IP '${hostname}' falls within forbidden range '${range}'` };
      }
    }

    return { allowed: true };
  }
}
