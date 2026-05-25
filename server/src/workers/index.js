import { registerCampaignQueue } from "../services/campaignService.js";
import { registerLeadScrapeQueue } from "../services/leadScraperService.js";
import { registerOutreachQueues } from "../services/outreachService.js";

registerCampaignQueue();
registerLeadScrapeQueue();
registerOutreachQueues();
