"use client";

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { routingSchema } from "../lib/schema";
import { routing } from "../lib/actions";
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
    title: "Customer Support Request",
    content:
      "I'm having trouble logging into my account. I've tried resetting password multiple times but not receiving the reset email. I need to access account urgently for an important project deadline.",
  },
  {
    title: "Sales Inquiry",
    content:
      "I'm interested in your enterprise plan for our company of 200 employees. We're looking a solution that can integrate with existing CRM and provide advanced analytics. What pricing options do you have available?",
  },
  {
    title: "Technical Question",
    content:
      "I'm implementing your API in our Node.js application and getting a 429 rate limit error. I've checked request frequency it's well below the documented limits. Can you help me troubleshoot this issue?",
  },
  {
    title: "General Inquiry",
    content:
      "I'm a startup founder looking for comprehensive solution to manage customer relationships, track sales, and analyze performance. What would you recommend company just getting started?",
  },
];

// Helper function to convert color names to CSS color values
const getColorValue = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    green: "#10b981",
    purple: "#8b5cf6",
    red: "#ef4444",
    yellow: "#f59e0b",
    orange: "#f97316",
  };
  return colorMap[color] || "#6b7280";
};

export function RoutingDemo() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<z.infer<typeof routingSchema> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await routing(content.trim());

      if (response.success) {
        setResult(response.data);
        setContent(""); // Clear content after successful generation
      } else {
        setError(response.error || "An error occurred during routing");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during routing",
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
          <RoutingIcon className="w-6 h-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            <span className="text-gray-500 dark:text-gray-400">AI-Agents</span> routing
          </h2>
        </div>

        <p className="text-gray-500 mb-4 max-w-2xl tracking-tight mt-4 dark:text-gray-400">
          Intelligent routing with AI agents that first classify requests and
          then route to the most appropriate specialized handler{""}
          <span className="text-gray-900 bg-gray-100 border border-gray-200 border-gray-900/10 rounded-md px-1 py-0.5 dark:text-gray-50 dark:bg-gray-800 dark:border-gray-800 dark:border-gray-50/10">
            routing
          </span>{""}
          using conditional model selection based on complexity for optimal
          performance.
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
                      Routing request to specialized agents...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This may take a few moments while we analyze your request
                    </p>
                  </div>
                </div>
              )}

              {/* Results Display */}
              {!isLoading && result?.results && (
                <div className="space-y-6">
                  {/* Classification Results */}
                  {result.classification && (
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="text-lg">🎯</span>
                          Request Classification
                        </CardTitle>
                        <CardDescription>
                          Intelligent routing analysis and decision
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Type
                            </div>
                            <div className="text-lg font-semibold capitalize">
                              {result.classification.type.replace("_", "")}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Complexity
                            </div>
                            <div className="text-lg font-semibold capitalize">
                              {result.classification.complexity}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Confidence
                            </div>
                            <div className="text-lg font-semibold">
                              {Math.round(
                                result.classification.confidence * 100,
                              )}
                              %
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <div className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">
                            Reasoning
                          </div>
                          <div className="text-sm">
                            {result.classification.reasoning}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Analysis Results */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {result.results.map((item: any, index: number) => (
                      <Card
                        key={index}
                        className="border-l-4"
                        style={{ borderLeftColor: getColorValue(item.color) }}
                      >
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            {item.task}
                            {item.model && (
                              <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">
                                {item.model}
                              </span>
                            )}
                          </CardTitle>
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
                        <CardTitle>Routing Metadata</CardTitle>
                        <CardDescription>
                          Processing details and metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                              {result.metadata.workers}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Agents
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
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                              {result.metadata.perspectives?.length || 0}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Perspectives
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                              🎯
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {result.metadata.routingStrategy?.replace(
                                "_",
                                "",
                              ) || "Standard"}
                            </div>
                          </div>
                        </div>
                        {result.metadata.perspectives &&
                          result.metadata.perspectives.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="text-sm text-gray-500 mb-2 dark:text-gray-400">
                                Agent Perspectives:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {result.metadata.perspectives.map(
                                  (perspective: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium dark:bg-gray-800"
                                    >
                                      {perspective}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Initial State - Show when not loading and no data */}
              {!isLoading && !result && !error && (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-800">
                    <RoutingIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-50">
                      Ready for Request Routing
                    </p>
                    <p className="text-sm text-gray-500 max-w-md dark:text-gray-400">
                      Enter a request below to get intelligent routing analysis
                      from Customer Support, Sales, and Technical perspectives
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
              placeholder="Enter a customer request, sales inquiry, or technical question to route appropriate specialists..."
              onChange={(e) => setContent(e.currentTarget.value)}
              className="pr-12"
            />
            <PromptInputSubmit
              status={isLoading ? "submitted" : "ready"}
              disabled={!content.trim() || isLoading}
              className="absolute bottom-1 right-1"
              title={isLoading ? "Routing..." : "Submit"}
            />
          </PromptInput>
        </div>
      </div>
    </div>
  );
}

const RoutingIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <circle cx="12" cy="12" r="2" />
  </svg>
);
