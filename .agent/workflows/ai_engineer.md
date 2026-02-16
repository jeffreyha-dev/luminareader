---
description: AI Engineer workflow for LLM selection, prompt engineering, RAG implementation, and evaluation
---

# AI Engineer Workflow

This workflow guides the process of designing, implementing, and evaluating AI/LLM-based features, ensuring reliability, performance, and correctness.

## Phase 1: Problem Definition & Strategy

1.  **AI Suitability Assessment**
    *   Determined if AI is actually needed (vs. regex or heuristic).
    *   Define the input (Context/Prompt) and expected output (Structured JSON/Text).
    *   Identify latency and cost constraints.

2.  **Model Selection Strategy**
    *   **Proprietary**: GPT-4, Gemini 2.5 Flash (High reasoning, pay-per-token).
    *   **Open Source**: Llama 3, Mistral, Mixtral (Privacy, self-hosted option).
    *   **Decision Matrix**: Accuracy vs. Speed vs. Cost vs. Privacy.

3.  **Data Strategy (RAG)**
    *   Identify knowledge sources (PDFs, Markdown, SQL, APIs).
    *   Define chunking strategy (Paragraph, Sentence, Semantic).
    *   Select Embedding Model (OpenAI, gecko, huggingface).
    *   Design Vector Database schema (Chroma, Pinecone, pgvector).

## Phase 2: Prototyping & Prompt Engineering

4.  **Prompt Engineering**
    *   **System Prompts**: Define persona, capability, and constraints.
    *   **Few-Shot Prompting**: efficient examples to guide behavior.
    *   **Chain-of-Thought (CoT)**: Force model to explain reasoning before answering.
    *   **Structured Output**: Use JSON mode or function calling to guarantee parsing.

5.  **Chain/Graph Design (Orchestration)**
    *   Design the control flow (LangChain/LangGraph).
    *   **Sequential**: A -> B -> C.
    *   **Router**: Classify intent -> Route to specialist agent.
    *   **Cyclic**: Generate -> Critique -> Refine (Loop).

6.  **Tool Definition**
    *   Define functions tools available to the LLM.
    *   Write clear docstrings (the model reads these!).
    *   Implement input validation for tool arguments.

## Phase 3: Implementation & Optimization

7.  **RAG Implementation**
    *   Implement ingestion pipeline (Load -> Chunk -> Embed -> Store).
    *   Implement retrieval logic (similarity search, hybrid search + keyword).
    *   Implement re-ranking (Cross-encoder) for better relevance.

8.  **Context Window Optimization**
    *   Implement "Needle in a Haystack" awareness.
    *   Summarize message history to save tokens.
    *   Filter irrelevant context before sending to LLM.

9.  **Fine-Tuning (Advanced)**
    *   (Only if prompting fails) Curate dataset of (Input, Ideal Output).
    *   Train LoRA adapter or full fine-tune.
    *   Evaluate against base model.

## Phase 4: Evaluation (Evals) & Testing

10. **Build Evaluation Dataset (Golden Set)**
    *   Create 50-100 examples of inputs + ideal ground truth answers.
    *   Include edge cases and adversarial inputs ("Jailbreak" attempts).

11. **Automated Evaluation**
    *   **LLM-as-a-Judge**: Use GPT-4 to grade the output of the development model.
    *   **Metrics**:
        *   **Answer Relevancy**: Does it answer the user's question?
        *   **Faithfulness**: Is the answer derived from the retrieved context (no hallucination)?
        *   **Correctness**: Semantically similar to ground truth?

12. **Latency & Cost Profiling**
    *   Measure "Time to First Token" (TTFT) and Total Time.
    *   Calculate cost per request.

## Phase 5: Deployment & Monitoring

13. **Deployment Strategy**
    *   **Streaming**: Always stream responses for better UX.
    *   **Caching**: Semantic cache (Redis) for identical queries.
    *   **Fallback**: Retry with a larger model if the small model fails validation.

14. **Monitoring (LLMOps)**
    *   Trace execution chains (LangSmith, Arize, HoneyHive).
    *   Log all prompts and completions (sanitize PII first!).
    *   Monitor for "Drift" (model changing behavior over time).
    *   Set up alerts for high error rates or latency spikes.

## Output Artifacts

| Artifact | Purpose |
|----------|---------|
| System Prompt | The "brains" of the agent |
| Eval Dataset | CSV/JSONL for testing |
| RAG Pipeline | Ingestion and Retrieval code |
| Benchmark Report | Accuracy/Cost/Speed analysis |

## Integration with Other Roles

### → Software Engineer
*   Define clear API contracts for the AI service.
*   Ensure prompt templates are version controlled, not hardcoded strings.

### → Product Manager (`/product_manager`)
*   Set realistic expectations on AI capabilities (no "magic").
*   Define "Acceptable Error Rate".

## Best Practices
*   **Version Everything**: Prompts, Models, and Datasets.
*   **Sanitize Inputs**: Protect against Prompt Injection.
*   **Never Trust the LLM**: Always validate structured output (Pydantic/Zod).
*   **Human-in-the-Loop**: Use humans for high-stakes decisions.

## Common Pitfalls
*   ❌ "Vibes-based" development (no formal evals).
*   ❌ Overstuffing context window (leads to "Lost in the Middle").
*   ❌ Leaking PII to third-party model providers.
*   ❌ Assuming the model knows specific recent events (cutoff dates).