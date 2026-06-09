# AI-powered Chatbot: Project Tech Stack & Study Notes
A reference guide to the technologies used in this project, plus a set of concepts worth researching as a junior developer. Each comparison includes a short example.

---

## Technologies

The stack is split by responsibility — backend, frontend, tooling, and supporting libraries. Below is what each piece does and why it's in the project.
 
### Backend

- Bun — The All-in-One `Node.js` Replacement

If you are coming from Java, think of Bun as a single tool that replaces multiple things at once — similar to how Maven handles both dependency management and building in the Java world. Bun acts as a **runtime** (like the JVM), a **package manager** (like Maven/Gradle), and a **bundler** all in one.

> No need for a separate `npm` — Bun handles everything.

#### Common Bun Commands

| Command | What it does |
|---|---|
| `bun install` | Installs all dependencies listed in `package.json` into `node_modules` |
| `bun add <package>` | Adds a specific dependency to the project |
| `bun create react my-app` | Scaffolds a new React project |
| `bun create vite my-app` | Scaffolds a new Vite project | 

- **Express** — the web framework that defines API routes and handles HTTP requests/responses.
### Frontend
 
- **Vite** — the build tool and dev server. Provides fast hot-reloading during development.
- **React** — the UI library for building components.
### UI Frameworks
 
- **ShadCN** — a collection of accessible, copy-paste React components built on top of Tailwind.
- **Tailwind CSS** — a utility-first CSS framework for styling directly in your markup.

### Pre-Commit Tools
 
These run automatically before code is committed, keeping the codebase clean and consistent.

#### Husky
* Lets you **automate code execution at Git hook points** — similar to pre-commit or pre-push lifecycle hooks.
* Use cases:
    - Automatically run Prettier before a commit (so you never forget to format)
    - Run your test suite before code is pushed to the remote repository

```bash
bun add -d husky
```

#### Lint-staged
* Works hand-in-hand with Husky. While Husky triggers the automation, `lint-staged` makes sure tasks only run on **files that are staged for commit** — not the entire codebase.
* This keeps things fast: no need to lint 500 files when you only changed 2.

```bash
bun add -d lint-staged
``` 

### Supporting Libraries
 
| Library | Purpose |
|---|---|
| **dotenv** | Loads environment variables from a `.env` file into your app |
| **Prettier** | Auto-formats code (spacing, semicolons, quotes) for consistency |
| **Zod** | Data validation library, widely used in React apps to validate forms and API data |
| **React Hook Form** | Manages form state and validation efficiently |
| **React Icons** | Provides thousands of ready-to-use icons from popular icon sets |
| **Axios** | HTTP client for making API requests from the frontend |
| **react-markdown** | Renders markdown content as React components |
| **Sentry** | Error logging/monitoring — *not used here, but good practice in production* |
| **eslint-plugin-simple-import-sort** | Automatically sorts import statements |
| **eslint-plugin-unused-imports** | Detects and removes unused imports |
| **@tailwindcss/typography** | Adds the `prose` class for nicely styled rendered HTML/markdown |
 
---

## Concepts to Research
 
A study list of concepts worth understanding deeply. Comparisons include examples so the distinction is concrete.
 
### 1. `export default` vs. `export`
 
A module can have **one** default export but **many** named exports. The difference shows up in how you import them.
 
```typescript
// utils.ts
 
// Named export (can have many)
export function add(a: number, b: number) {
  return a + b;
}
 
// Default export (only one per file)
export default function multiply(a: number, b: number) {
  return a * b;
}
```
 
```typescript
// Importing them
 
// Default import — you choose any name, no curly braces
import multiply from './utils';
 
// Named import — name must match exactly, uses curly braces
import { add } from './utils';
```
 
> **Rule of thumb:** use a default export when a file exports one main thing (like a React component). Use named exports for utility files with multiple helpers.
 
---
 
### 2. `useCallback` React Hook
 
`useCallback` memoizes a **function** so it isn't re-created on every render. This is useful when passing callbacks to child components that rely on reference equality to avoid unnecessary re-renders.
 
```tsx
import { useCallback, useState } from 'react';
 
function Parent() {
  const [count, setCount] = useState(0);
 
  // Without useCallback, this function is re-created on every render.
  // With it, the same function reference is reused unless dependencies change.
  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []); // empty deps = function never changes
 
  return <Child onClick={handleClick} />;
}
```
 
---
 
### 3. `useRef` React Hook
 
`useRef` gives you a **mutable container** whose value persists across renders **without** causing a re-render when it changes. Two common uses: accessing DOM elements, and storing a value you want to "remember" between renders.
 
```tsx
import { useRef } from 'react';
 
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);
 
  const focusInput = () => {
    inputRef.current?.focus(); // directly access the DOM node
  };
 
  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```
 
---
 
### 4. State Hooks vs. Ref Hooks
 
This is the key mental model behind `useState` and `useRef`.
 
| | `useState` | `useRef` |
|---|---|---|
| Triggers re-render on change? | ✅ Yes | ❌ No |
| Value persists across renders? | ✅ Yes | ✅ Yes |
| Typical use | Data shown in the UI | DOM access, or values that shouldn't trigger a render |
| Access syntax | `value`, `setValue()` | `ref.current` |
 
```tsx
// useState — changing it re-renders the component (the count updates on screen)
const [count, setCount] = useState(0);
 
// useRef — changing it does NOT re-render (good for tracking without UI updates)
const renderCount = useRef(0);
renderCount.current += 1; // silently tracks renders, no UI update
```
 
> **Rule of thumb:** if the value should appear on screen and update the UI when it changes, use `useState`. If it's "behind the scenes" data or a DOM reference, use `useRef`.
 
---
 
### 5. React Icons
 
A library that bundles icons from many popular sets (FontAwesome, Material, Bootstrap, etc.) as React components. The official site (`react-icons.github.io/react-icons`) is great for browsing and searching for the right icon.
 
```tsx
import { FaArrowCircleUp } from 'react-icons/fa';
 
function ScrollButton() {
  return <FaArrowCircleUp size={24} color="white" />;
}
```
 
---
 
### 6. `items-start` vs. `self-start` (Tailwind Flexbox)
 
Both control alignment along the cross axis, but they apply to **different elements**.
 
- **`items-start`** — set on the **parent (flex container)**. Aligns **all** children to the start of the cross axis.
- **`self-start`** — set on a **single child**. Overrides the parent's alignment for just that one item.
```tsx
{/* Parent aligns ALL children to the start */}
<div className="flex items-start">
  <div>Item A</div>
  <div>Item B</div>
</div>
 
{/* Only this ONE child aligns itself to the start */}
<div className="flex items-center">
  <div>Centered</div>
  <div className="self-start">I align myself differently</div>
</div>
```
 
> In a chat app, `self-start` and `self-end` are handy for placing assistant messages on the left and user messages on the right within the same container.
 
---
 
### 7. Don't Hard-Code Height and Width
 
Sizing should be **flexible** and controlled from the **outside** (by the parent), not baked into a low-level component.
 
The recommended pattern: put a fixed dimension like `h-screen` on the **highest-level component** (e.g. `App.tsx`), then let inner components use relative values like `h-full` to fill the space they're given.
 
```tsx
// ❌ Bad — fixed height baked into a reusable component
function ChatBox() {
  return <div className="h-[600px]">...</div>;
}
 
// ✅ Good — top level sets the boundary
function App() {
  return (
    <div className="h-screen">
      <ChatBox /> {/* ChatBox uses h-full internally */}
    </div>
  );
}
 
function ChatBox() {
  return <div className="h-full">...</div>; // fills whatever the parent gives it
}
```
 
> **Principle:** a component's height and width should be controlled by its parent, not hard-coded inside itself. This keeps components reusable in different layouts.

---

### 8. Regular Dependencies vs devDependencies

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