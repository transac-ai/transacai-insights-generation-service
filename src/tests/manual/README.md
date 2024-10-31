# Manual Tests

Test files in this directory are used to manually test some of the functionalities that otherwise cannot be tested automatically.

## Files

- `test-inform-clients-kafka.ts`: Test the `informClients` function. Sends a message to the `new_insights` Kafka topic. Once you run the test, check the Kafka service on Confluent Cloud to see if the message was sent successfully.
- `test-insights-generation-handler.ts`: The `insightsGenerationHandler` function is used to generate insights from the data. This test file is used to manually test the function. Run the test and check the logs to see the generated insights.
