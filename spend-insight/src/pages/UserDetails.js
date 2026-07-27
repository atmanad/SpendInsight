import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Shield, Edit2, LogOut, Camera } from 'lucide-react';
import api from '../api/api';
import { authActions } from '../store/authSlice';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import Modal from '../components/ui/Modal';
import { useAuth0 } from "@auth0/auth0-react";

const UserDetails = () => {
  const { logout } = useAuth0();
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
      const response = await api.User.updateName(userMetadata.user_id, accessToken, {
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
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
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

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="card-shadow text-center">
            <CardContent className="pt-8">
              <div className="relative inline-block group mb-4">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-xl transition-transform group-hover:scale-105">
                  {userMetadata?.picture ? (
                    <img src={userMetadata.picture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 bg-card border border-border rounded-xl shadow-lg text-muted-foreground hover:text-primary transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-xl font-bold">{userMetadata?.user_metadata?.name || 'User'}</h3>
              <p className="text-sm text-muted-foreground mb-6">{userMetadata?.email}</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/20">
                  Pro Account
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Info
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <p className="text-base font-medium flex items-center">
                    {userMetadata?.user_metadata?.name || 'Not set'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <p className="text-base font-medium flex items-center truncate">
                    <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                    {userMetadata?.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Status</label>
                  <p className="text-base font-medium flex items-center text-emerald-500">
                    <Shield className="w-4 h-4 mr-2" />
                    Verified User
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          </div>
      </div>

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
