import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useSystemState() {
  return useQuery({
    queryKey: ['system-state'],
    queryFn: api.systemState.get,
    refetchInterval: 30_000,         // refresh every 30s
    staleTime: 20_000,               // consider fresh for 20s
    retry: 2,
  })
}
