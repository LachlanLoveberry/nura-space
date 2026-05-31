export const queryKeys = {
  auth: {
    currentUser: ['auth', 'current-user'] as const,
  },
  cities: {
    search: (query: string) => ['cities', 'search', query] as const,
  },
  weather: {
    current: (latitude: number, longitude: number) =>
      ['weather', latitude, longitude] as const,
  },
}
