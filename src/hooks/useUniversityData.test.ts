import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

const hoisted = vi.hoisted(() => {
  const queryQueue: Array<any> = []

  const removeChannelMock = vi.fn()
  const channelOnMock = vi.fn().mockReturnThis()
  const channelSubscribeMock = vi.fn(() => ({ unsubscribe: vi.fn() }))
  const channelMock = {
    on: channelOnMock,
    subscribe: channelSubscribeMock,
  }

  function buildQueryBuilder() {
    const builder: any = {
      select: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      or: vi.fn(() => builder),
      in: vi.fn(() => builder),
      not: vi.fn(() => builder),
      limit: vi.fn(() => builder),
      order: vi.fn(() => builder),
      then: (resolve: (value: any) => void) => {
        const next = queryQueue.shift() ?? { data: [], error: null }
        resolve(next)
        return Promise.resolve(next)
      },
    }
    return builder
  }

  const supabaseMock = {
    from: vi.fn(() => buildQueryBuilder()),
    channel: vi.fn(() => channelMock),
    removeChannel: removeChannelMock,
  }

  return {
    queryQueue,
    removeChannelMock,
    supabaseMock,
  }
})

vi.mock('@/lib/supabase', () => ({
  supabase: hoisted.supabaseMock,
}))

import { useUniversityStats, useUniversityStudents } from './useUniversityData'

describe('useUniversityData hooks', () => {
  beforeEach(() => {
    hoisted.queryQueue.length = 0
    vi.clearAllMocks()
  })

  it('useUniversityStudents calculates placements and earnings from accepted applications', async () => {
    hoisted.queryQueue.push({
      data: [{ id: 's1', full_name: 'Alice', created_at: '2026-03-01T00:00:00Z' }],
      error: null,
    })
    hoisted.queryQueue.push({
      data: [
        { id: 'a1', project_id: 'p1', status: 'accepted' },
        { id: 'a2', project_id: 'p2', status: 'pending' },
        { id: 'a3', project_id: 'p3', status: 'accepted' },
      ],
      error: null,
    })
    hoisted.queryQueue.push({ count: 2, error: null })
    hoisted.queryQueue.push({
      data: [{ budget: '150' }, { budget: '350' }],
      error: null,
    })

    const { result } = renderHook(() => useUniversityStudents('u1', null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.students).toHaveLength(1)
    expect(result.current.students[0]).toMatchObject({
      id: 's1',
      full_name: 'Alice',
      applications_count: 3,
      credentials_earned: 2,
      active_placements: 2,
      total_earnings: 500,
    })
  })

  it('useUniversityStats calculates aggregate stats including competency average', async () => {
    hoisted.queryQueue.push({
      data: [{ id: 's1' }, { id: 's2' }],
      error: null,
    })
    hoisted.queryQueue.push({
      data: [{ rating: 4 }, { rating: 5 }, { rating: 3 }],
      error: null,
    })
    hoisted.queryQueue.push({
      data: [{ project_id: 'p1' }, { project_id: 'p2' }],
      error: null,
    })
    hoisted.queryQueue.push({
      data: [{ budget: '200' }, { budget: '300' }],
      error: null,
    })

    const { result } = renderHook(() => useUniversityStats('u1', null))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.stats).toMatchObject({
      totalStudents: 2,
      activePlacements: 2,
      totalEarnings: 500,
    })
    expect(result.current.stats.averageCompetency).toBeCloseTo(4, 5)
  })
})
