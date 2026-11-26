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
  resetQuestionHistory: (roomCode = 'KB2026') =>
    request<any>(`/rooms/${roomCode}/reset-question-history`, { method: 'POST' }),

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

  // ===== Game: Kéo Co Tri Thức =====
  tugState: (roomCode = 'KB2026') => request<any>(`/tug/${roomCode}/state`),
  tugConfig: (roomCode: string, payload: any) =>
    request<any>(`/tug/${roomCode}/config`, { method: 'PUT', body: JSON.stringify(payload) }),
  tugLobby: (roomCode = 'KB2026') => request<any>(`/tug/${roomCode}/lobby`, { method: 'POST' }),
  tugStart: (roomCode = 'KB2026') => request<any>(`/tug/${roomCode}/start`, { method: 'POST' }),
  tugNext: (roomCode = 'KB2026') => request<any>(`/tug/${roomCode}/next`, { method: 'POST' }),
  tugFinish: (roomCode = 'KB2026') => request<any>(`/tug/${roomCode}/finish`, { method: 'POST' }),
  tugStop: (roomCode = 'KB2026') => request<any>(`/tug/${roomCode}/stop`, { method: 'POST' }),
  tugSimulate: (roomCode: string, payload: { kind: string; coins?: number; team?: string; count?: number }) =>
    request<any>(`/tug/${roomCode}/simulate`, { method: 'POST', body: JSON.stringify(payload) }),

  // ===== Game: Đuổi Hình Bắt Chữ =====
  catchwordState: (roomCode = 'KB2026', withSecret = false) =>
    request<any>(`/catchword/${roomCode}/state${withSecret ? '?secret=1' : ''}`),
  catchwordConfig: (roomCode: string, payload: any) =>
    request<any>(`/catchword/${roomCode}/config`, { method: 'PUT', body: JSON.stringify(payload) }),
  catchwordAddPuzzle: (payload: any) =>
    request<any>('/catchword/puzzles', { method: 'POST', body: JSON.stringify(payload) }),
  catchwordLobby: (roomCode = 'KB2026') => request<any>(`/catchword/${roomCode}/lobby`, { method: 'POST' }),
  catchwordStart: (roomCode = 'KB2026') => request<any>(`/catchword/${roomCode}/start`, { method: 'POST' }),
  catchwordNext: (roomCode = 'KB2026') => request<any>(`/catchword/${roomCode}/next`, { method: 'POST' }),
  catchwordRevealLetter: (roomCode = 'KB2026', count = 1) =>
    request<any>(`/catchword/${roomCode}/reveal-letter`, {
      method: 'POST',
      body: JSON.stringify({ count }),
    }),
  catchwordUnlockHint: (roomCode = 'KB2026') =>
    request<any>(`/catchword/${roomCode}/unlock-hint`, { method: 'POST' }),
  catchwordFinish: (roomCode = 'KB2026') => request<any>(`/catchword/${roomCode}/finish`, { method: 'POST' }),
  catchwordStop: (roomCode = 'KB2026') => request<any>(`/catchword/${roomCode}/stop`, { method: 'POST' }),
  catchwordSimulate: (roomCode: string, payload: { kind: string; coins?: number; count?: number }) =>
    request<any>(`/catchword/${roomCode}/simulate`, { method: 'POST', body: JSON.stringify(payload) }),

  // ===== AI Generation Engine =====
  getAiStatus: () => request<any>('/ai/status'),
  generateAiQuestions: (payload: {
    topic: string;
    count?: number;
    difficulty?: string;
    apiKey?: string;
    provider?: string;
    autoPublish?: boolean;
  }) => request<any>('/ai/generate-questions', { method: 'POST', body: JSON.stringify(payload) }),
  saveAiQuestions: (payload: { questions: any[]; autoPublish?: boolean }) =>
    request<any>('/ai/save-questions', { method: 'POST', body: JSON.stringify(payload) }),
  generateAiCatchwords: (payload: {
    topic: string;
    count?: number;
    apiKey?: string;
    provider?: string;
    autoSave?: boolean;
  }) => request<any>('/ai/generate-catchwords', { method: 'POST', body: JSON.stringify(payload) }),
  saveAiCatchwords: (payload: { puzzles: any[] }) =>
    request<any>('/ai/save-catchwords', { method: 'POST', body: JSON.stringify(payload) }),
  generateAiCrossword: (payload: {
    topic: string;
    keyword?: string;
    apiKey?: string;
    provider?: string;
    autoSave?: boolean;
  }) => request<any>('/ai/generate-crossword', { method: 'POST', body: JSON.stringify(payload) }),

  // ===== Game 4: Giải Mã Ô Chữ (Crossword Battle) =====
  crosswordListSets: () => request<any[]>('/crossword/question-sets'),
  crosswordGetSet: (id: string) => request<any>(`/crossword/question-sets/${id}`),
  crosswordCreateSet: (payload: any) =>
    request<any>('/crossword/question-sets', { method: 'POST', body: JSON.stringify(payload) }),
  crosswordUpdateSet: (id: string, payload: any) =>
    request<any>(`/crossword/question-sets/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  crosswordGenerateBulk: (targetQuestionCount = 1000) =>
    request<any>('/crossword/generate-bulk', {
      method: 'POST',
      body: JSON.stringify({ targetQuestionCount }),
    }),
  crosswordRandomSet: (roomCode = 'KB2026') =>
    request<any>(`/crossword/${roomCode}/random-set`, { method: 'POST' }),
  crosswordState: (roomCode = 'KB2026', withSecret = false) =>
    request<any>(`/crossword/${roomCode}/state${withSecret ? '?secret=1' : ''}`),
  crosswordConfig: (roomCode: string, payload: any) =>
    request<any>(`/crossword/${roomCode}/config`, { method: 'PUT', body: JSON.stringify(payload) }),
  crosswordSelectSet: (roomCode: string, questionSetId: string) =>
    request<any>(`/crossword/${roomCode}/select-set`, {
      method: 'POST',
      body: JSON.stringify({ questionSetId }),
    }),
  crosswordWaiting: (roomCode = 'KB2026', questionSetId?: string) =>
    request<any>(`/crossword/${roomCode}/waiting`, {
      method: 'POST',
      body: JSON.stringify({ questionSetId }),
    }),
  crosswordStart: (roomCode = 'KB2026', questionSetId?: string) =>
    request<any>(`/crossword/${roomCode}/start`, {
      method: 'POST',
      body: JSON.stringify({ questionSetId }),
    }),
  crosswordOpenRow: (roomCode: string, rowNumber: number) =>
    request<any>(`/crossword/${roomCode}/rows/${rowNumber}/open`, { method: 'POST' }),
  crosswordRevealRow: (roomCode: string, rowNumber: number) =>
    request<any>(`/crossword/${roomCode}/rows/${rowNumber}/reveal`, { method: 'POST' }),
  crosswordSkipRow: (roomCode: string, rowNumber: number) =>
    request<any>(`/crossword/${roomCode}/rows/${rowNumber}/skip`, { method: 'POST' }),
  crosswordUnlockHint: (
    roomCode: string,
    payload: { target?: 'ROW' | 'KEYWORD'; rowNumber?: number },
  ) =>
    request<any>(`/crossword/${roomCode}/hint`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  crosswordKeywordFinal: (roomCode = 'KB2026') =>
    request<any>(`/crossword/${roomCode}/keyword-final`, { method: 'POST' }),
  crosswordPause: (roomCode = 'KB2026') =>
    request<any>(`/crossword/${roomCode}/pause`, { method: 'POST' }),
  crosswordResume: (roomCode = 'KB2026') =>
    request<any>(`/crossword/${roomCode}/resume`, { method: 'POST' }),
  crosswordFinish: (roomCode = 'KB2026') =>
    request<any>(`/crossword/${roomCode}/finish`, { method: 'POST' }),
  crosswordStop: (roomCode = 'KB2026') =>
    request<any>(`/crossword/${roomCode}/stop`, { method: 'POST' }),
  crosswordResetLeaderboard: (roomCode = 'KB2026') =>
    request<any>(`/crossword/${roomCode}/reset-leaderboard`, { method: 'POST' }),
  crosswordSimulate: (roomCode: string, payload: { kind: string; count?: number }) =>
    request<any>(`/crossword/${roomCode}/simulate`, { method: 'POST', body: JSON.stringify(payload) }),
};

