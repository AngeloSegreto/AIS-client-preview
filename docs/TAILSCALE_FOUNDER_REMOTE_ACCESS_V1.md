# TAILSCALE_FOUNDER_REMOTE_ACCESS_V1

Status: COORDINATED OPERATIONAL CONTRACT  
Owner / Founder: Angelo Segreto  
Date: 2026-10-04

## Purpose

Tailscale is the founder's general-purpose private remote-access infrastructure.

It is **not an AIS-only component**.

Angelo Segreto may use Tailscale for any personally authorized remote-access purpose, including access to Windows, files, terminals, development tools, local web services, DeskMCP, RDP/SMB/SSH where enabled, and future devices/services in the private tailnet.

AIS may use Tailscale as an authorized consumer of this private access plane, but AIS does not own or revoke the founder's personal Tailscale access.

## Canonical role

```text
TAILSCALE
= GENERAL PRIVATE REMOTE ACCESS PLANE
+ DEVICE IDENTITY
+ ENCRYPTED TRANSPORT
+ NETWORK AUTHORIZATION
```

Founder path:

```text
ANGELO SEGRETO
      |
      v
TAILSCALE IDENTITY / NETWORK AUTHORIZATION
      |
      v
EMI2008 / OTHER AUTHORIZED DEVICES
      |
      +--> RDP / Desktop
      +--> SMB / Files
      +--> SSH / Terminal where supported/enabled
      +--> DeskMCP :8767 / :8768
      +--> local web/services
      +--> other founder-authorized services
```

AIS path:

```text
AIS
 |
 v
TAILSCALE
 |
 v
AUTHORIZED AIS SERVICE
 |
 v
AIS application policy / SEC01 / tool contract
```

## Authority boundary

```text
FOUNDER_GENERAL_REMOTE_ACCESS = TRUE
AIS_ROUTER_CONTROL_OF_FOUNDER_ACCESS = FALSE
AIS_AUTOMATIC_REVOCATION_OF_FOUNDER_ACCESS = FALSE
PAID_FALLBACK = OFF
```

Tailscale network authorization does **not** bypass Windows, RDP, SMB, SSH, DeskMCP, browser, database, or application authentication. Service-level credentials and permissions remain enforced by the destination service.

AIS security policy governs AIS actions. It does not reduce the founder's separately authorized personal remote-access rights.

## PowerShell launcher

Run PowerShell as Administrator if the Tailscale Windows service is stopped.

```powershell
$ts = "C:\Program Files\Tailscale\tailscale.exe"

if (-not (Test-Path $ts)) {
    throw "Tailscale CLI not found at $ts"
}

$svc = Get-Service -Name Tailscale -ErrorAction Stop

if ($svc.Status -ne "Running") {
    Start-Service -Name Tailscale
}

& $ts up
if ($LASTEXITCODE -ne 0) {
    throw "tailscale up failed with exit code $LASTEXITCODE"
}

& $ts status
& $ts ip -4
```

Compact form:

```powershell
$ts="C:\Program Files\Tailscale\tailscale.exe"; if((Get-Service Tailscale).Status -ne "Running"){Start-Service Tailscale}; & $ts up; & $ts status; & $ts ip -4
```

## Verification

A successful local startup must establish only what is actually observed:

```text
Tailscale service running
+ tailscale up succeeds
+ tailscale status returns the tailnet state
+ tailscale ip -4 returns the node's Tailscale IPv4
```

This does not by itself prove that every remote service is enabled or reachable. RDP, SMB, SSH, DeskMCP and other services require their own health/access checks.

## AIS interpretation

Tailscale is shared founder infrastructure.

```text
TAILSCALE != AIS
TAILSCALE != AIS AUTHORITY
TAILSCALE != AUTOMATIC APPLICATION AUTHORIZATION

TAILSCALE = GENERAL PRIVATE ACCESS INFRASTRUCTURE
AIS = ONE AUTHORIZED CONSUMER
ANGELO SEGRETO = FOUNDER / HUMAN OWNER WITH SEPARATE PERSONAL ACCESS
```
