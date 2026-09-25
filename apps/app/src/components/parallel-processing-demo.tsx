"use client";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { parallelProcessingSchema } from "../lib/schema";
import { parallelProcessing } from "../lib/actions";
import { useState } from "react";
import { z } from "zod";
import { Loader } from "@/components/ai-elements/loader";
import { Response } from "@/components/ai-elements/response";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Button } from "@/components/ui/button";
import { SVGProps } from "react";

const examples = [
  {
    title: "AI Chat Assistant",
    content:
      "A conversational AI assistant that helps users with customer support, product recommendations, and general inquiries. The can understand context, maintain conversation history, escalate complex issues to human agents when needed.",
  },
  {
    title: "Real-time Collaboration",
    content:
      "A collaborative workspace feature that allows multiple users to edit documents, share screens, and communicate in real-time. Includes version control, conflict resolution, presence indicators showing who's currently active.",
  },
  {
    title: "Mobile App Integration",
    content:
      "A feature that syncs the web application with mobile devices, allowing users to access their data offline, receive push notifications, and seamlessly switch between platforms while maintaining workflow.",
  },
  {
    title: "Automated Workflow Builder",
    content:
      "A visual workflow automation tool that lets users create custom business processes by dragging and dropping actions, setting up triggers, defining conditions. Includes templates for common workflows integration with external services.",
  },
];

export function ParallelProcessingDemo() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<z.infer<
    typeof parallelProcessingSchema
  > | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await parallelProcessing(content.trim());

      if (response.success) {
        setResult(response.data);
        setContent(""); // Clear content after successful generation
      } else {
        setError(response.error || "An error occurred during processing");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during processing",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = (example: (typeof examples)[0]) => {
    setContent(example.content);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:pt-12 relative size-full h-[850px]">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2">
          <ParallelProcessingIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            <span className="text-gray-500 dark:text-gray-400">AI-Agents</span>{""}
            parallel-processing
          </h2>
        </div>

        <p className="text-gray-500 mb-4 max-w-2xl tracking-tight mt-4 dark:text-gray-400">
          Parallel processing with AI agents for business feature analysis{""}
          <span className="text-gray-900 bg-gray-100 border border-gray-200 border-gray-900/10 rounded-md px-1 py-0.5 dark:text-gray-50 dark:bg-gray-800 dark:border-gray-800 dark:border-gray-50/10">
            parallel-processing
          </span>{""}
          support concurrent analysis from Marketing, Product, and Technical
          perspectives.
        </p>

        <div className="flex flex-col h-full">
          <Conversation className="relative w-full">
            <ConversationContent className="sm:h-[550px]">
              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                  <Loader />
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-50">
                      Analyzing feature from multiple perspectives...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This may take a few moments while we process your request
                    </p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {!isLoading && result?.results && (
                <div className="space-y-6">
                  {/* Analysis Results */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {result.results.map((item: any, index: number) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-sm">{item.task}</CardTitle>
                          <CardDescription>
                            {item.task} perspective analysis
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-sm max-w-none">
                            <Response>{item.result}</Response>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Metadata */}
                  {result.metadata && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Analysis Metadata</CardTitle>
                        <CardDescription>
                          Processing details and metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                              {result.metadata.workers}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Workers
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                              {result.metadata.inputLength}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Input Length
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                              {result.usage?.totalTokens || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Total Tokens
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Initial State - Show when not loading and no data */}
              {!isLoading && !result && !error && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                    <ParallelProcessingIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-50">
                      Ready for Feature Analysis
                    </p>
                    <p className="text-sm text-gray-500 max-w-md dark:text-gray-400">
                      Enter a feature description below to get parallel analysis
                      from Marketing, Product, and Technical perspectives
                    </p>
                  </div>

                  {/* Example buttons */}
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {examples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example)}
                        className="text-xs whitespace-nowrap rounded-full cursor-pointer"
                      >
                        {example.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4 text-center">
                  <div className="mt-4 p-4 bg-red-500/10 border border-gray-200 border-red-500/20 rounded-lg dark:bg-red-900/10 dark:border-gray-800 dark:border-red-900/20">
                    <div className="flex items-center gap-2 text-red-500 dark:text-red-900">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  </div>
                </div>
              )}
            </ConversationContent>
          </Conversation>

          <PromptInput onSubmit={handleSubmit} className="mt-4 w-full relative">
            <PromptInputTextarea
              value={content}
              placeholder="Describe a feature or product idea to analyze from Marketing, Product, and Technical perspectives..."
              onChange={(e) => setContent(e.currentTarget.value)}
              className="pr-12"
            />
            <PromptInputSubmit
              status={isLoading ? "submitted" : "ready"}
              disabled={!content.trim() || isLoading}
              className="absolute bottom-1 right-1"
              title={isLoading ? "Analyzing..." : "Submit"}
            />
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

const ParallelProcessingIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 24"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 12a9 9 0 1 9-9 9.75 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 1-9 9.75 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);
