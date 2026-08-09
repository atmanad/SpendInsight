import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Tags, Hash } from 'lucide-react';
import api from '../api/api';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import Modal from '../components/ui/Modal';

const CategoryManagement = ({ user }) => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.Category.list(user.sub);
      if (response.status === 200) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setSubmitting(true);
    try {
      const response = await api.Category.insert({
        userId: user.sub,
        categoryName: newCategory,
      });
      if (response.status === 200) {
        setNewCategory('');
        setShowModal(false);
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await api.Category.delete({
          userId: user.sub,
          categoryId: categoryId,
        });
        if (response.status === 200) {
          fetchCategories();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Organize your expenses with custom categories.</h2>
        </div>
        <Button onClick={() => setShowModal(true)} className="self-start">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="card-shadow overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
            <Tags className="w-4 h-4 mr-2" />
            Active Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="divide-y divide-border">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center justify-between p-4 px-6 hover:bg-muted/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Hash className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{category.categoryName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCategory(category._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground italic">
              No categories found. Click "Add Category" to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleAddCategory} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Category'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Category Name</label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. Groceries, Rent, Travel"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
