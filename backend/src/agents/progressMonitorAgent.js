import { callClaude, extractJson } from './claudeClient.js';

export const SYSTEM_PROMPT = `You are a quiz generator. Given a skill name, generate 3 MCQ questions to test understanding. Return JSON only: [{question: string, options: [A,B,C,D], answer: string}]`;

export async function runProgressMonitorAgent({ skillName = 'JavaScript', isHarder = false }) {
  const userPrompt = `
Generate 3 MCQ questions to evaluate understanding of "${skillName}"${isHarder ? ' with advanced scenario-based questions' : ''}.
Each question must have exactly 4 choices (A, B, C, D) and specify the correct answer letter (e.g. "A", "B", "C", or "D").
Return strictly valid JSON only:
[
  {
    "question": "What is...",
    "options": ["A) Choice 1", "B) Choice 2", "C) Choice 3", "D) Choice 4"],
    "answer": "A"
  }
]
`.trim();

  const fallbackFn = () => {
    const quizVault = {
      'JavaScript': [
        {
          question: 'What is the key difference between "let" and "var" declarations in JavaScript?',
          options: [
            'A) let is block-scoped while var is function-scoped',
            'B) var cannot be reassigned while let can',
            'C) let is hoisted to the top of window and initialized with undefined',
            'D) var is only available inside asynchronous functions',
          ],
          answer: 'A',
          explanation: 'Variables declared with let and const are block-scoped, whereas var declarations are function-scoped.',
        },
        {
          question: 'What does the Event Loop in JavaScript do when the Call Stack is empty?',
          options: [
            'A) It shuts down the Node.js process immediately',
            'B) It moves queued callback functions from the Microtask/Task Queue onto the Call Stack',
            'C) It automatically garbage collects all variables in memory',
            'D) It restarts execution from line 1 of the main script',
          ],
          answer: 'B',
          explanation: 'The event loop continuously checks if the call stack is empty; once empty, it pushes tasks from queues into the stack.',
        },
        {
          question: 'Which method returns a new array with all elements that pass the test implemented by the provided function?',
          options: [
            'A) array.map()',
            'B) array.reduce()',
            'C) array.filter()',
            'D) array.forEach()',
          ],
          answer: 'C',
          explanation: 'The filter() method creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test.',
        },
      ],
      'React': [
        {
          question: 'What is the primary purpose of the useEffect hook in React functional components?',
          options: [
            'A) To directly modify the browser DOM elements bypassing React',
            'B) To synchronize a component with an external system (side effects like data fetching or subscriptions)',
            'C) To create global Redux stores without context',
            'D) To memoize compute-heavy numerical calculations',
          ],
          answer: 'B',
          explanation: 'useEffect allows developers to perform side effects in functional components such as API calls or event subscriptions.',
        },
        {
          question: 'Why should keys in React lists be unique and stable across re-renders?',
          options: [
            'A) Keys are required for CSS flexbox alignment',
            'B) React uses keys to match and efficiently reconcile Virtual DOM children elements',
            'C) Keys convert functional components into class components',
            'D) Keys enable automated TypeScript type-checking at runtime',
          ],
          answer: 'B',
          explanation: 'Keys give React a stable identity for each element in an array so it can efficiently determine additions, moves, and deletions.',
        },
        {
          question: 'What happens when you update state via useState using the setter function?',
          options: [
            'A) React immediately and synchronously updates state on the current line of code',
            'B) React schedules a re-render of the component with the new state value',
            'C) The browser window is forced to reload',
            'D) Only the parent component re-renders',
          ],
          answer: 'B',
          explanation: 'State setters in React schedule a re-render pass rather than immediately mutating the in-flight state.',
        },
      ],
      'Node.js': [
        {
          question: 'Which core module in Node.js is primarily used for handling file read and write operations?',
          options: [
            'A) http',
            'B) path',
            'C) fs',
            'D) events',
          ],
          answer: 'C',
          explanation: 'The Node.js fs (File System) module enables interacting with the file system in both synchronous and asynchronous modes.',
        },
        {
          question: 'What is the purpose of the middleware function signature (req, res, next) in Express.js?',
          options: [
            'A) next() passes control to the next middleware in the request-response cycle',
            'B) next() terminates the TCP connection immediately',
            'C) req is used exclusively for writing SQL queries',
            'D) res must only return plain HTML strings',
          ],
          answer: 'A',
          explanation: 'Express middleware functions take req, res, and next. Calling next() invokes the next handler in line.',
        },
        {
          question: 'Node.js runtime is fundamentally built upon which engine and library?',
          options: [
            'A) SpiderMonkey and Apache',
            'B) V8 JavaScript engine and libuv',
            'C) WebKit and OpenSSL alone',
            'D) JVM and Nginx',
          ],
          answer: 'B',
          explanation: 'Node.js is built on Google Chrome V8 engine for execution and libuv for cross-platform asynchronous I/O.',
        },
      ],
      'MongoDB': [
        {
          question: 'In MongoDB, what is the default primary key field created automatically for every document?',
          options: [
            'A) id',
            'B) _id',
            'C) uuid',
            'D) pk_index',
          ],
          answer: 'B',
          explanation: 'Every document stored in MongoDB requires an _id field that serves as its unique primary key.',
        },
        {
          question: 'Which aggregation pipeline stage is used to filter documents in MongoDB (equivalent to WHERE in SQL)?',
          options: [
            'A) $project',
            'B) $group',
            'C) $match',
            'D) $lookup',
          ],
          answer: 'C',
          explanation: '$match filters the documents to pass only those that match the specified condition(s) to the next pipeline stage.',
        },
        {
          question: 'What format does MongoDB internally use to store documents on disk for high performance and type support?',
          options: [
            'A) Plain XML',
            'B) YAML',
            'C) BSON (Binary JSON)',
            'D) Protocol Buffers',
          ],
          answer: 'C',
          explanation: 'MongoDB stores data records as BSON documents, a binary representation of JSON-like documents.',
        },
      ],
      'REST APIs': [
        {
          question: 'Which HTTP method should be used to create a new resource in a RESTful API convention?',
          options: [
            'A) GET',
            'B) POST',
            'C) PUT',
            'D) DELETE',
          ],
          answer: 'B',
          explanation: 'POST is the standard HTTP method used to send data to the server to create a new resource.',
        },
        {
          question: 'What HTTP status code represents "201 Created"?',
          options: [
            'A) Request was successful and a new resource was created',
            'B) The requested resource could not be found',
            'C) User is unauthorized to access this endpoint',
            'D) Internal server error occurred',
          ],
          answer: 'A',
          explanation: 'HTTP 201 indicates that the request has succeeded and led to the creation of a new resource.',
        },
        {
          question: 'What makes an HTTP method idempotent in REST API design?',
          options: [
            'A) It can only be called once per day',
            'B) Making multiple identical requests has the same intended effect as making a single request',
            'C) It always returns encrypted payloads',
            'D) It does not require any authentication headers',
          ],
          answer: 'B',
          explanation: 'Idempotency means that performing the request multiple times produces the same end result on the server (e.g. GET, PUT, DELETE).',
        },
      ],
    };

    const questions = quizVault[skillName] || [
      {
        question: `What is a fundamental best practice when implementing ${skillName}?`,
        options: [
          'A) Applying modular separation of concerns and clear error handling',
          'B) Storing all state in global window variables',
          'C) Avoiding version control systems like Git',
          'D) Disabling security headers in production',
        ],
        answer: 'A',
        explanation: 'Modular design and proactive error handling are essential engineering standards.',
      },
      {
        question: `How does mastering ${skillName} directly benefit modern production software systems?`,
        options: [
          'A) It guarantees hardware level overclocking',
          'B) It enhances scalability, maintainability, and domain execution efficiency',
          'C) It removes the need for web browsers',
          'D) It eliminates network latency completely',
        ],
        answer: 'B',
        explanation: 'Strong mastery provides architectural stability, performance, and code maintainability.',
      },
      {
        question: `Which diagnostic technique is most effective for troubleshooting issues in ${skillName}?`,
        options: [
          'A) Structured logging, unit testing, and isolated debugging',
          'B) Deleting random source files until errors disappear',
          'C) Ignoring stack traces in console output',
          'D) Changing compiler flags blindly',
        ],
        answer: 'A',
        explanation: 'Systematic debugging with unit tests and logs provides clear root-cause diagnosis.',
      },
    ];

    return questions;
  };

  const response = await callClaude({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    fallbackFn,
  });

  const parsed = extractJson(response.text);
  const questions = Array.isArray(parsed) ? parsed : [parsed];

  return {
    skill: skillName,
    questions: questions.map((q, idx) => ({
      id: `q-${idx + 1}`,
      question: q.question,
      options: q.options,
      answer: q.answer,
      explanation: q.explanation || `The correct option is ${q.answer}.`,
    })),
    meta: {
      agent: 'Progress Monitor Agent',
      model: response.model,
      source: response.source,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  };
}

