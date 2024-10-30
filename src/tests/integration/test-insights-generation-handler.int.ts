import { insightsGenerationHandler } from "../../core/igs-handler";

async function main() {
  insightsGenerationHandler({
    req_id: "1",
    client_id: "test_client",
    prompt_id: 2,
    records_source_id: "supabase",
    prompt_templates_source_id: "supabase",
    from_time: "2019-12-29T06:39:22",
    to_time: "2019-12-29T23:49:22",
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
