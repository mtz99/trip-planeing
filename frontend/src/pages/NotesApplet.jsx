import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import './NotesApplet.css';
import { getMessages, saveMessage, delMessage, getCategory, saveCategory, delCategory } from '../services/apiService'; //Custom axios API service to save/load notes.

const NoteApp = () => {
  // Variables for notes, categories, search, and filter
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ 
    id: null, 
    title: '', 
    content: '', 
    category: 'Activities' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['Activities', 'Food', 'Hotels', 'Transportation']);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isPreview, setIsPreview] = useState(false);

  // States to show category components
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  // Modal component for category management
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
      <div 
        className="modal-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>,
      document.body
    );
  };


  // Load notes and categories from backend on initial render
  useEffect(() => {
    document.body.classList.add('notes-body');
    
    // Fetch notes from backend
    const fetchNotes = async () => {
      try {
          const savedNotes = await getMessages({ username: 'testuser', password: 'password' });
          setNotes(savedNotes);
      } catch (error) {
          console.error('Failed to fetch messages', error);
      }
    };
    fetchNotes();
    
    const fetchCategories = async () => {
      try {
          const savedCategories = await getCategory({ username: 'testuser', password: 'password' });
          setCategories(savedCategories);
      } catch (error) {
          console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();

  }, []);

  
  // Create a new note or update existing one
  const saveNote = async () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) return;
    
    const savedNote = await saveMessage(currentNote, { username: 'testuser', password: 'password' });
    
    if (currentNote.id) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === currentNote.id ? currentNote : note
      ));
    } else {
      setNotes([savedNote, ...notes]);
    }
    
    // Reset current note
    setCurrentNote({ id: null, title: '', content: '', category: 'Activities' });
    setIsPreview(false);
  };


  // Delete a note
  const deleteNote = (id) => {
    try{
        delMessage(id, { username: 'testuser', password: 'password' });
        // Remove note from state
        setNotes(notes.filter(note => note.id !== id));
    }
    catch (error) {
        console.error('Failed to delete message', error);
    }
  };


  // Edit a note (load it into the form)
  const editNote = (note) => {
    setCurrentNote(note);
    setIsPreview(false);
  };


  // Toggle between edit and preview modes
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };


   // Filter notes based on search term and selected category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || note.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });


  // Add a new category
  const addCategory = async () => {
    const newCategory = prompt('Enter a new category name:');
    if (newCategory && !categories.includes(newCategory)) {

      const savedCategory = await saveCategory(newCategory, { username: 'testuser', password: 'password' });

      setCategories([...categories, savedCategory]);
    }
  };

  // Manage existing categories
  const openCategoryModal = async () => {
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setEditingCategory('');
    setNewCategoryName('');
  };

  const startEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category);
  };

  const saveEditCategory = () => {
    if (newCategoryName.trim() && newCategoryName !== editingCategory) {
      // Update category in categories array
      setCategories(categories.map(cat => 
        cat === editingCategory ? newCategoryName.trim() : cat
      ));
      
      // Update any existing notes that use this category
      const updatedNotes = notes.map(note => 
        note.category === editingCategory 
          ? {...note, category: newCategoryName.trim()} 
          : note
      );
      setNotes(updatedNotes);
    }
    setEditingCategory('');
    setNewCategoryName('');
  };

  const deleteCategory = (categoryToDelete) => {
    if (categories.length <= 1) {
      alert("You must have at least one category.");
      return;
    }
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${categoryToDelete}"? Notes in this category will be moved to "${categories[0]}".`);
    
    if (confirmDelete) {
      // Delete category from backend
      try{
        delCategory(categoryToDelete.id, { username: 'testuser', password: 'password' });
        // Remove category from state.
        setCategories(categories.filter(cat => cat !== categoryToDelete));
      }
      catch (error) {
          console.error('Failed to delete message', error);
      }


      // Move existing notes to first available category
      const updatedNotes = notes.map(note => 
        note.category === categoryToDelete 
          ? {...note, category: updatedCategories[0]} 
          : note
      );
      setNotes(updatedNotes);
    }
  };
 

  return (
    <>
    <div className="container">
      <h1 className="main-header">Notebook</h1>
      
      {/* Note Form */}
      <div className="child-container">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Note Title"
            className="w-full p-2 mb-4 border rounded h-64 font-mono"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
          />
          
          <div className="flex mb-2">
            <select
              className="p-2 border rounded mr-2"
              value={currentNote.category}
              onChange={(e) => setCurrentNote({...currentNote, category: e.target.value})}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button 
              onClick={addCategory}
              className="bg-gray-200 px-2 py-1 rounded text-sm"
            >
              + New Category
            </button>
            
            <button 
              onClick={openCategoryModal}
              className="bg-gray-200 px-2 py-1 rounded text-sm"
            >
              Manage Categories
            </button>
          </div>
        </div>
        
        {isPreview ? (
          <div className="subbody-text">
            <ReactMarkdown>{currentNote.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            placeholder="Note Content (Supports Markdown)"
            className="w-full p-2 mb-4 border rounded h-64 font-mono"
            value={currentNote.content}
            onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
          />
        )}
        
        <div className="flex justify-between">
          <button 
            onClick={saveNote}
            className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentNote.id ? 'Update Note' : 'Add Note'}
          </button>

          <button 
            onClick={togglePreview}
            className="bg-gray-200 px-2 py-1 rounded text-sm ml-auto"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>

          {currentNote.id && (
            <button 
              onClick={() => {
                setCurrentNote({ id: null, title: '', content: '', category: 'Activities' });
                setIsPreview(false);
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Markdown Help */}
        <div className="markdowntips-text">
          <h3 className="font-bold mb-2">Markdown Tips:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><code># Heading 1</code> for main headings</li>
            <li><code>## Heading 2</code> for subheadings</li>
            <li><code>**bold**</code> for <strong>bold text</strong></li>
            <li><code>*italic*</code> for <em>italic text</em></li>
            <li><code>- item</code> for bullet lists</li>
            <li><code>1. item</code> for numbered lists</li>
            <li><code>[link text](url)</code> for links</li>
            <li><code>![alt text](image-url)</code> for images</li>
            <li><code>```code```</code> for code blocks</li>
          </ul>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="child-container">
        <input
          type="text"
          placeholder="Search notes..."
          className="p-2 border rounded flex-grow mr-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      {/* Notes List */}
      <div className='child-container'>
        <h2 className="body-text">Your Notes ({filteredNotes.length})</h2>
        {filteredNotes.length === 0 ? (
          <p className="subbody-text">No notes found. Create your first note!</p>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="subbody-text">
                <div className="subbody-text">
                  <div>
                    <h3>{note.title}</h3>
                    <span className='category-text'>{note.category}</span>
                  </div>    
                </div>
                <div className="prose max-w-none mt-2">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
                <p className="small-text">{note.createdAt}</p>
                <div className="space-x-2">
                    <button 
                      onClick={() => editNote(note)}
                      className="EditDelButtons"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="EditDelButtons"
                    >
                      Delete
                    </button>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Category Management Modal */}
      <Modal isOpen={showCategoryModal} onClose={closeCategoryModal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Manage Categories</h2>
          <button 
            onClick={closeCategoryModal}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              margin: '0',
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categories.map(category => (
            <div key={category} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '8px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}>
              {editingCategory === category ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '4px',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      fontSize: '14px',
                    }}
                    autoFocus
                  />
                  <button 
                    onClick={saveEditCategory}
                    style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      margin: '0',
                    }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingCategory('')}
                    style={{
                      backgroundColor: '#d1d5db',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      margin: '0',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: '14px' }}>{category}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => startEditCategory(category)}
                      style={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        margin: '0',
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteCategory(category)}
                      disabled={categories.length <= 1}
                      style={{
                        backgroundColor: categories.length <= 1 ? '#ccc' : '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: categories.length <= 1 ? 'not-allowed' : 'pointer',
                        margin: '0',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #ccc' }}>
          <button 
            onClick={closeCategoryModal}
            style={{
              width: '100%',
              backgroundColor: '#f3f4f6',
              border: '1px solid #ccc',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              margin: '0',
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default NoteApp;