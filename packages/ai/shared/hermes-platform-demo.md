# IMPORTANT - this is a config borrowed from a Hermes Agent instance. Review this for learning purposes and reference only

```
providers:
  merge:
    name: Merge Gateway
    base_url: https://api-gateway.merge.dev/v1
    api_key_env: MERGE_GATEWAY_API_KEY
    protocol: openai
    default_model: zai/glm-5.3-flash
    capabilities: [chat, responses, tools]
  cheaper-inference:
    name: Cheaper Inference
    base_url: https://api.cheaperinference.com/v1
    api_key_env: CHEAPER_INFERENCE_API_KEY
    protocol: openai
    default_model: gpt-5.6-luna
    capabilities: [chat, responses, tools]
  experiential:
    name: Experiential Labs
    base_url: https://api.experientiallabs.ai/v1
    api_key_env: EXPERIENTIAL_API_KEY
    protocol: openai
    default_model: claude-sonnet-4-5
    capabilities: [chat, tools, structured_output]
  openrouter:
    name: OpenRouter
    base_url: https://openrouter.ai/api/v1
    api_key_env: OPENROUTER_API_KEY
    protocol: openai
    capabilities: [chat, tools, structured_output]
  nvidia:
    name: NVIDIA NIM API
    base_url: https://integrate.api.nvidia.com/v1
    api_key_env: NVIDIA_API_KEY
    protocol: openai
    default_model: z-ai/glm-5.3-flash
    transport: chat_completions
    discover_models: true
    models:
      - moonshotai/kimi-k3
      - z-ai/glm-5.3
      - z-ai/glm-5.3-flash
      - meta/muse-glimmer-30b
  manifest:
    name: Manifest
    base_url: https://app.manifest.build/v1
    api_key_env: MANIFEST_API_KEY
    protocol: openai
    default_model: manifest-v1
    capabilities: [chat, tools]
  vercel:
    name: Vercel AI Gateway
    base_url: https://ai-gateway.vercel.sh/v1
    api_key_env: VERCEL_AI_GATEWAY_API_KEY
    protocol: openai
    capabilities: [chat, responses, tools]
  kie:
    name: Kie AI
    base_url: https://api.kie.ai
    api_key_env: KIE_API_KEY
    protocol: custom
    capabilities: [images, audio, video]
  kong:
    name: Kong AI Gateway
    base_url: ""
    api_key_env: KONG_AI_GATEWAY_API_KEY
    protocol: openai
    capabilities: [chat, tools]

routes:
  primary:
    provider: merge
    model: zai/glm-5.3-flash
  fast:
    provider: merge
    model: zai/glm-5.3-flash
    fallback: [openrouter]
  reasoning:
    provider: merge
    model: zai/glm-5.3-flash
    fallback: [experiential]
  price-test:
    provider: cheaper-inference
    model: gpt-5.6-luna
  nvidia-kimi:
    provider: nvidia
    model: moonshotai/kimi-k3
  nvidia-glm:
    provider: nvidia
    model: z-ai/glm-5.3
  nvidia-flash:
    provider: nvidia
    model: z-ai/glm-5.3-flash
  nvidia-glimmer:
    provider: nvidia
    model: meta/muse-glimmer-30b
  media:
    provider: kie
    asynchronous: true
    idempotency_required: true
```
