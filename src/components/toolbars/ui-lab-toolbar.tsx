interface UiLabToolbarProps {}

export const UiLabToolbar = () => {
  return (
    <div className='flex rounded-xl gap-3 p-2'>
      <div className='bg-neutral-100 items-start flex-grow flex-wrap justify-start relative flex rounded-lg p-1.5 text-sm'>
        <div className='flex-wrap flex'>
          <div className='items-center self-start justify-center pb-1 pl-3 pr-1.5 relative flex h-7 rounded-md gap-1 overflow-hidden'>
            <div className='bg-white left-0 absolute top-0 z-[-10] w-full h-full' />
            pages
            <button className='text-neutral-400 items-start cursor-pointer pt-1 w-4 h-4'>
              <svg
                className='w-4 h-4'
                fill='rgb(153, 153, 153)'
                height='16'
                viewBox='0 0 16 16'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  clipRule='evenodd'
                  d='M4.744 4.744a.833.833 0 011.179 0L8 6.821l2.077-2.077a.833.833 0 111.179 1.179L9.179 8l2.077 2.077a.833.833 0 01-1.179 1.179L8 9.179l-2.077 2.077a.833.833 0 01-1.179-1.179L6.821 8 4.744 5.923a.833.833 0 010-1.179z'
                  fill='rgb(153, 153, 153)'
                  fillRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className='items-center justify-center flex w-auto text-neutral-400'>
        <div className='items-center flex-grow justify-center flex gap-2'>
          <button className='items-center cursor-pointer justify-center flex w-7 h-7 rounded-md'>
            <svg
              className='w-5 h-5'
              fill='rgb(153, 153, 153)'
              height='20'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                clipRule='evenodd'
                d='M4.79036 1.66211C3.98495 1.66211 3.33203 2.31503 3.33203 3.12044V16.7456C3.33203 17.9208 4.65087 18.6133 5.61831 17.9461L9.88045 15.0067C9.95161 14.9576 10.0458 14.9576 10.1169 15.0067L14.3791 17.9461C15.3465 18.6133 16.6654 17.9208 16.6654 16.7456V3.12044C16.6654 2.31503 16.0124 1.66211 15.207 1.66211H4.79036ZM9.9987 4.99926C10.3439 4.99926 10.6237 5.27908 10.6237 5.62426V7.70759H12.707C13.0522 7.70759 13.332 7.98742 13.332 8.33259C13.332 8.67776 13.0522 8.95759 12.707 8.95759H10.6237V11.0409C10.6237 11.3861 10.3439 11.6659 9.9987 11.6659C9.65353 11.6659 9.3737 11.3861 9.3737 11.0409V8.95759H7.29036C6.94519 8.95759 6.66536 8.67776 6.66536 8.33259C6.66536 7.98742 6.94519 7.70759 7.29036 7.70759H9.3737V5.62426C9.3737 5.27908 9.65353 4.99926 9.9987 4.99926Z'
                fill='rgb(153, 153, 153)'
                fillRule='evenodd'
              />
            </svg>
          </button>
          <button className='items-center cursor-pointer justify-center flex w-7 h-7 rounded-md'>
            <svg
              className='w-5 h-5'
              fill='rgb(153, 153, 153)'
              height='20'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                clipRule='evenodd'
                d='M6.321 4.167a3.96 3.96 0 017.362 0h4.027a.625.625 0 110 1.25h-1.081l-.745 11.552a1.458 1.458 0 01-1.456 1.365H5.574a1.458 1.458 0 01-1.455-1.365L3.374 5.417H2.293a.625.625 0 110-1.25h4.028zm1.398 0a2.707 2.707 0 014.566 0H7.719zm1.032 4.792a.625.625 0 00-1.25 0v4.583a.625.625 0 101.25 0V8.959zm3.125-.625c.346 0 .625.28.625.625v4.583a.625.625 0 11-1.25 0V8.959c0-.346.28-.625.625-.625z'
                fill='rgb(153, 153, 153)'
                fillRule='evenodd'
              />
            </svg>
          </button>
          <button className='items-center cursor-pointer justify-center flex w-7 h-7 rounded-md'>
            <svg
              className='w-5 h-5'
              fill='rgb(153, 153, 153)'
              height='20'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M7.918 11.875a2.083 2.083 0 114.167 0 2.083 2.083 0 01-4.167 0z'
                fill='rgb(153, 153, 153)'
              />
              <path
                clipRule='evenodd'
                d='M3.958 2.5h2.709v3.542c0 .805.653 1.458 1.458 1.458h3.75c.805 0 1.458-.653 1.458-1.458V2.5h.697c.387 0 .758.154 1.031.427l2.012 2.012c.273.273.427.644.427 1.031v10.072c0 .805-.653 1.458-1.458 1.458H3.958A1.458 1.458 0 012.5 16.042V3.958c0-.805.653-1.458 1.458-1.458zM10 8.542a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666z'
                fill='rgb(153, 153, 153)'
                fillRule='evenodd'
              />
              <path
                d='M7.918 2.5h4.167v3.542a.208.208 0 01-.209.208h-3.75a.208.208 0 01-.208-.208V2.5z'
                fill='rgb(153, 153, 153)'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
