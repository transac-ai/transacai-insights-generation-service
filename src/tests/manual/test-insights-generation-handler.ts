import { insightsGenerationHandler } from "../../core/igs-handler";

async function main() {
  insightsGenerationHandler({
    // generate random request ID
    req_id: Math.random().toString(36).substring(7),
    client_id: "test_client",
    prompt_id: 2,
    records_source_id: "supabase",
    prompt_templates_source_id: "supabase",
    from_time: "2019-12-29T06:39:22Z",
    to_time: "2019-12-29T23:49:22Z",
  })
    .then((res) => {
      console.log("Response: ");
      console.log(res);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
  console.log("Waiting for response...");
}

main();
