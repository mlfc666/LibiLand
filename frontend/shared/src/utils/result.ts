export interface ApiError {
  code?: number;
  msg?: string;
  status?: number;
}

export function handleApiError(error: unknown): string {
  if (error && typeof error === 'object') {
    const e = error as ApiError;
    if (e.msg) return e.msg;
    if (e.code) {
      switch (e.code) {
        case 400: return '请求参数错误';
        case 401: return '请先登录';
        case 403: return '无权限或账号已被封禁';
        case 404: return '资源不存在';
        case 409: return '操作冲突';
        case 500: return '系统异常，请稍后重试';
        default: return e.msg || '未知错误';
      }
    }
    if (e.status) {
      switch (e.status) {
        case 401: return '请先登录';
        case 403: return '无权限或账号已被封禁';
        case 404: return '资源不存在';
        case 500: return '系统异常，请稍后重试';
      }
    }
  }
  return '网络异常，请稍后重试';
}

export function isAuthError(error: unknown): boolean {
  if (error && typeof error === 'object') {
    const e = error as ApiError;
    return e.code === 401 || e.status === 401;
  }
  return false;
}
