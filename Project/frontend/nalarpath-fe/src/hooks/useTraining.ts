// src/hooks/useTraining.ts
import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { triggerTraining, getTrainingStatus } from '../api/careerApi';

/**
 * Hook untuk Live Training Demo.
 *
 * Cara pakai:
 *   const { start, status, isRunning, result } = useTraining();
 *
 * - Panggil `start()` untuk memulai training.
 * - `isRunning` true selama status generating_data atau training.
 * - Saat selesai/gagal, polling berhenti otomatis.
 * - `result` berisi info model baru jika berhasil.
 */
export const useTraining = () => {
  const queryClient = useQueryClient();
  const [pollingEnabled, setPollingEnabled] = useState(false);

  const { mutate: start, isPending: isStarting } = useMutation({
    mutationFn: triggerTraining,
    onSuccess: () => {
      setPollingEnabled(true);
    },
  });

  const { data: statusData } = useQuery({
    queryKey: ['trainingStatus'],
    queryFn: getTrainingStatus,
    enabled: pollingEnabled,
    refetchInterval: pollingEnabled ? 2000 : false, // poll tiap 2 detik
  });

  const isRunning =
    statusData?.status === 'generating_data' || statusData?.status === 'training' || statusData?.status === 'started';

  // Hentikan polling ketika selesai atau gagal
  useEffect(() => {
    if (
      statusData?.status === 'completed' ||
      statusData?.status === 'failed' ||
      statusData?.status === 'idle'
    ) {
      setPollingEnabled(false);
      // Refresh info model setelah training selesai
      if (statusData?.status === 'completed') {
        queryClient.invalidateQueries({ queryKey: ['modelInfo'] });
      }
    }
  }, [statusData?.status, queryClient]);

  return {
    start,
    isStarting,
    isRunning,
    status: statusData?.status ?? 'idle',
    statusData,
    result: statusData?.result ?? null,
    error: statusData?.error ?? null,
  };
};