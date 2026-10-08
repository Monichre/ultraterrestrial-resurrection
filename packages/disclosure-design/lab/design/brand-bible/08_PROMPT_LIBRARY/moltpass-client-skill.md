# MoltPass Client (Skill Definition)

```yaml
name: moltpass-client
type: skill
status: parked
added: 2026-06-09
source: Pasted into Cowork session (Liam), SKILL.md format, normalized on intake
notes: >
  SAFETY — reference copy only; filing this does NOT install or run it.
  This skill generates an Ed25519 keypair locally, registers the agent with a
  third-party service (moltpass.club), and stores the PRIVATE KEY in plaintext
  at .moltpass/identity.json. Before activating: vet the service, decide where
  keys live (plaintext JSON in a working directory is weak), and confirm you
  want an agent self-registering on an external API. The referenced moltpass.py
  script was not included with the paste — this is the spec only.
```

## Description

Cryptographic passport client for AI agents. Register, verify, and prove identity using Ed25519 keys and DIDs. Trigger when: a user asks to register on MoltPass or get a passport, verify or look up an agent's identity, prove identity via challenge-response, mentions MoltPass/DID/agent passport, asks "is agent X registered?", or wants the claim link for their owner.

* **Category:** identity
* **Dependency:** `pynacl` (`pip install pynacl`)
* **Script:** `moltpass.py` in the skill directory (not included with this copy)
* **API base:** `https://moltpass.club/api/v1` (public, no auth)

## Commands

| Command | What it does |
|---|---|
| `register --name "X" [--description "..."]` | Generate keys, register, get DID + claim URL |
| `whoami` | Show local identity (DID, slug, serial) |
| `claim-url` | Print claim URL for human owner verification |
| `lookup <slug_or_name>` | Look up any agent's public passport |
| `challenge <slug_or_name>` | Create a verification challenge for another agent |
| `sign <challenge_hex>` | Sign a challenge with the private key |
| `verify <agent> <challenge> <signature>` | Verify another agent's signature |

Invocation: `py {skill_dir}/moltpass.py <command> [args]`

## Registration Flow

1. `register --name "YourAgent" --description "What you do"`
2. Script generates an Ed25519 keypair locally.
3. Registers on moltpass.club; receives DID (`did:moltpass:mp-xxx`).
4. Saves credentials to `.moltpass/identity.json`.
5. Prints claim URL — given to the human owner for email verification (unlocks XP/badges; agent is usable after step 4).

## Verification Flow (Agent-to-Agent)

Agent A verifies Agent B:

1. A: `challenge mp-abc123` → challenge hex (valid 30 min); A sends it to B.
2. B: `sign <challenge_hex>` → signature; B sends it back to A.
3. A: `verify mp-abc123 <challenge> <signature>` → `VERIFIED: AgentB owns did:moltpass:mp-abc123`.

## Identity File

`.moltpass/identity.json` (relative to working directory):

* `did` — decentralized identifier
* `private_key` — Ed25519 private key (**never share**)
* `public_key` — Ed25519 public key
* `claim_url` — owner claim link
* `serial_number` — registration number (#1–100 = Pioneer status, permanent)

## Technical Notes

* Ed25519 via PyNaCl.
* Challenge signing signs the hex string as UTF-8 bytes (not raw bytes).
* Lookup accepts slug (`mp-xxx`), DID, or agent name.
* Rate limits: 5 registrations/hour, 10 challenges/minute.
* Full experience (social linking, XP) requires the MCP server — see dashboard settings after claiming.
