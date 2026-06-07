import { Card, CardContent } from "./ui/Card.jsx";

export function ErrorState({ message, title = "Unable to load data", ...props }) {
  return (
    <Card
      className="text-left"
      variant="bordered"
      {...props}
    >
      <CardContent>
        <p className="eyebrow">Error</p>
        <h3 className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#07030D]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#5B21B6]">
          {message ?? "Please try again shortly."}
        </p>
      </CardContent>
    </Card>
  );
}
