import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Edit2, LogOut } from 'lucide-react';
import api from '../api/api';
import { authActions } from '../store/authSlice';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import Modal from '../components/ui/Modal';
import { useAuth0 } from "@auth0/auth0-react";

const UserDetails = () => {
  const { logout, user } = useAuth0();
  const dispatch = useDispatch();
  const userMetadata = useSelector(state => state.auth.userMetadata);
  const accessToken = useSelector(state => state.auth.token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(userMetadata?.user_metadata?.name || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const response = await api.User.updateName(userMetadata?.sub || user?.sub, accessToken, {
        "user_metadata": { "name": name }
      });
      if (response) {
        dispatch(authActions.updateMetadata({
          index: "user_metadata",
          name: response?.user_metadata?.name || name
        }));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
          <p className="text-muted-foreground">Manage your profile and account preferences.</p>
        </div>
        <Button
          variant="destructive"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          className="self-start shadow-lg shadow-destructive/20"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <Card className="card-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Profile Information</CardTitle>
          {/* <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Info
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-xl">
                {(userMetadata?.picture || user?.picture) ? (
                  <img src={userMetadata?.picture || user?.picture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full text-center sm:text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                <p className="text-base font-medium">
                  {userMetadata?.user_metadata?.name || user?.name || 'Not set'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                <p className="text-base font-medium flex items-center justify-center sm:justify-start truncate">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                  {userMetadata?.email || user?.email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Profile"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="Enter your name"
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDetails;
