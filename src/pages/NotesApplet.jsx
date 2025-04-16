import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const NoteApp = () => {
  // State for notes and current note being edited
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ 
    id: null, 
    title: '', 
    content: '', 
    category: 'Personal' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['Activities', 'Food', 'Hotels', 'Transportation']);
  const [filterCategory, setFilterCategory] = useState('All');
  const [isPreview, setIsPreview] = useState(false);

  // Load notes from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save notes and categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Create a new note or update existing one
  const saveNote = () => {
    if (!currentNote.title.trim() && !currentNote.content.trim()) return;
    
    if (currentNote.id) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === currentNote.id ? currentNote : note
      ));
    } else {
      // Create new note
      const newNote = {
        ...currentNote,
        id: Date.now(),
        createdAt: new Date().toLocaleString()
      };
      setNotes([newNote, ...notes]);
    }
    
    // Reset current note
    setCurrentNote({ id: null, title: '', content: '', category: 'Activities' });
    setIsPreview(false);
  };

  // Delete a note
  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  // Edit a note (load it into the form)
  const editNote = (note) => {
    setCurrentNote(note);
    setIsPreview(false);
  };

  // Add a new category
  const addCategory = () => {
    const newCategory = prompt('Enter a new category name:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  // Filter notes based on search term and selected category
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || note.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Toggle between edit and preview modes
  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  return (
    <div className="container">
      <h1 className="main-header">Notebook</h1>
      
      {/* Note Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Note Title"
            className="w-full p-2 mb-2 border rounded"
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
              onClick={togglePreview}
              className="bg-gray-200 px-2 py-1 rounded text-sm ml-auto"
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
        
        {isPreview ? (
          <div className="border p-2 rounded mb-4 h-64 overflow-auto prose">
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
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentNote.id ? 'Update Note' : 'Add Note'}
          </button>
          {currentNote.id && (
            <button 
              onClick={() => {
                setCurrentNote({ id: null, title: '', content: '', category: 'Personal' });
                setIsPreview(false);
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex">
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
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Notes ({filteredNotes.length})</h2>
        {filteredNotes.length === 0 ? (
          <p className="text-gray-500">No notes found. Create your first note!</p>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <div key={note.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{note.title}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{note.category}</span>
                  </div>
                  <div className="space-x-2">
                    <button 
                      onClick={() => editNote(note)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="prose max-w-none mt-2">
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                </div>
                <p className="text-xs text-gray-500 mt-2">{note.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Markdown Help */}
      <div className="mt-8 p-4 bg-gray-50 rounded">
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
  );
};

export default NoteApp;