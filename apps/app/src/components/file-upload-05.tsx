import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function FileUpload05() {
  return (
    <div className="sm:mx-auto sm:max-w-lg flex items-center justify-center p-10 w-full max-w-lg">
      <form>
        <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50">File Upload</h3>
        <div className="mt-4 flex justify-center space-x-4 rounded-md border border-gray-200 border-dashed px-6 py-10 dark:border-gray-800">
          <div className="sm:flex sm:items-center sm:gap-x-3">
            <Upload
              className="mx-auto h-8 w-8 text-gray-500 sm:mx-0 sm:h-6 sm:w-6 dark:text-gray-400"
              aria-hidden={true}
            />
            <div className="mt-4 flex text-sm leading-6 text-gray-950 sm:mt-0 dark:text-gray-50">
              <p>Drag and drop or</p>
              <Label
                htmlFor="file-upload-4"
                className="relative cursor-pointer rounded-sm pl-1 font-medium text-gray-900 hover:underline hover:underline-offset-4 dark:text-gray-50"
              >
                <span>choose file</span>
                <input
                  id="file-upload-4"
                  name="file-upload-4"
                  type="file"
                  className="sr-only"
                />
              </Label>
              <p className="pl-1">to upload</p>
            </div>
          </div>
        </div>
        <p className="mt-2 flex items-center justify-between text-xs leading-5 text-gray-500 dark:text-gray-400">
          Recommended max. size: 10 MB, Accepted file types: XLSX, XLS, CSV.
        </p>
        <div className="relative mt-8 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <div className="absolute right-1 top-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-sm p-2 text-gray-500 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50"
              aria-label="Remove"
            >
              <Cross2Icon className="size-4 shrink-0" aria-hidden={true} />
            </Button>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white shadow-sm ring-1 ring-inset ring-gray-200 dark:bg-gray-950 dark:ring-gray-800">
              <FileSpreadsheet
                className="size-5 text-gray-950 dark:text-gray-50"
                aria-hidden={true}
              />
            </span>
            <div className="w-full">
              <p className="text-xs font-medium text-gray-950 dark:text-gray-50">
                Revenue_Q1_2024.xlsx
              </p>
              <p className="mt-0.5 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>3.1 MB</span>
                <span>Completed</span>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            className="whitespace-nowrap rounded-sm border border-gray-200 px-4 py-2 text-sm font-medium text-gray-950 shadow-sm hover:bg-gray-100 hover:text-gray-950 dark:border-gray-800 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="whitespace-nowrap rounded-sm bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow-sm hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
          >
            Upload
          </Button>
        </div>
      </form>
    </div>
  );
}
