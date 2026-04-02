import { useState } from 'react';
import { Coins } from 'lucide-react';
import type { ApiResult } from '../../types/api';

interface CoinInputProps {
  videoId: number;
  userCoins: number;
  onSuccess?: () => void;
  className?: string;
}

export function CoinInput({ videoId, userCoins, onSuccess, className = '' }: CoinInputProps) {
  const [loading, setLoading] = useState(false);

  const handleThrowCoin = async () => {
    if (userCoins < 1) return;
    setLoading(true);
    try {
      // Mock API - replace with actual API call
      await new Promise((r) => setTimeout(r, 500));
      const mockResult: ApiResult<{ coins: number }> = {
        code: 200,
        msg: '投币成功',
        data: { coins: userCoins - 1 },
      };
      if (mockResult.code === 200) {
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Coins className="w-4 h-4 text-yellow-500" />
      <span className="text-sm text-base-content/70">{userCoins}</span>
      <button
        type="button"
        className="btn btn-xs btn-warning"
        disabled={userCoins < 1 || loading}
        onClick={handleThrowCoin}
      >
        {loading ? '投币中...' : '投币'}
      </button>
    </div>
  );
}
