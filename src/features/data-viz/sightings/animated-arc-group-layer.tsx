// import { useEffect, useState } from 'react';
// import { CompositeLayer, UpdateParameters } from '@deck.gl/core';

// const MAX_ARCS_PER_LAYER = 2500;

// type ArcsGroup<DataT> = {
//   startTime: number;
//   endTime: number;
//   data: DataT[];
// };

// const AnimatedArcGroupLayer = <
//   DataT = any,
//   ExtraProps = {}
// >(
//   props: ExtraProps & Required<AnimatedArcLayerProps<DataT>>
// ) => {
//   const [groups, setGroups] = useState<ArcsGroup<DataT>[]>([]);

//   useEffect(() => {
//     // Sort and group data
//     const { data, getSourceTimestamp, getTargetTimestamp } = props;
//     const sortedGroups = sortAndGroup(data, getSourceTimestamp, getTargetTimestamp);
//     setGroups(sortedGroups);
//   }, [props, props.data, props.getSourceTimestamp, props.getTargetTimestamp]);

//   const renderLayers = () => {
//     const { timeRange } = props;

//     return groups.map((group, index) => (
//       new AnimatedArcLayer(
//         props,
//         {
//           id: index.toString(),
//           data: group.data,
//           visible: group.startTime < timeRange[1] && group.endTime > timeRange[0],
//           timeRange,
//         }
//       )
//     ));
//   };

//   return (
//     <CompositeLayer {...props} layerName="AnimatedArcGroupLayer" renderLayers={renderLayers} />
//   );
// };

// function sortAndGroup<DataT>(
//   data: DataT[],
//   getStartTime: (d: DataT) => number,
//   getEndTime: (d: DataT) => number,
//   groupSize: number = MAX_ARCS_PER_LAYER
// ): ArcsGroup<DataT>[] {
//   const groups: ArcsGroup<DataT>[] = [];
//   let group: ArcsGroup<DataT>;

//   data.sort((d1, d2) => getStartTime(d1) - getStartTime(d2));

//   for (const d of data) {
//     if (!group || group.data.length >= groupSize) {
//       group = {
//         startTime: Infinity,
//         endTime: -Infinity,
//         data: [],
//       };
//       groups.push(group);
//     }
//     group.data.push(d);
//     group.startTime = Math.min(group.startTime, getStartTime(d));
//     group.endTime = Math.max(group.endTime, getEndTime(d));
//   }
//   return groups;
// }

// export default AnimatedArcGroupLayer;
