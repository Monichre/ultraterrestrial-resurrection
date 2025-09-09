import { ParallelProcessingDemo } from "../components/parallel-processing-demo";

export const maxDuration = 60;

export default function Page() {
  return (
    <div className="mx-auto bg-gray-100 min-h-full md:min-h-screen w-screen dark:bg-gray-800">
      <ParallelProcessingDemo />
    </div>
  );
}
