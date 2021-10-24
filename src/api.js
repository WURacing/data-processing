// export interface DayMetadata {
//     date: string,
//     location?: string,
//     timezone: string,
//     start: string,
//     end: string,
//     intervals: {
//       id: number,
//       type?: string,
//       description?: string,
//       start: string,
//       end: string
//     }[],
//     variables: {
//       id: number,
//       name: string,
//       description?: string,
//       units?: string
//     }[]
//   }

export async function getMetadata(date) {
  // `https://data.washuracing.com/api/v2/testing/${date}`
  return (await fetch('/metadata.json')).json();
}

// type DataResolution = '1ms' | '10ms' | '100ms' | '1s' | '10s' | '1m';
export async function getData(date, startTime, endTime, resolution) {
  // `https://data.washuracing.com/api/v2/testing/${date}/${startTime}/${endTime}/data?resolution=${resolution}`
  const response = await fetch('/data.json');
  return response.json();
}
