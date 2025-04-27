"use client";

/* You might notice this long className everywhere 
shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]

I usually extend my tailwind theme with custom box shadows and I recommend doing the same with a quick find and replace. :)

example tailwind.config.ts:
 
...
extend: {
      boxShadow: {
        "inner-shadow":
          "0px 1px 0px 0px hsla(0, 0%, 0%, 0.02) inset, 0px 0px 0px 1px hsla(0, 0%, 0%, 0.02) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.25)",
        "shadow-border-light":
          "0px 1px 1px 0px rgba(0, 0, 0, 0.05), 0px 1px 1px 0px rgba(255, 252, 240, 0.5) inset, 0px 0px 0px 1px hsla(0, 0%, 100%, 0.1) inset, 0px 0px 1px 0px rgba(28, 27, 26, 0.5)",

        "shadow-border-dark":
          "0px 10px 20px rgba(0, 0, 0, 0.6), 0px 6px 12px rgba(0, 0, 0, 0.5), 0px 3px 6px rgba(0, 0, 0, 0.4), 0px 1px 3px rgba(0, 0, 0, 0.3), 0px 1px 2px rgba(255, 255, 255, 0.06) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.04) inset, 0px -2px 6px rgba(0, 0, 0, 0.25) inset, 0px 1px 1px rgba(255, 255, 255, 0.02), 1px 1px 2px rgba(255, 255, 255, 0.01)",
      },
      ...
*/
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { format } from "date-fns";
import {
	AlertCircle,
	FileText,
	Hash,
	Info,
	SparklesIcon,
	Tag,
	User,
} from "lucide-react";
import type { Database } from "../lib/db/types";
import { cn } from "@/lib/utils";

type Document = Database["public"]["Tables"]["doc_processor_documents"]["Row"];
type ProcessingTask =
	Database["public"]["Tables"]["doc_processor_processing_tasks"]["Row"];
type Chunk =
	Database["public"]["Tables"]["doc_processor_document_chunks"]["Row"];
type Entity =
	Database["public"]["Tables"]["doc_processor_document_entities"]["Row"];
interface DocumentViewerProps {
	document: Document;
	tasks: ProcessingTask[];
	chunks: Chunk[];
	entities: Entity[];
	onRetry?: () => void;
}

export function DocumentViewer({
	document,
	tasks,
	chunks,
	entities,
	onRetry,
}: DocumentViewerProps) {
	return (
		<div className="space-y-6 ">
			{/* Metadata Panel */}
			<Card className="border-none shadow-none">
				<CardHeader className="px-0 pb-2">
					<CardTitle className="flex items-center gap-2 text-xs">
						<div className="rounded-lg bg-muted/5 p-1 border border-border">
							<Info className="size-3 text-primary" />
						</div>
						Document Information
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-6 px-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					<div className="space-y-1">
						<div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
							File Name
						</div>
						<div className="text-sm font-medium">{document.title}</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
							Type
						</div>
						<div className="text-sm font-medium capitalize">
							{document.file_type}
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
							Size
						</div>
						<div className="text-sm font-medium">
							{formatFileSize(document.file_size)}
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
							Upload Date
						</div>
						<div className="text-sm font-medium">
							{format(new Date(document.created_at), "PPP")}
						</div>
					</div>
					<div className="space-y-1">
						<div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
							Status
						</div>
						<StatusBadge
							className={cn(
								document.status === "processed" &&
									"bg-green-50 text-green-600 rounded-lg border border-green-700/20",
							)}
							status={document.status}
						/>
					</div>
					{document.metadata && (
						<>
							<div className="space-y-1">
								<div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
									Word Count
								</div>
								<div className="text-sm font-medium">
									{(
										document.metadata as { wordCount?: number }
									)?.wordCount?.toLocaleString()}
								</div>
							</div>
							<div className="space-y-1">
								<div className="text-xs font-light uppercase tracking-wider text-muted-foreground">
									Page Count
								</div>
								<div className="text-sm font-medium">
									{(document.metadata as { pageCount?: number })?.pageCount}
								</div>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Error Alert */}
			{document.status === "error" && document.error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Processing Failed</AlertTitle>
					<AlertDescription className="mt-2">
						<div className="font-mono text-xs">{document.error}</div>
						{onRetry && (
							<Button
								onClick={onRetry}
								variant="outline"
								size="sm"
								className="mt-4"
							>
								Retry Processing
							</Button>
						)}
					</AlertDescription>
				</Alert>
			)}

			{/* Content Tabs */}
			<Tabs
				defaultValue="analysis"
				className="space-y-6 px-4 shadow-inner rounded-t-3xl pt-4 bg-white"
			>
				<TabsList className=" grid grid-cols-4 bg-secondary shadow-inner border-b-[1px] border-b-stone-900/5 ring-[4px] ring-offset-4 ring-offset-muted/60 ring-muted/40 ">
					<TabsTrigger
						value="analysis"
						className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
					>
						<SparklesIcon className="size-3" />
						AI Analysis
					</TabsTrigger>

					<TabsTrigger
						value="chunks"
						className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
					>
						<Hash className="size-3" />
						Chunks
					</TabsTrigger>
					<TabsTrigger
						value="entities"
						className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
					>
						<Tag className="size-3" />
						Entities
					</TabsTrigger>
					<TabsTrigger
						value="original"
						className="gap-1 text-sm data-[state=active]:shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
					>
						<FileText className="size-3" />
						Original Text
					</TabsTrigger>
				</TabsList>

				{/* AI Analysis */}
				<TabsContent value="analysis" className="mt-0">
					<Card className="border-none shadow-none">
						<CardContent className="space-y-8 px-0">
							{document.analysis ? (
								<>
									<div className="space-y-3">
										<h3 className="text-xs font-semibold flex items-center gap-2">
											<div className="rounded-lg bg-muted/5 p-1 border border-border">
												<FileText className="size-3 text-primary" />
											</div>
											Summary
										</h3>
										<p className="text-sm leading-relaxed text-muted-foreground">
											{(document.analysis as { summary?: string })?.summary}
										</p>
									</div>

									<div className="space-y-3">
										<h3 className="text-xs font-semibold flex items-center gap-2">
											<div className="rounded-lg bg-muted/5 p-1 border border-border">
												<Tag className="size-3 text-primary" />
											</div>
											Keywords
										</h3>
										<div className="flex flex-wrap gap-2">
											{(
												document.analysis as { keywords?: string[] }
											)?.keywords?.map((keyword) => (
												<div
													key={keyword}
													className="px-3 text-xs rounded-3xl py-1 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
												>
													{keyword}
												</div>
											))}
										</div>
									</div>
								</>
							) : (
								<div className="text-center py-8 text-muted-foreground">
									No analysis available
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Chunks */}
				<TabsContent value="chunks" className="mt-0">
					<Card className="border-none shadow-none">
						<CardContent className="px-0">
							<div className="space-y-6">
								{/* Summary Stats */}
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="flex items-center text-xs tracking-tighter font-mono font-light py-1 px-2 border border-border rounded-full">
											<Hash className="h-3 w-3 mr-1" />
											{chunks.reduce(
												(acc, chunk) => acc + chunk.token_count,
												0,
											)}{" "}
											Total Tokens
										</div>
										<div className="flex items-center text-xs tracking-tighter font-mono font-light py-1 px-2 border border-border rounded-full">
											<div className="h-3 w-3 mr-1 rounded-full bg-primary/20" />
											{chunks.length} Chunks
										</div>
									</div>
								</div>

								{/* Chunks List */}
								<div className="  p-4">
									<div className="grid gap-4">
										{chunks.map((chunk) => (
											<div key={chunk.id} className="group relative space-y-2">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2 text-sm">
														<div className="text-xs tracking-tighter font-light  px-2">
															Chunk {chunk.chunk_index + 1}
														</div>
														{"heading" in chunk &&
															typeof chunk.heading === "string" && (
																<Badge variant="secondary" className="px-2">
																	{chunk.heading}
																</Badge>
															)}
													</div>
													<div className="flex items-center gap-2 text-xs text-muted-foreground">
														<div className="text-xs tracking-tighter font-mono font-light  px-2">
															{chunk.token_count} Tokens
														</div>
														{"page_number" in chunk &&
															typeof chunk.page_number === "number" && (
																<Badge variant="outline" className="px-2">
																	Page {chunk.page_number}
																</Badge>
															)}
													</div>
												</div>

												<div className="rounded-lg xl:rounded-2xl border bg-card p-3">
													<div className="text-sm text-muted-foreground">
														{chunk.content}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>

								{chunks.length === 0 && (
									<div className="text-center py-8 text-muted-foreground">
										No chunks available
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Extracted Entities */}
				<TabsContent value="entities" className="mt-0">
					<Card className="border-none shadow-none">
						<CardContent className="px-1">
							<div className="space-y-3">
								<h3 className="text-xs font-semibold flex items-center gap-2">
									<div className="rounded-lg bg-muted/5 p-1 border border-border">
										<User className="size-3 text-primary" />
									</div>
									Extracted Entities
								</h3>
								{/* <ScrollArea className="h-[40vh]"> */}
								{/* <div className="grid gap-4  bg-muted/50 rounded-3xl p-3 py-5 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"> */}
								<div className="grid gap-4 lg:grid-cols-2 lg:gap-8 ">
									{/* Group entities by type */}
									{Object.entries(
										entities.reduce(
											(acc, entity) => {
												if (!acc[entity.entity_type])
													acc[entity.entity_type] = [];
												acc[entity.entity_type].push(entity);
												return acc;
											},
											{} as Record<string, Entity[]>,
										),
									)
										.sort(([a], [b]) => a.localeCompare(b))
										.map(([type, entities]) => (
											<div key={type} className="space-y-4">
												<div className="flex items-center  gap-2 px-2 pb-1 ">
													<div className="inline-flex items-center pl-2 pr-1 py-1 bg-muted/80 gap-1 rounded-sm shadow-[0px_1px_0px_0px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_rgba(255,_255,_255,_0.25)]">
														<h4 className="text-xs  font-base tracking-wider">
															{type}
														</h4>
														<Badge
															variant="outline"
															className="text-xs bg-muted border-none shadow-[0px_1px_0px_0px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_hsla(0,_0%,_0%,_0.02)_inset,_0px_0px_0px_1px_rgba(255,_255,_255,_0.25)]"
														>
															{entities.length}
														</Badge>
													</div>
												</div>
												<div className="flex flex-wrap gap-3 px-2">
													{entities.map((entity) => (
														<div
															key={entity.id}
															className="flex items-center justify-center rounded-full max-w-xs  bg-card px-2 py-1.5 shadow-[0px_1px_1px_0px_rgba(0,_0,_0,_0.05),_0px_1px_1px_0px_rgba(255,_252,_240,_0.5)_inset,_0px_0px_0px_1px_hsla(0,_0%,_100%,_0.1)_inset,_0px_0px_1px_0px_rgba(28,_27,_26,_0.5)]"
														>
															<span className="text-sm text-muted-foreground text-center">
																{entity.entity_text}
															</span>
														</div>
													))}
												</div>
											</div>
										))}
								</div>
								{/* </ScrollArea> */}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
				{/* Original Text */}
				<TabsContent value="original" className="mt-0">
					<Card className="border-none shadow-none">
						<CardContent className="p-0">
							<div className=" w-full rounded-2xl border bg-muted/50">
								<div className="p-4">
									<pre className="text-xs whitespace-pre-wrap font-mono">
										{document.extracted_text}
									</pre>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function StatusBadge({
	status,
	className,
}: { status: Document["status"]; className?: string }) {
	const variants = {
		pending: "default",
		processing: "secondary",
		completed: "outline",
		processed: "outline",
		error: "destructive",
	} as const;

	return (
		<Badge variant={variants[status]} className={cn("capitalize", className)}>
			{status}
		</Badge>
	);
}

function formatFileSize(bytes: number) {
	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(1)} ${units[unitIndex]}`;
}
