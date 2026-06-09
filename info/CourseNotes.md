# Course Notes — Building AI-Powered Apps with React, Bun & Express

---

## Technologies

### Bun — The All-in-One Node.js Replacement

If you are coming from Java, think of Bun as a single tool that replaces multiple things at once — similar to how Maven handles both dependency management and building in the Java world. Bun acts as a **runtime** (like the JVM), a **package manager** (like Maven/Gradle), and a **bundler** all in one.

> No need for a separate `npm` — Bun handles everything.

#### Common Bun Commands

| Command | What it does |
|---|---|
| `bun install` | Installs all dependencies listed in `package.json` into `node_modules` |
| `bun add <package>` | Adds a specific dependency to the project |
| `bun create react my-app` | Scaffolds a new React project |
| `bun create vite my-app` | Scaffolds a new Vite project |

---

### Regular Dependencies vs. `devDependencies`

This is similar to the difference between **compile-scope** and **test-scope** dependencies in Maven.

**Regular dependencies** are packages your app needs to actually run in production — for example `express`, `dotenv`, or a database driver. Without them, your server crashes.

**`devDependencies`** are tools used only during development, testing, or the build phase. A good example is `Prettier`.

#### Example: Why add Prettier to `package.json` if you already have the VS Code extension?

You might wonder: *"I already have the Prettier plugin in my IDE — why list it again?"*

The answer is **version consistency**. Listing it in `devDependencies` ensures:

- Every teammate on the project uses the **exact same version** of Prettier
- Switching to a new laptop automatically installs the right version via `bun install`
- No situation where one dev's formatter reformats what another dev's formatter just did

```bash
# Installing a dev dependency with Bun
bun add -d prettier
```

---

### Husky

Husky lets you **automate code execution at Git hook points** — similar to pre-commit or pre-push lifecycle hooks.

Use cases:
- Automatically run Prettier before a commit (so you never forget to format)
- Run your test suite before code is pushed to the remote repository

```bash
bun add -d husky
```

---

### Lint-staged

Works hand-in-hand with Husky. While Husky triggers the automation, `lint-staged` makes sure tasks only run on **files that are staged for commit** — not the entire codebase.

This keeps things fast: no need to lint 500 files when you only changed 2.

```bash
bun add -d lint-staged
```

---

## Prompt Engineering

### What Is Prompt Engineering?

At its core, prompt engineering means **writing better instructions to get more useful results from a language model**.

Think of it like writing a precise method signature in Java — the more clearly you define the input contract, the more predictable and useful the output will be. Even small differences in how you phrase a prompt can dramatically change the result, because AI models work by predicting the most likely continuation.

---

### Bad Prompt vs. Good Prompt

| | Prompt | Problem / Strength |
|---|---|---|
| ❌ Bad | `"Summarize this text"` | Vague — no format, no audience, no length |
| ✅ Good | `"Summarize the following product reviews in 3 short bullet points. Focus on common themes, and use simple language"` | Structured, clear instructions, defined tone |

---

### Advantages of a Good Prompt

- Reduces ambiguity
- Improves consistency across runs
- Shapes the format and tone of the output

---

### The Three-Part Pattern of a Good Prompt

Every strong prompt has three components:

#### 1. Instructions
Tell the model **what to do**.

```
❌ "Summarize the following reviews."
✅ "Summarize the following reviews in 3 short bullet points using simple language."
```

#### 2. Context
Give the model **background information** — a role, an audience, or relevant data.

##### Example:
* "You are a `senior software engineer`. Read the code snippet below and explain it in plain English."

#### 3. Output Format
Tell the model **how to structure the response** — plain text, a list, JSON, etc.

##### Example:
* "Label this message as 'spam' or 'not spam'. Return the result as `JSON with a single key called label`."

---

### Full Example: A Well-Structured Prompt

```
"You are a helpful support agent. Summarize the following customer reviews in 2-3 bullet points. Focus on pain points related to the login experience."
```

Breaking it down:

| Part | Value |
|---|---|
| **Instructions** | `"Summarize"`, `"2-3 bullet points"` |
| **Context** | `"helpful support agent"` |
| **Output format** | Plain text bullet list |

---

### Providing context

#### Role
> Telling the model from which point of view to respond

##### Examples:
* "You are `senior backend engineer`. Explain the code below to a junior developer."
* "You are `customer support agent`. Respond to this customer in a polite and empathetic tone."

#### Background info
> Telling the model about specific rules, facts or content it should know

##### Examples:
* "You are the customer support assistant. `Here's our refund policy: ...`. Now answer this customer's question: ..."

#### Audience
> Important to control tone and complexity of the response

##### Examples:
* "Explain this topic to a `non-technical user`."
* "Write this summary for a `high school student`."

#### Tone
> If you are building a **customer-facing feature**, then we want response to feel warm, casual and reassuring

##### Examples:
* "Respond in a `friendly, conversational tone`. Avoid sounding formal or robotic."
* "Use `professional, empathetic language`, like a calm support rep helping a frustrated customer."

#### Reference data
> In many cases model to take a reasonable decision, it needs additional materials like: task clause, block of reviews, product description, email, etc. 

> Reference materials should be separated `visually` from the prompt instructions

##### Examples:
```
description of the product
---
Give me short answer on whether we should buy this product. Reason this for the unexperienced people in the industry. 
```

---

### Output format

#### Why we should control the length of the response ?
* To avoid hit the `max_output_tokens` limit or to simply ran out of tokens too fast

##### Examples:
* "Summarize this in `under 100 tokens`."
* "Make sure the summary is complete and doesn't end mid-sent" (**helps constistency**)

#### Formats
* TEXT &rarr; **Default format** of the output
    * General information format: easy to understand and natural
* Markdown
    * Is a more structured version of the plain text &rarr; best when **lists**, **headings** and **code** are expected
    * Example:
        * "Summarize this review in two bullet points `using markdown`. Highlight important details in `bold`."
* Comma-separated (`CSV`)
    * To extract list of values
    * Example:
        * "Extract three keywords that describe this article. Return them as a `comma-separated` list in lowercase."
        * Result:
            ```csv
            amazing,scientific,bulgarian
            ```
* JSON
    * Is suitable for extracting **structured data**
    * Example:
        * "From the paragraph below, extract all product names and their prices. Return a valid `JSON array of objects`. Each object should include: a **name** (as a string), and a **price** (as a number, without currency symbols). Only return a `valid JSON. No explanation or extra text`."

#### Providing examples
1. Zero-shot &rarr; give model a task with **no example outputs**
    * Works in most of the cases but not when the **response should be structured** (like in `JSON`)
    * Examples:
        * Prompt **without an example output** yet precise &rarr; results are **bounded**:
            * "Classify product reviews as `POSITIVE`, `NEUTRAL` or `NEGATIVE`"
        * Prompt **without an example output** with **vague** output &rarr; **no clear scope** of the desired results:
            * "Classify product reviews"
        * Incorrect usage of `zero-shot`
        ```json
        ❌ Turn this review into a JSON object.

        ✅ Turn this review into a JSON object.
        
        Exampe output:
        {
            "sentiment": "POSITIVE"
        }
        ```
2. One-shot &rarr; give a model a task with exactly **1 example output**
    * Works in the cases, when one example of the response is enough
    * Example:
    ```json
    Turn this review into a JSON object.
        
    Exampe output:
    {
        "sentiment": "POSITIVE"
    }
    ```
3. Few-shot &rarr; give a model a task with **multiple example outputs**
    * Is needed for the complex response structures with multiple fields and variations of its values
    * If there was given 1 example only with **coplex** structure, then it may be not enough to predict all the possible values
        * Given 1 example in the prompt:
        ```json
        {
            "intent": "order_status",
            "urgency": "high",
            "mentions_order": true
        }

        ❌ Not clear, what values are valid for "intent"
        ❌ How to infer(decided) "urgency"
        ❌ When to set "mentions_order" to true or false 
        ```
    * How much examples usually are enough: `3-5`

#### Handling errors and edge cases
* By default the model will try to answer even if the input is absolute nonsense &rarr; we should always tell the model what to do when the `input` is **missing** or **invalid**.
    * Example 1 &rarr; return an **error** response:
    ```json
    Summarize this product review.
    
    If the input contains fewer than 5 words, return:

    {
        "error": "Too short to summarize"
    }
    ```
    * Example 2 &rarr; ask a clarifying question 
    ```
    If the user's request is too vague or lacks detail, ask a clarifying question instead of guessing.
    ```

#### Hallucinations
* LLM's are not operating with facts. They are predicting what should come next based on patterns in the training data
* If the input is **vague** or is not giving enough information, then model will **fill-out lacks with what sounds right to him**

##### How to prevent them
1. Strategy 1: provide facts in the prompt (**grounding** a response on something real)
    * Example:
    ```
    ❌ Can I cancel my ticket for tomorrow ?

    ✅ Here's our refund policy:
    '...'.

    Now, answer this customer's question:
    'Can I cancel my ticket for tomorrow ?'
    ```
2. Strategy 2: tell the model what to do when it doesn't know
    * Example:
    ```
    "If you are unsure, or the answer isn't available,say: 
    
    'Sorry, I do not have that information.'
    
    Do not guess or make up response."
    ```
3. Strategy 3: limit the model's **scope**
    * Since our application can have some dedicated theme, lets say it is `Shopping`, then answearing of the question **out of this topic** is not correct yet absoluletely valid by default for the model
    * Example:
    ```
    You are a support assistant for a theme park.
    Only answer questions related to the park,
    including rides, tickets, hours, and policies.

    If the question is unrelated, respond with:

    'I am here to help with park-related questions.
    Let me know if there's anything you'd like to
    know about your visit.'
    ```
4. Do `not overtrust the model`. Always **validate the response**
    * Validate outputs (lets say to validate output JSON response on length)
    * `Avoid using for critical decisions without human review`
    * Log the outputs and monitor

> `Hallucination` doesn't mean the model is broken. We just should give the better instructions.