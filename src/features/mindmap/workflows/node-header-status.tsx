import { cn } from "@/utils";

import { Badge } from "@/components/ui/badge";

export const NodeHeaderStatus = ({
	status,
}: {
	status?: "idle" | "processing" | "success" | "error";
}) => {
	const statusColors = {
		idle: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
		processing: "bg-orange-500 text-white",
		success: "bg-green-500 text-white",
		error: "bg-red-500 text-white",
	};
	return (
		<Badge
			variant="secondary"
			className={cn("mr-2 font-normal", status && statusColors[status])}
		>
			{status ? status : "idle"}
		</Badge>
	);
};

NodeHeaderStatus.displayName = "NodeHeaderStatus";
