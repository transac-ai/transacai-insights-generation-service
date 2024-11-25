# TransacAI Insights Generation Service

This project is the codebase for the Insights Generation Service (IGS) of the TransacAI project.

## TransacAI

TransacAI project is geared towards generation of enriched summaries and insights of transactional data in real-time or batch using Generative AI and Large Language Models (LLMs). It goes beyond visual and analytical processing of transactional data by generating context-aware and enriched insights in natural language using LLMs. It focuses on delivering human-centric analysis that is easier to understand and act upon, eliminating the need for multiple complex data processing steps to derive insights from raw data.

## Insights Generation Service (IGS)

IGS is one of the core service of the TransacAI project. The primary goal of this service is to generate enriched insights from transactional data using Generative AI and Large Language Models (LLMs). The service is designed to be scalable and efficient to handle real-time and batch processing of transactional data.

IGS uses **gRPC** to communicate with the Prompt Builder Service (PBS) of the TransacAI project, to get the prompt to be used to generate LLM response.

Core functionalities of the IGS are:

1. Receives a request through gRPC from the Workload Manager Service (WMS) to generate insights from transactional data.
2. Uses gRPC to communicate with the Prompt Builder Service (PBS) to get the prompt to be used to generate insights using Large Language Model (LLM).
3. Generates insights from LLM using Gemini API or OpenAI API through QvikChat.
4. Save the generated insights in the database.
5. Send update on Kafka topic to inform clients about the generated insights.

In a nutshell, flow looks like this:

```
1. WMS -> IGS
2. IGS <- PBS
3. IGS <- LLM
4. IGS -> Database
5. IGS -> Kafka
```

This project was setup using [QvikChat Starter Template](https://github.com/oconva/qvikchat-starter-template). It comes pre-configured with the following features:

- **QvikChat**: QvikChat installed and configured to start serving chat endpoints.
- **TypeScript**: TypeScript to allow you to write type-safe code efficiently.
- **ESLint**: ESLint to enforce code quality and consistency.
- **Prettier**: Prettier to format your code automatically and ensure consistent code style.
- **Jest**: Jest to run your tests and ensure your code works as expected.
- **GitHub Actions**: GitHub Actions to run your tests and lint your code automatically on every push.
- **SWC**: For faster and more efficient TypeScript compilation.
- **PNPM**: PNPM to manage your dependencies efficiently.

## Local Development

### Prerequisites

Clone the repository.

```bash copy
git clone https://github.com/pranav-kural/transacai-insights-generation-service.git
```

### Setup Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```env copy
GOOGLE_GENAI_API_KEY=
```

Alternatively, you can copy the `.env.tmp` file or rename it to `.env` and fill in the values.

By default QvikChat uses the Google GenAI, so to use QvikChat with default settings, you need to provide the `GOOGLE_GENAI_API_KEY`. You don't have to set values for other environment variables if you are using the default settings.

Add value to the `OPENAI_API_KEY` variable if you're going to use OpenAI models.

### Running the Project

You can run the following commands to get started:

```bash copy
pnpm install
pnpm dev
```

### Testing

This project comes with Jest pre-configured to run your tests, and some tests predefined in the `src/tests` directory. You can run the tests using the following command:

```bash copy
pnpm test
```

Please ensure you have the environment variables set up before running the tests.

By default, Jest is configured to test the source code in the `src` directory. You can change the configuration in the `jest.config.js` file, along with any other Jest configurations you may want to change.

### Genkit Developer UI

You can run the Genkit developer UI to test the response generation through GUI interface. You can know more about the Genkit Developer UI [here](https://firebase.google.com/docs/genkit/devtools#genkit_developer_ui).

Start the Genkit developer UI:

```bash copy
npx genkit start
```

OR, you can install the Genkit CLI globally:

```bash copy
npm i -g genkit
```

Then start the Genkit developer UI:

```bash copy
genkit start
```

### Linting

This project comes with ESLint pre-configured to enforce code quality and consistency. You can run ESLint using the following command:

```bash copy
pnpm lint
```

You can also run ESLint in watch mode using the following command:

```bash copy
pnpm lint:watch
```

### Formatting

This project comes with Prettier pre-configured to format your code automatically and ensure consistent code style. You can run Prettier using the following command:

```bash copy
pnpm format
```

### Building

You can build the project using the following command:

```bash copy
pnpm build
```

This will compile the TypeScript code in the `src` directory and output the compiled JavaScript code in the `lib` directory.

## gRPC

IGS exposes a `GenerateInsights` method through gRPC which can be used by the Workload Manager Service (WMS) to initiate a request to generate insights. This method only returns an object for acknowledgement with a property `received` set to `true` to indicate that the request has been received successfully. The actual insights generation process is asynchronous and the generated insights are sent to the Kafka topic.

Proto file for the service is located at `src/rpc/igs.proto`.

### Testing Locally

You can use the [grpcurl](https://github.com/fullstorydev/grpcurl) CLI tool to test the gRPC service locally.

To list services:

```
grpcurl -plaintext 0.0.0.0:50051 list
```

Please note that reflections API is disabled in production, so you won't be able to list services in production.

To call the `GenerateInsights` method (remember to change `reqId` to a unique value), you can use a command similar to below:

```
grpcurl -plaintext -d '{"reqId":"ghgfjerherw","clientId":"test_client","promptId":2,"recordsSourceId":"SUPABASE","promptTemplatesSourceId":"SUPABASE","fromTime":"2019-12-29T06:39:22Z","toTime":"2019-12-29T23:49:22Z"}' 0.0.0.0:50051 igs.InsightsGenerationService/GenerateInsights
```

Above request uses test client and `promptId` of 2, with sources for both records and prompt templates as `SUPABASE`. You can change the values as per your requirement.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Issues

If you encounter any issues or bugs while using this project, please report them by following these steps:

1. Check if the issue has already been reported by searching our [issue tracker](https://github.com/transac-ai/insights-generation-service/issues).
2. If the issue hasn't been reported, create a new issue and provide a detailed description of the problem.
3. Include steps to reproduce the issue and any relevant error messages or screenshots.

[Open Issue](https://github.com/transac-ai/insights-generation-service/issues/new)
