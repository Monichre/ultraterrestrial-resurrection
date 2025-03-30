"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import SightingsAIInsights from '@/components/sightings/sightings-ai-insights';
import { AlertCircle, Sparkles } from 'lucide-react';
import { SightingsAnalysisResult } from '@/services/sightings/actions/sightings';

interface SightingsAnalyticsProps {
  sightingsData: any[];
  analyzeSightingsData: (sightingsData: any[]) => Promise<{
    analysis: SightingsAnalysisResult;
    streamingValue: any;
  }>;
}

const SightingsAnalytics: React.FC<SightingsAnalyticsProps> = ({
  sightingsData,
  analyzeSightingsData
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SightingsAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAnalyzeClick = async () => {
    if (!sightingsData || sightingsData.length === 0) {
      setAnalysisError("No sightings data available for analysis");
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError(null);
      // Open the dialog immediately to show loading state
      setDialogOpen(true);

      const { analysis } = await analyzeSightingsData(sightingsData);
      
      // Update the state with the analysis results
      setAnalysisResult(analysis);
    } catch (error) {
      console.error("Error analyzing sightings:", error);
      setAnalysisError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="rounded-full h-14 w-14 bg-black/30 border-[#78efff]/30 backdrop-blur-sm hover:bg-black/40 hover:border-[#78efff]/50"
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
          >
            <Sparkles className="h-5 w-5 text-[#78efff]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-black/80 border-[#78efff]/20 backdrop-blur-md text-white">
          <DialogHeader>
            <DialogTitle className="text-[#78efff] flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> AI Sightings Analysis
            </DialogTitle>
          </DialogHeader>
          
          {/* Card to display prompt for analysis if no analysis has been run yet and we're not loading */}
          {!isAnalyzing && !analysisResult && !analysisError && (
            <Card className="bg-black/40 border-[#78efff]/10">
              <CardContent className="pt-6 text-center">
                <p className="mb-4">Analyzing {sightingsData.length} UFO sightings to reveal patterns and insights</p>
                <Button onClick={handleAnalyzeClick} className="bg-[#78efff]/20 hover:bg-[#78efff]/30 text-[#78efff]">
                  Start Analysis
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Display error state */}
          {analysisError && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-6 flex gap-4 items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-400">Analysis Error</h3>
                <p className="text-red-300/80 text-sm mt-1">{analysisError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 bg-red-900/30 border-red-800/50 hover:bg-red-900/50 text-red-300"
                  onClick={handleAnalyzeClick}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {/* Display AI insights component */}
          <SightingsAIInsights 
            data={analysisResult || undefined}
            isLoading={isAnalyzing}
            error={analysisError || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SightingsAnalytics;

