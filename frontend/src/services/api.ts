const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Lỗi kết nối máy chủ (${res.status})`);
  }
  return data as T;
}

export const api = {
  getHealth: () => request<any>('/health'),
  getRoom: (roomCode = 'KB2026') => request<any>(`/rooms/${roomCode}`),
  updateRoomConfig: (roomCode: string, payload: any) =>
    request<any>(`/rooms/${roomCode}/config`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  startGame: (roomCode = 'KB2026', immediate = false) =>
    request<any>(`/rooms/${roomCode}/start`, {
      method: 'POST',
      body: JSON.stringify({ immediate }),
    }),
  nextStep: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/next`, { method: 'POST' }),
  revealQuestion: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/reveal`, { method: 'POST' }),
  showLeaderboard: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/leaderboard`, { method: 'POST' }),
  pauseGame: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/pause`, { method: 'POST' }),
  resumeGame: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/resume`, { method: 'POST' }),
  finishGame: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/finish`, { method: 'POST' }),
  resetGame: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/reset`, { method: 'POST' }),

  // TikTok LIVE Connector
  getTikTokStatus: (roomCode = 'KB2026') =>
    request<any>(`/tiktok/${roomCode}/status`),
  connectTikTok: (roomCode: string, username: string) =>
    request<any>(`/tiktok/${roomCode}/connect`, {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),
  disconnectTikTok: (roomCode = 'KB2026') =>
    request<any>(`/tiktok/${roomCode}/disconnect`, { method: 'POST' }),

  // Simulator
  simulateEvent: (roomCode: string, payload: any) =>
    request<any>(`/simulator/${roomCode}/event`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  simulateCrowd: (roomCode = 'KB2026', count = 8) =>
    request<any>(`/simulator/${roomCode}/crowd`, {
      method: 'POST',
      body: JSON.stringify({ count }),
    }),
  toggleAutoCrowd: (
    roomCode = 'KB2026',
    enabled?: boolean,
    minPlayers = 50,
    maxPlayers = 100
  ) =>
    request<any>(`/simulator/${roomCode}/auto-crowd`, {
      method: 'POST',
      body: JSON.stringify({ enabled, minPlayers, maxPlayers }),
    }),

  // Question Bank & Admin
  getCategories: () => request<any[]>('/categories'),
  createCategory: (payload: any) =>
    request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getQuestions: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>(`/questions${qs}`);
  },
  createQuestion: (payload: any) =>
    request<any>('/questions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateQuestion: (id: string, payload: any) =>
    request<any>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  reviewQuestion: (id: string, status: string, notes?: string) =>
    request<any>(`/questions/${id}/review`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    }),
  importQuestions: (questions: any[], targetStatus = 'PENDING') =>
    request<any>('/questions/import', {
      method: 'POST',
      body: JSON.stringify({ questions, targetStatus }),
    }),
  generateRandomQuestions: (count = 10, targetStatus = 'PUBLISHED') =>
    request<any>('/questions/random', {
      method: 'POST',
      body: JSON.stringify({ count, targetStatus }),
    }),
  getReviews: () => request<any[]>('/reviews'),
  getQuizSets: () => request<any[]>('/quiz-sets'),
  getGifts: () => request<any[]>('/gifts'),
  upsertGift: (payload: any) =>
    request<any>('/gifts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

