import type { ConnectRouter } from "@connectrpc/connect";
import { IGSService } from "../gen/igs/v1/transac_ai_igs_connect";
import type {
  GenerateInsightsRequest,
  GenerateInsightsResponse,
} from "../gen/igs/v1/transac_ai_igs_pb";
import { insightsGenerationHandler as igsHandler } from "../../core/igs-handler";

export default (router: ConnectRouter) =>
  // registers IGS service
  router.service(IGSService, {
    // implements rpc GenerateInsights
    async generateInsights(
      req: GenerateInsightsRequest
    ): Promise<GenerateInsightsResponse> {
      return igsHandler(req);
    },
  });
