import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Film, Image } from 'lucide-react';
import { publishVideo } from '@libiland/shared';
import { formatFileSize } from '@libiland/shared';

export default function PublishPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [tags, setTags] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        setError('视频文件不能超过500MB');
        return;
      }
      setError('');
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('请填写标题'); return; }
    if (!videoFile) { setError('请选择视频文件'); return; }
    if (!coverFile) { setError('请选择封面图片'); return; }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    formData.append('cover', coverFile);
    formData.append('video', videoFile);

    const res = await publishVideo(formData);
    setLoading(false);

    if (res.code === 200) {
      navigate('/');
    } else {
      setError(res.msg || '发布失败');
    }
  };

  const categories = [
    { value: 'game', label: '游戏' },
    { value: 'tech', label: '科技' },
    { value: 'life', label: '生活' },
    { value: 'study', label: '学习' },
    { value: 'music', label: '音乐' },
    { value: 'other', label: '其他' },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">发布视频</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error text-sm">{error}</div>
          )}

          {/* Cover Upload */}
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-4">
              <h2 className="card-title text-base">上传封面</h2>
              <div className="flex items-center gap-4">
                <div className="border-2 border-dashed border-base-300 rounded-lg w-40 h-28 flex items-center justify-center overflow-hidden">
                  {coverPreview ? (
                    <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                  ) : (
                    <Image className="w-8 h-8 text-base-content/30" />
                  )}
                </div>
                <div>
                  <input type="file" accept="image/*" className="file-input file-input-sm file-input-bordered" onChange={handleCoverChange} />
                  <p className="text-xs text-base-content/50 mt-1">支持 JPG、PNG，建议 16:9</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-4">
              <h2 className="card-title text-base">上传视频</h2>
              <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
                {videoFile ? (
                  <div className="space-y-2">
                    <Film className="w-10 h-10 mx-auto text-primary" />
                    <p className="font-medium">{videoFile.name}</p>
                    <p className="text-xs text-base-content/50">{formatFileSize(videoFile.size)}</p>
                    <button type="button" className="btn btn-xs btn-ghost" onClick={() => setVideoFile(null)}>更换</button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto text-base-content/30 mb-2" />
                    <input type="file" accept="video/*" className="file-input file-input-bordered w-full max-w-xs" onChange={handleVideoChange} />
                    <p className="text-xs text-base-content/50 mt-2">支持 MP4/AVI/MOV/MKV，最大 500MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="card bg-base-100 shadow">
            <div className="card-body gap-4">
              <h2 className="card-title text-base">视频信息</h2>

              <div className="form-control">
                <label className="label"><span className="label-text">标题 *</span></label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="视频标题（最多100字）"
                  maxLength={100}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label className="label"><span className="label-text-alt">{title.length}/100</span></label>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">简介</span></label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={4}
                  placeholder="视频简介（选填，最多500字）"
                  maxLength={500}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">分区</span></label>
                <select className="select select-bordered" value={category} onChange={(e) => setCategory(e.target.value)}>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">标签</span></label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="用逗号分隔，最多5个标签"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <label className="label"><span className="label-text-alt">如：游戏,攻略,教程</span></label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? '发布中...' : '发布视频'}
          </button>
        </form>
      </div>
    </div>
  );
}
