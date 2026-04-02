import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAvatar, ConfirmDialog } from '@libiland/shared';
import { useUserStore } from '@libiland/shared';
import { getProfile, updateProfile, changePassword, deleteAccount, doSignin } from '@libiland/shared';
import type { UserInfo } from '@libiland/shared';

export default function ProfilePage() {
  const { updateCoins, logout } = useUserStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getProfile().then((res) => {
      if (res.code === 200) setProfile(res.data);
      setLoading(false);
    });
  }, []);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const res = await updateProfile({
      gender: profile.gender,
      birthday: profile.birthday || undefined,
      bio: profile.bio,
    });
    setSaving(false);
    if (res.code === 200) {
      setMsg('保存成功');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) return;
    const res = await changePassword(oldPassword, newPassword);
    if (res.code === 200) {
      setShowPasswordDialog(false);
      setOldPassword('');
      setNewPassword('');
      setMsg('密码修改成功');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;
    const res = await deleteAccount(deletePassword);
    if (res.code === 200) {
      logout();
      navigate('/');
    }
  };

  const handleSignin = async () => {
    const res = await doSignin();
    if (res.code === 200) {
      updateCoins(1);
      setMsg('签到成功，获得1枚硬币');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="flex items-center justify-center min-h-64">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">个人中心</h1>

        {msg && (
          <div className="alert alert-success mb-4 text-sm">{msg}</div>
        )}

        {/* Basic Info */}
        <div className="card bg-base-100 shadow mb-6">
          <div className="card-body gap-4">
            <h2 className="card-title text-lg">基本信息</h2>
            <div className="flex items-center gap-4">
              <UserAvatar src={profile.avatar} size="lg" userId={profile.id} />
              <div>
                <p className="font-bold text-lg">{profile.username}</p>
                <p className="text-sm text-base-content/60">
                  经验值: {profile.experience}
                </p>
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">性别</span></label>
              <select
                className="select select-bordered"
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: Number(e.target.value) as 0 | 1 | 2 })}
              >
                <option value={0}>未知</option>
                <option value={1}>男</option>
                <option value={2}>女</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">生日</span></label>
              <input
                type="date"
                className="input input-bordered"
                value={profile.birthday || ''}
                onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">简介</span></label>
              <textarea
                className="textarea textarea-bordered"
                rows={3}
                placeholder="介绍一下自己"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              disabled={saving}
              onClick={handleSaveProfile}
            >
              {saving ? '保存中...' : '保存修改'}
            </button>
          </div>
        </div>

        {/* Coins & Actions */}
        <div className="card bg-base-100 shadow mb-6">
          <div className="card-body gap-4">
            <h2 className="card-title text-lg">硬币与签到</h2>
            <div className="flex items-center gap-4">
              <div className="stat bg-primary/10 rounded-lg">
                <div className="stat-title text-xs">硬币余额</div>
                <div className="stat-value text-2xl text-primary">{profile.coins}</div>
              </div>
              <button type="button" className="btn btn-warning" onClick={handleSignin}>
                每日签到
              </button>
            </div>
          </div>
        </div>

        {/* Password & Delete */}
        <div className="card bg-base-100 shadow">
          <div className="card-body gap-4">
            <h2 className="card-title text-lg">账号安全</h2>
            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowPasswordDialog(true)}
              >
                修改密码
              </button>
              <button
                type="button"
                className="btn btn-ghost text-error"
                onClick={() => setShowDeleteDialog(true)}
              >
                注销账号
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Dialog */}
      <ConfirmDialog
        open={showPasswordDialog}
        title="修改密码"
        onConfirm={handleChangePassword}
        onCancel={() => { setShowPasswordDialog(false); setOldPassword(''); setNewPassword(''); }}
        confirmText="修改"
      >
        <div className="space-y-3 py-2">
          <input type="password" className="input input-bordered w-full" placeholder="旧密码" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          <input type="password" className="input input-bordered w-full" placeholder="新密码" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
      </ConfirmDialog>

      {/* Delete Account Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="注销账号"
        message="此操作不可恢复，请输入密码确认注销"
        danger
        confirmText="确认注销"
        onConfirm={handleDeleteAccount}
        onCancel={() => { setShowDeleteDialog(false); setDeletePassword(''); }}
      >
        <div className="py-2">
          <input type="password" className="input input-bordered w-full" placeholder="请输入密码确认" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
        </div>
      </ConfirmDialog>
    </div>
  );
}
