# Decision Tree App

This is a Next.js application that guides a user through a decision-making tree.
It is pre-configured with a Mental Capacity Act (2005) assessment flow.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customizing the Flowchart

The decision tree logic is stored in `data/flowchart.json`. You can edit this file to change the questions, options, and logic.

### Structure

- **startNodeId**: The ID of the first question.
- **nodes**: An object containing all the nodes (questions or results).

### Node Types

1. **Question Node**:
   ```json
   "1": {
     "id": "1",
     "text": "Question text here",
     "details": "Optional details or guidance notes.",
     "type": "question",
     "options": [
       { "label": "Yes", "nextNodeId": "2" },
       { "label": "No", "nextNodeId": "3" }
     ]
   }
   ```

2. **Result Node**:
   ```json
   "result-id": {
     "id": "result-id",
     "text": "Final Outcome",
     "details": "Explanation of the outcome.",
     "type": "result",
     "status": "capacity" // or "incapacity" for styling
   }
   ```
