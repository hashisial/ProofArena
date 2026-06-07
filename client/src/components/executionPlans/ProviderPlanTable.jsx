import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/index.js";
import { formatPlanPrice, formatPlanTimeline } from "../../features/executionPlans/executionPlanUtils.js";
import { getProviderPlanNextAction } from "../../features/executionPlans/providerPlanPerformanceUtils.js";
import { formatDate } from "../../utils/formatDate.js";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ExecutionPlanStatusBadge } from "./ExecutionPlanStatusBadge.jsx";

export function ProviderPlanTable({ plans }) {
  return (
    <Card className="hidden overflow-x-auto md:block" padding="none" variant="bordered">
      <table className="w-full min-w-[58rem] border-collapse text-left">
        <caption className="sr-only">Provider execution plan performance table</caption>
        <thead className="bg-[#F8F4FF] text-xs font-black uppercase tracking-[0.12em] text-[#6F657C]">
          <tr>
            <th className="px-5 py-4">Plan and challenge</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Score</th>
            <th className="px-5 py-4">Price / timeline</th>
            <th className="px-5 py-4">Submitted</th>
            <th className="px-5 py-4">Next action</th>
            <th className="px-5 py-4"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr className="border-t border-[#E9E2F3] align-top" key={plan.id}>
              <td className="max-w-xs px-5 py-5">
                <p className="font-black text-[#07030D]">{plan.title || "Execution plan"}</p>
                <p className="mt-1 text-sm text-[#6F657C]">{plan.challenge?.title || "Challenge not available"}</p>
                {plan.challenge?.category ? <p className="mt-1 text-xs font-bold text-[#7C3AED]">{plan.challenge.category}</p> : null}
              </td>
              <td className="px-5 py-5"><ExecutionPlanStatusBadge status={plan.status} /></td>
              <td className="px-5 py-5 font-black text-[#07030D]">{plan.planScore?.score ?? "Not available"}</td>
              <td className="px-5 py-5 text-sm font-bold text-[#493C5E]">
                <p>{formatPlanPrice(plan.price)}</p>
                <p className="mt-1 text-[#6F657C]">{formatPlanTimeline(plan.timeline)}</p>
              </td>
              <td className="px-5 py-5 text-sm text-[#6F657C]">{formatDate(plan.submittedAt || plan.createdAt)}</td>
              <td className="max-w-xs px-5 py-5 text-sm leading-6 text-[#6F657C]">{getProviderPlanNextAction(plan)}</td>
              <td className="px-5 py-5">
                <Button as={Link} to={ROUTES.EXECUTION_PLAN_DETAIL(plan.id)} variant="secondary">View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
