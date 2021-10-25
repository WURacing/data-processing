/**
 * @param {string} date
 * @returns {Promise<{
    date: string,
    location?: string,
    timezone: string,
    start: string,
    end: string,
    intervals: {
      id: number,
      type?: string,
      description?: string,
      start: string,
      end: string
    }[],
    variables: {
      id: number,
      name: string,
      description?: string,
      units?: string
    }[]
  }>}
 */
export async function getMetadata(date) {
  const url = `https://data.washuracing.com/api/v2/testing/${date}`;
  return (await fetch(url)).json();
}

/**
 * @param {string} date
 * @param {string} startTime
 * @param {string} endTime
 * @param {'1ms' | '10ms' | '100ms' | '1s' | '10s' | '1m'} resolution
 * @returns {Promise<any[]>}
 */
export async function getData(date, startTime, endTime, resolution) {
  const url = `https://data.washuracing.com/api/v2/testing/${date}/${startTime}/${endTime}/data?resolution=${resolution}`;
  const response = await fetch(url);
  return response.json();
}
