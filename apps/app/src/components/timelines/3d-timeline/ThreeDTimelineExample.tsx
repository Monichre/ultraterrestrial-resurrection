// ./src/components/3d-timeline/ThreeDTimelineExample.tsx
import React from 'react';
import { ThreeDTimeline } from './ThreeDTimeline';

const slides = [
  {
    id: '1',
    image: '/path/to/image1.jpg',
    title: 'Project One'
  },
  {
    id: '2',
    image: '/path/to/image2.jpg',
    title: 'Project Two'
  },
  {
    id: '3',
    image: '/path/to/image3.jpg',
    title: 'Project Three'
  },
  {
    id: '4',
    image: '/path/to/image4.jpg',
    title: 'Project Four'
  },
  {
    id: '5',
    image: '/path/to/image5.jpg',
    title: 'Project Five'
  },
  {
    id: '6',
    image: '/path/to/image6.jpg',
    title: 'Project Six'
  },
];

export const ThreeDTimelineExample: React.FC = () => {
  return (
    <ThreeDTimeline
      slides={slides}
      className="bg-black"
      showNavigation={true}
    />
  );
};
