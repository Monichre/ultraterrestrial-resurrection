# Diagrams — kernel pipeline + Ultraterrestrial overlay

## 1. Kernel pipeline (same in every applied pack)

```mermaid
flowchart TD
    A[Ingest source items] --> B[Normalize id · hash · dedup]
    B --> C[Hydrate text / transcript / file]
    C --> D[Enrich · optional fidelity]
    D --> F[Extract NER+RE against overlay]
    F --> G[Resolve / link]
    G --> J[Assemble graph + provenance]
    D --> K[Chunk Evidence only] --> L[Embed] --> M[(Vector index)]
    J --> N[(Graph store)]
    M -.->|payload.entityIds| N
```

## 2. Kernel data model (innate)

```mermaid
classDiagram
    class Resource {
      +id hash
      +canonicalRef
      +contentHash
      +status
    }
    class Chunk {
      +id
      +locator
      +text Evidence
    }
    class Entity {
      +id canonical
      +type OverlayType
      +name
      +aliases
    }
    class Claim {
      +id
      +assertionType explicit|reported|inferred
      +confidence
    }
    Resource --> Chunk : CHUNKED_INTO
    Chunk --> Entity : MENTIONS
    Claim --> Chunk : SUPPORTED_BY
    Claim --> Entity : ABOUT
    Entity --> Entity : overlay predicates only
```

## 3. This domain's overlay ontology

```mermaid
flowchart LR
    subgraph Overlay["Ultraterrestrial Entity.type values"]
      P[PERSON / KeyFigure]
      E[EVENT]
      O[ORGANIZATION]
      L[LOCATION]
      T[TESTIMONY]
      TP[TOPIC]
      D[DOCUMENT]
      A[ARTIFACT]
      S[SIGHTING]
    end
    P -->|MEMBER_OF| O
    P -->|WITNESSED| T
    T -->|ABOUT_EVENT| E
    E -->|OCCURS_AT| L
    S -->|OCCURS_AT| L
    A -->|FOUND_AT| L
    D -->|REFERENCES| E
    D -->|AUTHORED_BY| P
    TP -->|HAS_TESTIMONY| T
    E -->|HAS_EXPERT| P
```

`AUTHORED_BY` targets a KeyFigure, not a kernel `Author` node.

## 4. Resource lifecycle (kernel)

```mermaid
stateDiagram-v2
    [*] --> ingested
    ingested --> normalized
    normalized --> duplicate: hash match
    duplicate --> [*]
    normalized --> hydrated
    hydrated --> quarantined: fidelity fail
    hydrated --> classified
    classified --> rejected
    classified --> extracted
    extracted --> needs_review: low confidence
    extracted --> resolved
    resolved --> assembled
    assembled --> indexed
```
