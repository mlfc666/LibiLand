import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { ConfirmDialog } from '@libiland/shared';
import { getReportList, ignoreReport, takedownReport } from '@libiland/shared';
import type { Report } from '@libiland/shared';
import { formatDate } from '@libiland/shared';

const REPORT_REASONS: Record<number, string> = {
  1: '违法违规',
  2: '色情低俗',
  3: '暴力血腥',
  4: '垃圾广告',
  5: '其他',
};

export default function ReportHandlePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [handleId, setHandleId] = useState<{ id: number; action: 'ignore' | 'takedown' } | null>(null);
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getReportList().then((res) => {
      if (res.code === 200) setReports(res.data?.list || []);
      setLoading(false);
    });
  }, []);

  const pending = reports.filter((r) => r.status === 0);

  const handleConfirm = async () => {
    if (!handleId) return;
    setProcessing(true);
    let res;
    if (handleId.action === 'ignore') {
      res = await ignoreReport(handleId.id, note);
    } else {
      res = await takedownReport(handleId.id, note);
    }
    setProcessing(false);
    if (res.code === 200) {
      setReports((prev) => prev.map((r) => r.id === handleId.id ? { ...r, status: 1 } : r));
    }
    setHandleId(null);
    setNote('');
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 border-b border-base-200">
        <div className="flex-1">
          <span className="text-xl font-bold">举报处理</span>
        </div>
        <div className="flex-none">
          <Link to="/admin/dashboard" className="btn btn-ghost btn-sm">返回首页</Link>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        ) : pending.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-base-content/50">暂无待处理举报</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((report) => (
              <div key={report.id} className="card bg-base-100 shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{report.reporterName}</span>
                        <span className="text-base-content/40">举报了</span>
                        <a
                          className="link link-primary text-sm"
                          href={`/video/detail/${report.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          视频 #{report.videoId}
                        </a>
                        <span className="badge badge-error badge-sm">{REPORT_REASONS[report.reasonType]}</span>
                        {report.status === 0 && <span className="badge badge-warning badge-sm">待处理</span>}
                      </div>
                      {report.reasonDetail && (
                        <p className="text-sm text-base-content/60 mt-2">{report.reasonDetail}</p>
                      )}
                      <p className="text-xs text-base-content/40 mt-1">{formatDate(report.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost gap-1"
                        onClick={() => window.open(`/video/detail/${report.videoId}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                        查看视频
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-success gap-1"
                        onClick={() => setHandleId({ id: report.id, action: 'ignore' })}
                      >
                        <CheckCircle className="w-4 h-4" />
                        忽略
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-error gap-1"
                        onClick={() => setHandleId({ id: report.id, action: 'takedown' })}
                      >
                        <XCircle className="w-4 h-4" />
                        下架
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        open={handleId !== null}
        title={handleId?.action === 'ignore' ? '忽略举报' : '下架视频'}
        confirmText="确认"
        danger={handleId?.action === 'takedown'}
        onConfirm={handleConfirm}
        onCancel={() => { setHandleId(null); setNote(''); }}
      >
        <div className="py-2">
          <label className="label"><span className="label-text">处理备注</span></label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={2}
            placeholder="可选"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </ConfirmDialog>
    </div>
  );
}
